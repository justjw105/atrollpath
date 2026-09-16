import { Component, inject } from '@angular/core';
import { SceneService } from '../../core/services/scene.service';
import { SfxService } from '../../core/services/sfx.service';
import { PartyModalService } from '../../core/services/party-modal.service';

@Component({
  selector: 'app-game-hud',
  standalone: true,
  templateUrl: './game-hud.component.html',
  styleUrl: './game-hud.component.scss'
})
export class GameHudComponent {
  readonly scene = inject(SceneService);
  readonly sfx = inject(SfxService);
  readonly party = inject(PartyModalService);

  goHome(): void {
    this.scene.navigateTo('hero');
  }
}
