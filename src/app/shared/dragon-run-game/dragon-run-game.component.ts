import { Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { EasterEggService } from '../../core/services/easter-egg.service';
import { SfxService } from '../../core/services/sfx.service';

interface Sprite {
  id: number;
  x: number;
  y: number;
}

type GameState = 'idle' | 'playing' | 'ended';

const DRAGON_Y = 84;
const DRAGON_MOVE_MARGIN = 8; // keeps the dragon within [margin, 100 - margin] horizontally

const BASE_SPEED = 34; // % of game-area height per second, at the start
const MAX_SPEED = 78;
const SPEED_RAMP_PER_SEC = 1.1;

const BASE_OBSTACLE_INTERVAL_MS = 850;
const MIN_OBSTACLE_INTERVAL_MS = 380;
const OBSTACLE_INTERVAL_RAMP_MS_PER_SEC = 12;
const COIN_INTERVAL_MS = 1100;

const OBSTACLE_HIT_X = 9;
const OBSTACLE_HIT_Y = 7;
const COIN_HIT_X = 11;
const COIN_HIT_Y = 9;

const DISTANCE_PER_SEC = 12;
const COIN_VALUE = 5;
const BEST_SCORE_KEY = 'atrollpath.dragonRun.bestScore';

/**
 * "Dragon Run" — a hidden, top-down endless dodger. You control a dragon
 * near the bottom of the frame (mouse/touch drag, or arrow keys); rocks
 * fall from the top and end the run on contact (one life, no health bar);
 * coins fall too and add to your score. Score = distance survived + coins.
 *
 * Self-contained: owns its own requestAnimationFrame loop and spawn
 * timers, all torn down on close/destroy so nothing runs while the modal
 * isn't open. Tier-1 "leaderboard" only (personal best via localStorage) —
 * same pattern as the fireflies game.
 */
@Component({
  selector: 'app-dragon-run-game',
  standalone: true,
  templateUrl: './dragon-run-game.component.html',
  styleUrl: './dragon-run-game.component.scss'
})
export class DragonRunGameComponent implements OnDestroy {
  readonly eggs = inject(EasterEggService);
  private readonly sfx = inject(SfxService);

  @ViewChild('area') private areaRef?: ElementRef<HTMLElement>;

  readonly state = signal<GameState>('idle');
  readonly dragonX = signal(50);
  readonly obstacles = signal<Sprite[]>([]);
  readonly coins = signal<Sprite[]>([]);
  readonly distance = signal(0);
  readonly coinsCollected = signal(0);
  readonly bestScore = signal(this.readBestScore());
  readonly isNewBest = signal(false);

  private rafId: number | null = null;
  private lastTimestamp = 0;
  private obstacleSpawnAcc = 0;
  private coinSpawnAcc = 0;
  private nextId = 0;
  private dragging = false;

  get score(): number {
    return Math.floor(this.distance()) + this.coinsCollected() * COIN_VALUE;
  }

  get resultMessage(): string {
    const s = this.score;
    if (s >= 200) return 'A true wyrm of the skies. Legendary run! 🏆';
    if (s >= 80) return 'Strong flying — the cave winds favor you. 🐉';
    return 'The rocks win this round... try again?';
  }

  start(): void {
    this.stopLoop();
    this.dragonX.set(50);
    this.obstacles.set([]);
    this.coins.set([]);
    this.distance.set(0);
    this.coinsCollected.set(0);
    this.isNewBest.set(false);
    this.obstacleSpawnAcc = 0;
    this.coinSpawnAcc = 0;
    this.state.set('playing');
    this.sfx.play('chime');

    this.lastTimestamp = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  close(): void {
    this.stopLoop();
    this.dragging = false;
    this.state.set('idle');
    this.eggs.closeGame();
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    this.updateDragonFromPointer(event);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging) return;
    this.updateDragonFromPointer(event);
  }

  onPointerUp(): void {
    this.dragging = false;
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.state() !== 'playing') return;
    const STEP = 6;
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
      this.dragonX.update((x) => Math.max(DRAGON_MOVE_MARGIN, x - STEP));
      event.preventDefault();
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
      this.dragonX.update((x) => Math.min(100 - DRAGON_MOVE_MARGIN, x + STEP));
      event.preventDefault();
    }
  }

  private updateDragonFromPointer(event: PointerEvent): void {
    const el = this.areaRef?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((event.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(100 - DRAGON_MOVE_MARGIN, Math.max(DRAGON_MOVE_MARGIN, pct));
    this.dragonX.set(clamped);
  }

  private tick = (timestamp: number): void => {
    const dtMs = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    const dt = Math.min(dtMs, 80) / 1000; // clamp so a dropped frame / tab-switch can't cause a huge jump

    const elapsedSec = this.distance() / DISTANCE_PER_SEC;
    const speed = Math.min(MAX_SPEED, BASE_SPEED + elapsedSec * SPEED_RAMP_PER_SEC);

    // Advance falling sprites.
    this.obstacles.update((list) => list.map((o) => ({ ...o, y: o.y + speed * dt })).filter((o) => o.y < 108));
    this.coins.update((list) => list.map((c) => ({ ...c, y: c.y + speed * dt })).filter((c) => c.y < 108));

    // Spawn timers.
    this.obstacleSpawnAcc += dtMs;
    const obstacleInterval = Math.max(
      MIN_OBSTACLE_INTERVAL_MS,
      BASE_OBSTACLE_INTERVAL_MS - elapsedSec * OBSTACLE_INTERVAL_RAMP_MS_PER_SEC
    );
    if (this.obstacleSpawnAcc >= obstacleInterval) {
      this.obstacleSpawnAcc = 0;
      this.spawnObstacle();
    }

    this.coinSpawnAcc += dtMs;
    if (this.coinSpawnAcc >= COIN_INTERVAL_MS) {
      this.coinSpawnAcc = 0;
      this.spawnCoin();
    }

    this.distance.update((d) => d + DISTANCE_PER_SEC * dt);

    this.checkCollisions();

    if (this.state() === 'playing') {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  private spawnObstacle(): void {
    this.obstacles.update((list) => [
      ...list,
      { id: this.nextId++, x: 10 + Math.random() * 80, y: -6 }
    ]);
  }

  private spawnCoin(): void {
    this.coins.update((list) => [...list, { id: this.nextId++, x: 10 + Math.random() * 80, y: -6 }]);
  }

  private checkCollisions(): void {
    const dx = this.dragonX();

    for (const o of this.obstacles()) {
      if (Math.abs(o.x - dx) < OBSTACLE_HIT_X && Math.abs(o.y - DRAGON_Y) < OBSTACLE_HIT_Y) {
        this.gameOver();
        return;
      }
    }

    const remainingCoins = this.coins().filter((c) => {
      const hit = Math.abs(c.x - dx) < COIN_HIT_X && Math.abs(c.y - DRAGON_Y) < COIN_HIT_Y;
      if (hit) {
        this.coinsCollected.update((n) => n + 1);
        this.sfx.play('pop');
      }
      return !hit;
    });
    if (remainingCoins.length !== this.coins().length) {
      this.coins.set(remainingCoins);
    }
  }

  private gameOver(): void {
    this.stopLoop();
    this.obstacles.set([]);
    this.coins.set([]);
    this.state.set('ended');
    this.sfx.play('thud');

    const finalScore = this.score;
    if (finalScore > this.bestScore()) {
      this.bestScore.set(finalScore);
      this.isNewBest.set(true);
      this.persistBestScore(finalScore);
    }
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private readBestScore(): number {
    if (typeof localStorage === 'undefined') return 0;
    const raw = localStorage.getItem(BEST_SCORE_KEY);
    const parsed = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private persistBestScore(score: number): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  }
}
