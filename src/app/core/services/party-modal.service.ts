import { Injectable, signal } from '@angular/core';

/**
 * Toggles the global "Join the Party" signup modal — opened from the HUD
 * button (available on every scene) so signing up never requires leaving
 * whatever you're currently doing. Kept as its own tiny service (same
 * pattern as EasterEggService.activeGame) rather than folding into
 * SceneService, since it's unrelated to scene navigation.
 */
@Injectable({ providedIn: 'root' })
export class PartyModalService {
  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
