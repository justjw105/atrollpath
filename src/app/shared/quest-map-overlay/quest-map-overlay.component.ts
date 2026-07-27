import { Component, inject } from '@angular/core';
import { SCENES } from '../../core/services/scene.service';
import { SceneService } from '../../core/services/scene.service';
import { SfxService } from '../../core/services/sfx.service';

@Component({
  selector: 'app-quest-map-overlay',
  standalone: true,
  templateUrl: './quest-map-overlay.component.html',
  styleUrl: './quest-map-overlay.component.scss'
})
export class QuestMapOverlayComponent {
  private readonly sfx = inject(SfxService);
  readonly scene = inject(SceneService);
  readonly nodes = SCENES;

  travelTo(id: string): void {
    this.scene.navigateTo(id);
  }

  onHover(): void {
    this.sfx.play('tick');
  }
}
