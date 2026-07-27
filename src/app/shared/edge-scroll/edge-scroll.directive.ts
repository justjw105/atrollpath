import { Directive, ElementRef, HostListener, OnDestroy, inject } from '@angular/core';

/**
 * Attach to a horizontally-scrollable full-bleed container (overflow-x: auto)
 * to auto-pan it when the pointer hovers near its left/right edge — the
 * classic "point and click adventure / RTS" edge-scroll camera behavior.
 * Native touch swipe still works untouched since this only reacts to mouse
 * movement; it's a desktop-hover convenience on top of normal scrolling.
 */
@Directive({
  selector: '[appEdgeScroll]',
  standalone: true
})
export class EdgeScrollDirective implements OnDestroy {
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);

  private static readonly EDGE_ZONE_PX = 140;
  private static readonly MAX_SPEED_PX = 16;

  private rafId: number | null = null;
  private direction = 0;
  private speed = 0;

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
  }
}
