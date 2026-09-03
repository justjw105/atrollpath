import { Injectable, signal } from '@angular/core';

type SfxName = 'chime' | 'tick' | 'whoosh' | 'sparkle' | 'pop';

const SOURCES: Record<SfxName, string> = {
  chime: 'assets/sfx/chime.mp3',
  tick: 'assets/sfx/tick.mp3',
  whoosh: 'assets/sfx/whoosh.mp3',
  sparkle: 'assets/sfx/sparkle.mp3',
  pop: 'assets/sfx/pop.mp3'
};

const STORAGE_KEY = 'atrollpath.sfx.enabled';

/**
 * Tiny sound-effect player for game-feel feedback (hotspot hover ticks,
 * scene-travel chime/whoosh, secret-found sparkle, mini-game catch pop).
 * Respects a mute toggle persisted to localStorage and only actually
 * unlocks playback after a user gesture (browsers block autoplay before
 * that).
 */
@Injectable({ providedIn: 'root' })
export class SfxService {
  readonly enabled = signal<boolean>(this.readStoredPreference());

  private unlocked = false;
  private readonly pool: Partial<Record<SfxName, HTMLAudioElement>> = {};

  private readStoredPreference(): boolean {
    if (typeof localStorage === 'undefined') return true;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  }

  toggle(): void {
    this.enabled.update((v) => {
      const next = !v;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  }

  /** Call once from a real user gesture (splash click) to satisfy autoplay policy. */
  unlock(): void {
    if (this.unlocked || typeof Audio === 'undefined') return;
    this.unlocked = true;
    for (const name of Object.keys(SOURCES) as SfxName[]) {
      const audio = new Audio(SOURCES[name]);
      audio.volume = name === 'tick' || name === 'pop' ? 0.35 : 0.5;
      audio.preload = 'auto';
      this.pool[name] = audio;
    }
  }

  play(name: SfxName): void {
    if (!this.enabled() || !this.unlocked) return;
    const audio = this.pool[name];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {
      /* ignore autoplay rejections */
    });
  }
}
