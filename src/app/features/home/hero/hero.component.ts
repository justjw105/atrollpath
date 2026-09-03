import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { SceneService } from '../../../core/services/scene.service';
import { HotspotComponent } from '../../../shared/hotspot/hotspot.component';
import { EdgeArrowComponent } from '../../../shared/edge-arrow/edge-arrow.component';
import { EdgeScrollDirective } from '../../../shared/edge-scroll/edge-scroll.directive';

interface MapHotspot {
  id: string;
  x: number;
  y: number;
  icon: 'door' | 'sign' | 'chest' | 'exit';
  label: string;
  target: string;
}

/**
 * True aspect ratio of both hero-panorama*.webp files (3456 / 1152). Kept as
 * an exact constant so the copy width can be computed analytically from the
 * viewport height alone — no waiting on image load / ResizeObserver.
 */
const IMAGE_ASPECT = 3;

/**
 * Full 360° panning around a loop made of TWO distinct panoramas instead of
 * one image mirrored against itself — the mirror trick gave a mathematically
 * perfect seam, but it meant panning "the other way around" showed the exact
 * same landmarks flipped, with no hotspots, which read as an empty repeat.
 * hero-panorama.webp ("A", the real destinations) and hero-panorama-b.webp
 * ("B", an atmospheric detour — waterfall, standing stones, a mossy bridge,
 * no hotspots) were both generated with matching dense-forest bookends on
 * their left/right edges, so A→B and B→A transitions read as a continuous
 * walk rather than a hard cut. The pattern repeats every 2 copies (one A +
 * one B), so jumping the scroll position by exactly that period is always
 * visually identical, which is how the "infinite" wrap is faked with a
 * finite strip of DOM: render 5 copies (B,A,B,A,B), keep the visible
 * position recentered within the middle band, and silently jump by ±2
 * copies whenever it drifts too close to either physical edge.
 */
type CopyKind = 'A' | 'B';
const COPY_PATTERN: CopyKind[] = ['B', 'A', 'B', 'A', 'B'];
const RECENTER_JUMP_COPIES = 2;

const COPY_IMAGE: Record<CopyKind, string> = {
  A: 'assets/img/hero-panorama.webp',
  B: 'assets/img/hero-panorama-b.webp'
};

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [HotspotComponent, EdgeArrowComponent, EdgeScrollDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly scene = inject(SceneService);

  @ViewChild('stage') private stageRef!: ElementRef<HTMLElement>;

  /**
   * GROWTH POINT: single source of truth for landmarks painted into
   * hero-panorama.webp (the "A" copies). Add a landmark here and it appears
   * as a clickable hotspot (with automatic off-screen quest-marker arrows)
   * — no template changes needed. x/y are percentages within ONE copy of
   * the image. Keep this in sync with the SCENES x/y in
   * core/services/scene.service.ts (those drive the Quest Map overlay,
   * which shows the same artwork).
   */
  readonly hotspots: MapHotspot[] = [
    { id: 'treasure', x: 23, y: 55, icon: 'door', label: 'Enter the Treasure Room', target: 'featured' },
    { id: 'signpost', x: 35, y: 53, icon: 'sign', label: 'Meet Friends of the Troll', target: 'friends' },
    { id: 'workbench', x: 63, y: 30, icon: 'sign', label: "Enter the Maker's Tower", target: 'gallery' },
    { id: 'exit', x: 82, y: 53, icon: 'exit', label: 'Step into the Troll Cave (Etsy)', target: 'visit' }
  ];

  readonly copies = COPY_PATTERN.map((kind, index) => ({ kind, index, image: COPY_IMAGE[kind] }));

  private readonly scrollLeft = signal(0);
  private readonly copyWidth = signal(typeof window !== 'undefined' ? window.innerHeight * IMAGE_ASPECT : 2400);
  private readonly viewportWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1200);

  /** Screen x-offset (in px) of the left edge of a given copy index. */
  copyOffset(index: number): number {
    return index * this.copyWidth();
  }

  trackWidth(): number {
    return COPY_PATTERN.length * this.copyWidth();
  }

  /** Only the "A" copies (real destinations) get clickable hotspots. */
  isRealCopy(kind: CopyKind): boolean {
    return kind === 'A';
  }

  /** Hotspots currently off-screen, with the nearer of their two "A"-copy instances used for direction + position. */
  readonly offscreenMarkers = computed(() => {
    const w = this.copyWidth();
    const viewportW = this.viewportWidth();
    const scrolled = this.scrollLeft();
    const EDGE_MARGIN_PX = 90;

    const realCopyIndices = this.copies.filter((c) => c.kind === 'A').map((c) => c.index);

    return this.hotspots
      .map((h) => {
        let best: { screenX: number } | null = null;

        for (const idx of realCopyIndices) {
          const xPx = idx * w + w * (h.x / 100);
          const screenX = xPx - scrolled;
          if (best === null || Math.abs(screenX) < Math.abs(best.screenX)) {
            best = { screenX };
          }
        }

        if (!best) return null;

        if (best.screenX < EDGE_MARGIN_PX) {
          return { ...h, side: 'left' as const };
        }
        if (best.screenX > viewportW - EDGE_MARGIN_PX) {
          return { ...h, side: 'right' as const };
        }
        return null;
      })
      .filter((m): m is MapHotspot & { side: 'left' | 'right' } => m !== null);
  });

  go(id: string): void {
    this.scene.navigateTo(id);
  }

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    this.recenterIfNeeded(el);
    this.scrollLeft.set(el.scrollLeft);
  }

  ngAfterViewInit(): void {
    const el = this.stageRef.nativeElement;
    // Start inside the first real ("A") copy so the opening framing matches
    // before this feature existed, with a full copy of buffer on either side.
    el.scrollLeft = this.copyWidth();
    this.scrollLeft.set(el.scrollLeft);

    window.addEventListener('resize', this.onWindowResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = (): void => {
    this.copyWidth.set(window.innerHeight * IMAGE_ASPECT);
    this.viewportWidth.set(window.innerWidth);
    if (this.stageRef) {
      this.scrollLeft.set(this.stageRef.nativeElement.scrollLeft);
    }
  };

  /** Silently jump by exactly one full (A+B) period when drifting near either physical edge of the rendered strip. */
  private recenterIfNeeded(el: HTMLElement): void {
    const w = this.copyWidth();
    const jump = RECENTER_JUMP_COPIES * w;
    const low = 0.5 * w;
    const high = this.trackWidth() - el.clientWidth - 0.5 * w;

    if (el.scrollLeft < low) {
      el.scrollLeft += jump;
    } else if (el.scrollLeft > high) {
      el.scrollLeft -= jump;
    }
  }
}
