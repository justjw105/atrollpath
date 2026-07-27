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

const EDGE_MARGIN_PX = 90;

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [HotspotComponent, EdgeArrowComponent, EdgeScrollDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly scene = inject(SceneService);

  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLElement>;

  /**
   * GROWTH POINT: this is the single source of truth for hero-map hotspots.
   * Add a landmark here (matching a spot painted into hero-map.png) and both
   * the on-screen hotspot AND its off-screen quest-marker arrow are wired
   * up automatically — no template changes needed.
   */
  readonly hotspots: MapHotspot[] = [
    { id: 'treasure', x: 20, y: 58, icon: 'door', label: 'Enter the Treasure Room', target: 'featured' },
    { id: 'workbench', x: 57, y: 32, icon: 'sign', label: 'View Custom Commissions', target: 'gallery' },
    { id: 'exit', x: 87, y: 60, icon: 'exit', label: 'Step into the Troll Cave (Etsy)', target: 'visit' }
  ];

  private readonly scrollLeft = signal(0);
  private readonly canvasWidth = signal(0);
  private readonly viewportWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1200);

  private resizeObserver?: ResizeObserver;

  /** Hotspots currently scrolled out of view, with the screen edge + vertical position for their arrow marker. */
  readonly offscreenMarkers = computed(() => {
    const canvasW = this.canvasWidth();
    if (!canvasW) return [];

    const viewportW = this.viewportWidth();
    const scrolled = this.scrollLeft();

    return this.hotspots
      .map((h) => {
        const xPx = canvasW * (h.x / 100);
        const screenX = xPx - scrolled;

        if (screenX < EDGE_MARGIN_PX) {
          return { ...h, side: 'left' as const };
        }
        if (screenX > viewportW - EDGE_MARGIN_PX) {
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
    this.scrollLeft.set((event.target as HTMLElement).scrollLeft);
  }

  ngAfterViewInit(): void {
    this.syncCanvasWidth();

    if (typeof ResizeObserver !== 'undefined' && this.canvasRef) {
      this.resizeObserver = new ResizeObserver(() => this.syncCanvasWidth());
      this.resizeObserver.observe(this.canvasRef.nativeElement);
    }

    window.addEventListener('resize', this.onWindowResize);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = (): void => {
    this.viewportWidth.set(window.innerWidth);
  };

  private syncCanvasWidth(): void {
    if (this.canvasRef) {
      this.canvasWidth.set(this.canvasRef.nativeElement.clientWidth);
    }
  }
}
