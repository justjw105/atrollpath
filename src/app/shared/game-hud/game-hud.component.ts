import { Component, inject } from '@angular/core';
import { SceneService } from '../../core/services/scene.service';
import { SfxService } from '../../core/services/sfx.service';

@Component({
  selector: 'app-game-hud',
  standalone: true,
  templateUrl: './game-hud.component.html',
  styleUrl: './game-hud.component.scss'
})
export class GameHudComponent {
  readonly scene = inject(SceneService);
  readonly sfx = inject(SfxService);

  goHome(): void {
    this.scene.navigateTo('hero');
  }
}
