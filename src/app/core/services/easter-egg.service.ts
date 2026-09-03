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
  /**
   * 'hidden' (default) stays nearly invisible until hovered/tapped — the
   * classic "you have to go looking for it" easter egg. 'ambient' stays
   * visibly present, gently twinkling/drifting like the painted fireflies
   * already in that scene, and bursts brighter on hover — findable by
   * design, since it's the entry point to the mini-game rather than a
   * pure discovery reward.
   */
  variant?: 'hidden' | 'ambient';
  /** 'md' (default) or 'lg' for a noticeably bigger icon + glow. */
  size?: 'md' | 'lg';
  /**
   * Optional pool of candidate positions. When present, one is picked at
   * random each time the secret is rendered (i.e. each time you visit
   * that scene) instead of always using x/y — so it's not in the exact
   * same spot every visit. x/y above still act as the fallback/default.
   */
  spots?: { x: number; y: number }[];
}

/** Picks a random position for a secret — one of its `spots` if defined, otherwise its fixed x/y. */
export function resolveSecretSpot(secret: SecretDef): { x: number; y: number } {
  if (secret.spots && secret.spots.length > 0) {
    const i = Math.floor(Math.random() * secret.spots.length);
    return secret.spots[i];
  }
  return { x: secret.x, y: secret.y };
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
    variant: 'ambient',
    title: 'A Lucky Firefly',
    message:
      "It circles you once, twice, and leaves a little shimmer of luck hanging in the air. The woods hold more than one secret, if you know where to look.",
    spots: [
      { x: 9, y: 78 },
      { x: 46, y: 83 },
      { x: 73, y: 82 },
      { x: 90, y: 72 }
    ]
  },
  {
    id: 'coin-treasure',
    sceneId: 'featured',
    x: 10,
    y: 16,
    icon: '🪙',
    title: "The Troll's Spare Change",
    message:
      "Tucked behind a shelf: a single old coin, worn smooth from years of counting. Not worth much to spend — but every troll needs a lucky coin."
  },
  {
    id: 'cat-tower',
    sceneId: 'gallery',
    x: 6,
    y: 16,
    icon: '🐱',
    size: 'lg',
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
    triggersGame: true,
    variant: 'ambient',
    spots: [
      { x: 52, y: 62 },
      { x: 24, y: 58 },
      { x: 68, y: 48 },
      { x: 82, y: 66 }
    ]
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
