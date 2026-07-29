import { Location } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { SfxService } from './sfx.service';
import { SeoService, SceneSeo } from './seo.service';

export interface SceneNode {
  id: string;
  label: string;
  /** position on the world-map overlay AND the hero map art, 0-100 (%) on both axes */
  x: number;
  y: number;
  /** real, crawlable URL path for this scene, e.g. '/treasure-room' */
  path: string;
}

/**
 * GROWTH POINT: add a new scene to the game by:
 *  1. Adding an entry to SCENES below (id must be unique) — `path` must
 *     match a route added to app.routes.ts.
 *  2. Adding matching SEO copy to SCENE_SEO below.
 *  3. Creating a component under features/home/<scene-name>/ and adding it
 *     to the switch in home.component.html.
 *  4. Wiring a hotspot to it from whichever scene should lead there.
 * The map overlay, HUD, routing, and SEO tags all pick new scenes up
 * automatically from these two maps.
 *
 * x/y here are calibrated to match the actual landmarks painted into
 * hero-map.png (the tree cave-door, the workshop tower, the rocky
 * cave entrance, and the path receding into the distance) so the
 * overlay markers land on the right spots.
 */
export const SCENES: SceneNode[] = [
  { id: 'hero', label: 'The Path', x: 50, y: 88, path: '/' },
  { id: 'featured', label: 'Treasure Room', x: 20, y: 58, path: '/treasure-room' },
  { id: 'friends', label: 'Friends of the Troll', x: 42, y: 49, path: '/friends-of-the-troll' },
  { id: 'gallery', label: "The Maker's Tower", x: 57, y: 32, path: '/the-makers-tower' },
  { id: 'visit', label: 'Troll Cave Exit', x: 87, y: 60, path: '/troll-cave' }
];

/** SEO copy per scene — title/description weave in the shop's target search terms naturally. */
const SCENE_SEO: Record<string, SceneSeo> = {
  hero: {
    path: '/',
    title: 'ATrollPath | Whimsical Custom Stained Glass & Fantasy Gifts',
    description:
      'Handmade custom stained glass etching, 3D-printed dragon egg paint kits, and whimsical fantasy gifts and crafts from the Troll Cave. Explore our world and shop custom-made treasures.'
  },
  featured: {
    path: '/treasure-room',
    title: 'Treasure Room | Custom Stained Glass Lanterns & Dragon Egg Kits — ATrollPath',
    description:
      'Browse our Elemental Avatar Lantern, hand-etched in custom stained glass, and our 3D-printed Dragon Egg Paint Kit — whimsical fantasy gifts handmade at ATrollPath.',
    image: '/assets/img/scene-treasure-room.webp'
  },
  friends: {
    path: '/friends-of-the-troll',
    title: 'Friends of the Troll | Fellow Fantasy Craft Makers — ATrollPath',
    description:
      'Meet fellow fantasy crafts and fantasy gifts makers we love and want to send you to — friends of the Troll from across the woods.',
    image: '/assets/img/scene-friends-crossroads.webp'
  },
  gallery: {
    path: '/the-makers-tower',
    title: "The Maker's Tower | Custom Glass Etching Commissions — ATrollPath",
    description:
      'Commission a one-of-a-kind custom glass etching, including memorial lanterns, designed personally with you at the Maker’s Tower.',
    image: '/assets/img/scene-workbench.webp'
  },
  visit: {
    path: '/troll-cave',
    title: 'Visit the Troll Cave | Shop ATrollPath on Etsy',
    description:
      'Step into the Troll Cave and shop handmade custom stained glass, glass etching, and whimsical fantasy gifts on Etsy.',
    image: '/assets/img/scene-cave-door.webp'
  }
};

const PATH_TO_SCENE: Record<string, string> = Object.fromEntries(SCENES.map((s) => [s.path, s.id]));

export type TransitionPhase = 'idle' | 'closing' | 'open-black' | 'opening';

const IRIS_CLOSE_MS = 480;
const IRIS_HOLD_MS = 140;
const IRIS_OPEN_MS = 520;

@Injectable({ providedIn: 'root' })
export class SceneService {
  private readonly sfx = inject(SfxService);
  private readonly seo = inject(SeoService);
  private readonly location = inject(Location);

  readonly activeSceneId = signal<string>(SCENES[0].id);
  readonly phase = signal<TransitionPhase>('idle');
  readonly isMapOpen = signal(false);

  private navToken = 0;

  constructor() {
    // Browser back/forward: sync the scene (with the same animation) without re-pushing history.
    this.location.subscribe((event) => {
      const path = (event.url ?? '/').split(/[?#]/)[0] || '/';
      const id = PATH_TO_SCENE[path];
      if (id && id !== this.activeSceneId()) {
        this.navigateTo(id, { updateHistory: false });
      }
    });
  }

  /** Called once on app boot with the scene matched from the initial route — no animation, no history push. */
  setInitialScene(id: string): void {
    const resolved = SCENE_SEO[id] ? id : SCENES[0].id;
    this.activeSceneId.set(resolved);
    this.applySeo(resolved);
  }

  navigateTo(id: string, options: { updateHistory?: boolean } = {}): void {
    if (id === this.activeSceneId() || this.phase() !== 'idle') {
      return;
    }

    const updateHistory = options.updateHistory ?? true;
    const token = ++this.navToken;
    this.isMapOpen.set(false);
    this.sfx.play('whoosh');
    this.phase.set('closing');

    setTimeout(() => {
      if (token !== this.navToken) return;
      this.activeSceneId.set(id);
      this.applySeo(id);
      if (updateHistory) {
        const path = SCENES.find((s) => s.id === id)?.path ?? '/';
        this.location.go(path);
      }
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

  private applySeo(id: string): void {
    const seo = SCENE_SEO[id];
    if (seo) {
      this.seo.apply(seo);
    }
  }
}
