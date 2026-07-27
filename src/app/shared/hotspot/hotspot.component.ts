import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { SfxService } from '../../core/services/sfx.service';

/**
 * A glowing, clickable point-of-interest overlaid on a scene illustration.
 * This is the core "point and click" interaction — every place the player
 * can travel to is a hotspot, not a scroll anchor.
 */
@Component({
  selector: 'app-hotspot',
  standalone: true,
  templateUrl: './hotspot.component.html',
  styleUrl: './hotspot.component.scss'
})
export class HotspotComponent {
  private readonly sfx = inject(SfxService);

  @Input() x = 50;
  @Input() y = 50;
  @Input() label = '';
  @Input() icon: 'door' | 'chest' | 'sign' | 'exit' = 'sign';
  @Output() activate = new EventEmitter<void>();

  onHoverEnter(): void {
    this.sfx.play('tick');
  }

  onActivate(): void {
    this.activate.emit();
  }
}
