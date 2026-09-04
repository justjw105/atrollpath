import { Component, OnDestroy, inject, signal } from '@angular/core';
import { EasterEggService } from '../../core/services/easter-egg.service';
import { SfxService } from '../../core/services/sfx.service';

interface Firefly {
  id: number;
  x: number;
  y: number;
}

const GAME_DURATION_S = 22;
const SPAWN_INTERVAL_MS = 550;
const MAX_CONCURRENT = 6;
const FIREFLY_LIFESPAN_MS = 1700;
const BEST_SCORE_KEY = 'atrollpath.fireflies.bestScore';

type GameState = 'idle' | 'playing' | 'ended';

/**
 * "Catch the Fireflies" — a tiny reflex mini-game hidden behind a secret
 * spot in the hero scene's atmospheric detour panorama. No real reward,
 * just a bit of fun. Self-contained: owns its own spawn/countdown timers
 * and cleans them up on close/destroy so nothing leaks when the modal
 * isn't open.
 *
 * Tier 1 "leaderboard": just a personal best, persisted to localStorage.
 * No shared/global leaderboard yet — that would need a real backend
 * (Firestore is the natural fit given this project is on Firebase) plus
 * at least light score validation, so it's a deliberately separate,
 * bigger follow-up rather than bundled in here.
 */
@Component({
  selector: 'app-mini-game',
  standalone: true,
  templateUrl: './mini-game.component.html',
  styleUrl: './mini-game.component.scss'
})
export class MiniGameComponent implements OnDestroy {
  readonly eggs = inject(EasterEggService);
  private readonly sfx = inject(SfxService);

  readonly state = signal<GameState>('idle');
  readonly score = signal(0);
  readonly timeLeft = signal(GAME_DURATION_S);
  readonly fireflies = signal<Firefly[]>([]);
  readonly bestScore = signal(this.readBestScore());
  readonly isNewBest = signal(false);

  private spawnTimer?: ReturnType<typeof setInterval>;
  private countdownTimer?: ReturnType<typeof setInterval>;
  private nextId = 0;

  get resultMessage(): string {
    const s = this.score();
    if (s >= 10) return 'The troll bows to your firefly-catching mastery! 🏆';
    if (s >= 5) return "Not bad at all — the fireflies will remember you. ✨";
    return 'The fireflies outsmarted you this time... try again?';
  }

  start(): void {
    this.clearTimers();
    this.score.set(0);
    this.timeLeft.set(GAME_DURATION_S);
    this.fireflies.set([]);
    this.isNewBest.set(false);
    this.state.set('playing');
    this.sfx.play('chime');

    this.spawnTimer = setInterval(() => this.spawn(), SPAWN_INTERVAL_MS);
    this.countdownTimer = setInterval(() => {
      this.timeLeft.update((t) => t - 1);
      if (this.timeLeft() <= 0) {
        this.end();
      }
    }, 1000);
  }

  catch(id: number): void {
    if (this.state() !== 'playing') return;
    this.fireflies.update((list) => list.filter((f) => f.id !== id));
    this.score.update((s) => s + 1);
    this.sfx.play('pop');
  }

  close(): void {
    this.clearTimers();
    this.state.set('idle');
    this.eggs.closeGame();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private spawn(): void {
    this.fireflies.update((list) => {
      if (list.length >= MAX_CONCURRENT) return list;
      const id = this.nextId++;
      const firefly: Firefly = {
        id,
        x: 8 + Math.random() * 84,
        y: 12 + Math.random() * 70
      };
      setTimeout(() => {
        this.fireflies.update((current) => current.filter((f) => f.id !== id));
      }, FIREFLY_LIFESPAN_MS);
      return [...list, firefly];
    });
  }

  private end(): void {
    this.clearTimers();
    this.fireflies.set([]);
    this.state.set('ended');

    const finalScore = this.score();
    if (finalScore > this.bestScore()) {
      this.bestScore.set(finalScore);
      this.isNewBest.set(true);
      this.persistBestScore(finalScore);
    }

    this.sfx.play('sparkle');
  }

  private clearTimers(): void {
    if (this.spawnTimer) clearInterval(this.spawnTimer);
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.spawnTimer = undefined;
    this.countdownTimer = undefined;
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
