import { Component, inject } from '@angular/core';
import { SceneService } from '../../../core/services/scene.service';
import { HotspotComponent } from '../../../shared/hotspot/hotspot.component';
import { JoinPartyFormComponent } from '../../../shared/join-party-form/join-party-form.component';

/**
 * "The Camp" — a hidden destination scene reached via the warm firelight
 * glow tucked into the hero path (see the 'camp' hotspot in
 * hero.component.ts). Home of the "Join the Party" newsletter signup.
 */
@Component({
  selector: 'app-camp',
  standalone: true,
  imports: [HotspotComponent, JoinPartyFormComponent],
  templateUrl: './camp.component.html',
  styleUrl: './camp.component.scss'
})
export class CampComponent {
  readonly scene = inject(SceneService);

  go(id: string): void {
    this.scene.navigateTo(id);
  }
}
