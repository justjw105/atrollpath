import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { SceneService } from '../../../core/services/scene.service';
import { HotspotComponent } from '../../../shared/hotspot/hotspot.component';
import { EdgeArrowComponent } from '../../../shared/edge-arrow/edge-arrow.component';
import { EdgeScrollDirective } from '../../../shared/edge-scroll/edge-scroll.directive';
import { HiddenSecretComponent } from '../../../shared/hidden-secret/hidden-secret.component';
import { SECRETS, resolveSecretSpot } from '../../../core/services/easter-egg.service';

interface MapHotspot {
  id: string;
  x: number;
  y: number;
  icon: 'door' | 'sign' | 'chest' | 'exit' | 'camp';
  label: string;
  target: string;
  /** Which panorama copy this hotspot is painted/glowing on. Defaults to 'A' (the real-landmark copy) when omitted. */
  copyKind?: CopyKind;
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
  imports: [HotspotComponent, EdgeArrowComponent, EdgeScrollDirective, HiddenSecretComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly scene = inject(SceneService);

  @ViewChild('stage') private stageRef!: ElementRef<HTMLElement>;
  @ViewChild('introEl') private introRef?: ElementRef<HTMLElement>;

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
    { id: 'exit', x: 82, y: 53, icon: 'exit', label: 'Step into the Troll Cave (Etsy)', target: 'visit' },
    // Lives on the 'B' (atmospheric detour) copy, tucked at the foot of the
    // mossy stone bridge, blending with the lantern post already painted there.
    { id: 'camp', x: 85, y: 75.3, icon: 'camp', label: 'Follow the Firelight to the Camp', target: 'camp', copyKind: 'B' }
  ];

  /**
   * Hidden secrets painted into the hero panoramas. Positions are resolved
   * once per component instance (i.e. once per visit to this scene) — any
   * secret with a `spots` pool lands in a different one of its candidate
   * spots most times you arrive here, instead of always the same place.
   */
  private readonly resolvedHeroSecrets = SECRETS.filter((s) => s.sceneId === 'hero').map((s) => ({
    ...s,
    ...resolveSecretSpot(s)
  }));

  secretsFor(kind: CopyKind) {
    return this.resolvedHeroSecrets.filter((s) => s.copyKind === kind);
  }

  /** Hotspots painted/glowing on a given panorama copy — defaults to 'A' when a hotspot has no explicit copyKind. */
  hotspotsFor(kind: CopyKind) {
    return this.hotspots.filter((h) => (h.copyKind ?? 'A') === kind);
  }

  readonly copies = COPY_PATTERN.map((kind, index) => ({ kind, index, image: COPY_IMAGE[kind] }));

  private readonly scrollLeft = signal(0);
  /**
   * Real, measured top edge (in viewport px) of the fixed title/subtitle
   * block, kept in sync via ResizeObserver. Defaults far below any real
   * viewport so nothing is clamped before the first measurement lands.
   * Off-screen edge-hint arrows use this (not a guessed percentage) to
   * stay clear of the text regardless of how many lines it wraps to at
   * a given viewport size/font-load state — a hardcoded percentage can't
   * account for that, but a real measurement always can.
   */
  private readonly introTopPx = signal(99999);
  private introResizeObserver?: ResizeObserver;
  private readonly copyWidth = signal(typeof window !== 'undefined' ? window.innerHeight * IMAGE_ASPECT : 2400);
  private readonly viewportWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1200);

  /** Screen x-offset (in px) of the left edge of a given copy index. */
  copyOffset(index: number): number {
    return index * this.copyWidth();
  }

  trackWidth(): number {
    return COPY_PATTERN.length * this.copyWidth();
  }

  /** Only the "A" copies (real destinations) render the alt text describing painted landmarks. */
  isRealCopy(kind: CopyKind): boolean {
    return kind === 'A';
  }

  /** Hotspots currently off-screen, with the nearer of each hotspot's own-copy-kind instances used for direction + position. */
  readonly offscreenMarkers = computed(() => {
    const w = this.copyWidth();
    const viewportW = this.viewportWidth();
    const scrolled = this.scrollLeft();
    const EDGE_MARGIN_PX = 90;

    // The HUD sits ~70px tall at top; the title/subtitle block's real,
    // measured top edge (introTopPx) marks the danger zone at bottom —
    // both are fixed overlays independent of scroll/pan, so an edge hint
    // using a hotspot's raw y (e.g. the Camp firelight, low at y:75) could
    // otherwise land on top of either one.
    const viewportH = typeof window !== 'undefined' ? window.innerHeight : 900;
    const HUD_CLEARANCE_PX = 70;
    const TEXT_SAFETY_MARGIN_PX = 40;
    const minYPercent = (HUD_CLEARANCE_PX / viewportH) * 100;
    const maxYPercent = Math.max(minYPercent + 10, ((this.introTopPx() - TEXT_SAFETY_MARGIN_PX) / viewportH) * 100);

    return this.hotspots
      .map((h) => {
        const matchingIndices = this.copies.filter((c) => c.kind === (h.copyKind ?? 'A')).map((c) => c.index);
        let best: { screenX: number } | null = null;

        for (const idx of matchingIndices) {
          const xPx = idx * w + w * (h.x / 100);
          const screenX = xPx - scrolled;
          if (best === null || Math.abs(screenX) < Math.abs(best.screenX)) {
            best = { screenX };
          }
        }

        if (!best) return null;

        const safeY = Math.min(Math.max(h.y, minYPercent), maxYPercent);

        if (best.screenX < EDGE_MARGIN_PX) {
          return { ...h, y: safeY, side: 'left' as const };
        }
        if (best.screenX > viewportW - EDGE_MARGIN_PX) {
          return { ...h, y: safeY, side: 'right' as const };
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

    if (this.introRef && typeof ResizeObserver !== 'undefined') {
      this.introResizeObserver = new ResizeObserver(() => this.measureIntro());
      this.introResizeObserver.observe(this.introRef.nativeElement);
    }
    this.measureIntro();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize);
    this.introResizeObserver?.disconnect();
  }

  private measureIntro(): void {
    const el = this.introRef?.nativeElement;
    if (!el) return;
    this.introTopPx.set(el.getBoundingClientRect().top);
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
