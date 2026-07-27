import { Injectable, inject, signal } from '@angular/core';
import { SfxService } from './sfx.service';

export interface SceneNode {
  id: string;
  label: string;
  /** position on the world-map overlay AND the hero map art, 0-100 (%) on both axes */
  x: number;
  y: number;
}

/**
 * GROWTH POINT: add a new scene to the game by:
 *  1. Adding an entry to SCENES below (id must be unique).
 *  2. Creating a component under features/home/<scene-name>/ and adding it
 *     to the switch in home.component.html.
 *  3. Wiring a hotspot to it from whichever scene should lead there.
 * The map overlay and HUD pick new scenes up automatically.
 *
 * x/y here are calibrated to match the actual landmarks painted into
 * hero-map.png (the tree cave-door, the workshop tower, the rocky
 * cave entrance, and the path receding into the distance) so the
 * overlay markers land on the right spots.
 */
export const SCENES: SceneNode[] = [
  { id: 'hero', label: 'The Path', x: 50, y: 88 },
  { id: 'featured', label: 'Treasure Room', x: 20, y: 58 },
  { id: 'gallery', label: "The Maker's Tower", x: 57, y: 32 },
  { id: 'visit', label: 'Troll Cave Exit', x: 87, y: 60 },
  { id: 'friends', label: 'Friends of the Troll', x: 42, y: 49 }
];

export type TransitionPhase = 'idle' | 'closing' | 'open-black' | 'opening';

const IRIS_CLOSE_MS = 480;
const IRIS_HOLD_MS = 140;
const IRIS_OPEN_MS = 520;

@Injectable({ providedIn: 'root' })
export class SceneService {
  private readonly sfx = inject(SfxService);

  readonly activeSceneId = signal<string>(SCENES[0].id);
  readonly phase = signal<TransitionPhase>('idle');
  readonly isMapOpen = signal(false);

  private navToken = 0;

  navigateTo(id: string): void {
    if (id === this.activeSceneId() || this.phase() !== 'idle') {
      return;
    }

    const token = ++this.navToken;
    this.isMapOpen.set(false);
    this.sfx.play('whoosh');
    this.phase.set('closing');

    setTimeout(() => {
      if (token !== this.navToken) return;
      this.activeSceneId.set(id);
      this.phase.set('open-black');

      setTimeout(() => {
        if (token !== this.navToken) return;
        this.phase.set('opening');
        this.sfx.play('chime');

        setTimeout(() => {
          if (token !== this.navToken) return;
          this.phase.set('idle');
        }, IRIS_OPEN_MS);
      }, IRIS_HOLD_MS);
    }, IRIS_CLOSE_MS);
  }

  toggleMap(): void {
    this.isMapOpen.update((v) => !v);
  }

  closeMap(): void {
    this.isMapOpen.set(false);
  }
}
