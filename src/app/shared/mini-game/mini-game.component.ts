import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EasterEggService } from '../../core/services/easter-egg.service';
import { SfxService } from '../../core/services/sfx.service';
import { LeaderboardEntry, LeaderboardService } from '../../core/services/leaderboard.service';

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
const PLAYER_NAME_KEY = 'atrollpath.leaderboard.playerName';

type GameState = 'idle' | 'playing' | 'ended';
type SubmitState = 'idle' | 'submitting' | 'done' | 'error';

/**
 * "Catch the Fireflies" — a tiny reflex mini-game hidden behind a secret
 * spot in the hero scene's atmospheric detour panorama. No real reward,
 * just a bit of fun. Self-contained: owns its own spawn/countdown timers
 * and cleans them up on close/destroy so nothing leaks when the modal
 * isn't open.
 *
 * Tier 1 "personal best" stays local (localStorage) as before. Tier 2 adds
 * a real, global Top 10 leaderboard via Firestore (LeaderboardService) —
 * visible any time the modal is open, with a name+submit form on the
 * "ended" screen so a run can be added to the board.
 */
@Component({
  selector: 'app-mini-game',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mini-game.component.html',
  styleUrl: './mini-game.component.scss'
})
export class MiniGameComponent implements OnDestroy {
  readonly eggs = inject(EasterEggService);
  private readonly sfx = inject(SfxService);
  private readonly leaderboard = inject(LeaderboardService);

  readonly state = signal<GameState>('idle');
  readonly score = signal(0);
  readonly timeLeft = signal(GAME_DURATION_S);
  readonly fireflies = signal<Firefly[]>([]);
  readonly bestScore = signal(this.readBestScore());
  readonly isNewBest = signal(false);

  readonly topScores = signal<LeaderboardEntry[]>([]);
  readonly playerName = signal(this.readStoredName());
  readonly submitState = signal<SubmitState>('idle');

  private spawnTimer?: ReturnType<typeof setInterval>;
  private countdownTimer?: ReturnType<typeof setInterval>;
  private nextId = 0;

  constructor() {
    this.refreshLeaderboard();
  }

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
    this.submitState.set('idle');
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

  async submitToLeaderboard(): Promise<void> {
    const name = this.playerName().trim();
    if (!name || this.submitState() === 'submitting') return;

    this.submitState.set('submitting');
    this.persistName(name);

    const result = await this.leaderboard.submitScore('fireflies', name, this.score());
    if (result === 'ok') {
      this.submitState.set('done');
      await this.refreshLeaderboard();
    } else {
      this.submitState.set('error');
    }
  }

  private async refreshLeaderboard(): Promise<void> {
    this.topScores.set(await this.leaderboard.getTop('fireflies'));
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

  private readStoredName(): string {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem(PLAYER_NAME_KEY) ?? '';
  }

  private persistName(name: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(PLAYER_NAME_KEY, name);
  }
}
