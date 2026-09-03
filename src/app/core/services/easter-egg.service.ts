import { Injectable, computed, inject, signal } from '@angular/core';
import { SfxService } from './sfx.service';

export interface SecretDef {
  id: string;
  /** Which scene this is hidden in — for reference/organization only. */
  sceneId: string;
  /** For hero-scene secrets only: which panorama copy (A = main landmarks, B = the atmospheric detour). */
  copyKind?: 'A' | 'B';
  x: number;
  y: number;
  icon: string;
  title: string;
  message: string;
  /** If true, clicking this opens the mini-game instead of showing a reveal card. */
  triggersGame?: boolean;
}

/**
 * GROWTH POINT: this is the single source of truth for hidden secrets.
 * Add an entry here and place a matching <app-hidden-secret> in whichever
 * scene's template — the found/persisted state, the reveal card, and the
 * "X of Y found" counter all pick it up automatically.
 */
export const SECRETS: SecretDef[] = [
  {
    id: 'firefly-hero',
    sceneId: 'hero',
    copyKind: 'A',
    x: 9,
    y: 78,
    icon: '✨',
    title: 'A Lucky Firefly',
    message:
      "It circles you once, twice, and leaves a little shimmer of luck hanging in the air. The woods hold more than one secret, if you know where to look."
  },
  {
    id: 'coin-treasure',
    sceneId: 'featured',
    x: 50,
    y: 42,
    icon: '🪙',
    title: "The Troll's Spare Change",
    message:
      "Tucked behind a shelf: a single old coin, worn smooth from years of counting. Not worth much to spend — but every troll needs a lucky coin."
  },
  {
    id: 'cat-tower',
    sceneId: 'gallery',
    x: 14,
    y: 34,
    icon: '🐈',
    title: 'The Workshop Cat',
    message:
      "Shh — don't wake her. She's curled up by the kiln, dreaming of yarn and stray glass shimmer. She approves of your work, quietly."
  },
  {
    id: 'firefly-swarm-game',
    sceneId: 'hero',
    copyKind: 'B',
    x: 52,
    y: 62,
    icon: '✨',
    title: 'The Fireflies Stir',
    message: '',
    triggersGame: true
  }
];

const STORAGE_KEY = 'atrollpath.secrets.found';

@Injectable({ providedIn: 'root' })
export class EasterEggService {
  private readonly sfx = inject(SfxService);

  readonly foundIds = signal<Set<string>>(this.readStored());
  readonly activeReveal = signal<SecretDef | null>(null);
  readonly gameOpen = signal(false);

  /** The mini-game trigger doesn't count toward the collectible total. */
  private readonly countable = SECRETS.filter((s) => !s.triggersGame);
  readonly totalCount = this.countable.length;
  readonly foundCount = computed(() => this.countable.filter((s) => this.foundIds().has(s.id)).length);

  isFound(id: string): boolean {
    return this.foundIds().has(id);
  }

  discover(secret: SecretDef): void {
    if (secret.triggersGame) {
      this.sfx.play('sparkle');
      this.gameOpen.set(true);
      return;
    }

    if (!this.foundIds().has(secret.id)) {
      const next = new Set(this.foundIds());
      next.add(secret.id);
      this.foundIds.set(next);
      this.persist(next);
    }

    this.sfx.play('sparkle');
    this.activeReveal.set(secret);
  }

  closeReveal(): void {
    this.activeReveal.set(null);
  }

  closeGame(): void {
    this.gameOpen.set(false);
  }

  private readStored(): Set<string> {
    if (typeof localStorage === 'undefined') return new Set();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  }

  private persist(ids: Set<string>): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  }
}
