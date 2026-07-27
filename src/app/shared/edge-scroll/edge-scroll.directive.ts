import { Directive, ElementRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Attach to a horizontally-scrollable full-bleed container (overflow-x: auto)
 * to auto-pan it when the pointer hovers near its left/right edge — the
 * classic "point and click adventure / RTS" edge-scroll camera behavior.
 * Native touch swipe still works untouched since this only reacts to mouse
 * movement; it's a desktop-hover convenience on top of normal scrolling.
 *
 * Also enforces "safe" centering in JS as a belt-and-suspenders fallback:
 * the host's CSS should already declare `justify-content: safe center`, but
 * on browsers that don't yet support the `safe` keyword, plain `center`
 * mathematically centers overflowing content off both edges — which leaves
 * the leading edge permanently unreachable since scrollLeft can't go
 * negative. This directive flips to flex-start whenever the content
 * actually overflows, so every part of the image stays scrollable.
 */
@Directive({
  selector: '[appEdgeScroll]',
  standalone: true
})
export class EdgeScrollDirective implements OnInit, OnDestroy {
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);

  private static readonly EDGE_ZONE_PX = 140;
  private static readonly MAX_SPEED_PX = 16;

  private rafId: number | null = null;
  private direction = 0;
  private speed = 0;
  private resizeObserver?: ResizeObserver;

  ngOnInit(): void {
    this.syncAlignment();

    // The map-canvas child only reaches its real (image-driven) width once
    // the background image finishes loading, so watch it directly rather
    // than just the host — a resize of the host alone wouldn't catch that.
    const content = this.el.nativeElement.firstElementChild as HTMLElement | null;

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.syncAlignment());
      this.resizeObserver.observe(this.el.nativeElement);
      if (content) {
        this.resizeObserver.observe(content);
      }
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.syncAlignment();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const node = this.el.nativeElement;
    const canScroll = node.scrollWidth > node.clientWidth + 1;

    if (!canScroll) {
      this.stop();
      return;
    }

    const rect = node.getBoundingClientRect();
    const xInEl = event.clientX - rect.left;
    const distFromLeft = xInEl;
    const distFromRight = rect.width - xInEl;
    const zone = EdgeScrollDirective.EDGE_ZONE_PX;

    if (distFromLeft < zone && node.scrollLeft > 0) {
      this.direction = -1;
      this.speed = EdgeScrollDirective.MAX_SPEED_PX * (1 - Math.max(distFromLeft, 0) / zone);
      this.start();
    } else if (distFromRight < zone && node.scrollLeft < node.scrollWidth - node.clientWidth) {
      this.direction = 1;
      this.speed = EdgeScrollDirective.MAX_SPEED_PX * (1 - Math.max(distFromRight, 0) / zone);
      this.start();
    } else {
      this.stop();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.stop();
  }

  /** Force start-alignment whenever content overflows so nothing is left unreachable. */
  private syncAlignment(): void {
    const node = this.el.nativeElement;
    const overflowing = node.scrollWidth > node.clientWidth + 1;
    node.style.justifyContent = overflowing ? 'flex-start' : 'center';
  }

  private start(): void {
    if (this.rafId !== null) return;
    const step = (): void => {
      this.el.nativeElement.scrollLeft += this.direction * this.speed;
      this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  private stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  ngOnDestroy(): void {
    this.stop();
    this.resizeObserver?.disconnect();
  }
}
