import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { SfxService } from '../../core/services/sfx.service';

/**
 * A directional "quest marker" pinned to the screen edge, pointing toward a
 * hotspot that has scrolled out of view on a panning map scene. Clicking it
 * travels straight to that destination — same as clicking the hotspot itself.
 */
@Component({
  selector: 'app-edge-arrow',
  standalone: true,
  templateUrl: './edge-arrow.component.html',
  styleUrl: './edge-arrow.component.scss'
})
export class EdgeArrowComponent {
  private readonly sfx = inject(SfxService);

  @Input() side: 'left' | 'right' = 'left';
  @Input() y = 50;
  @Input() label = '';
  @Output() activate = new EventEmitter<void>();

  onHoverEnter(): void {
    this.sfx.play('tick');
  }

  onActivate(): void {
    this.activate.emit();
  }
}
