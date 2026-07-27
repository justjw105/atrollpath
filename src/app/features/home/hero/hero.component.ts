import { Component, inject } from '@angular/core';
import { SceneService } from '../../../core/services/scene.service';
import { HotspotComponent } from '../../../shared/hotspot/hotspot.component';
import { EdgeScrollDirective } from '../../../shared/edge-scroll/edge-scroll.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [HotspotComponent, EdgeScrollDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  readonly scene = inject(SceneService);

  go(id: string): void {
    this.scene.navigateTo(id);
  }
}
