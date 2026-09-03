import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameHudComponent } from './shared/game-hud/game-hud.component';
import { QuestMapOverlayComponent } from './shared/quest-map-overlay/quest-map-overlay.component';
import { SceneTransitionComponent } from './shared/scene-transition/scene-transition.component';
import { IntroSplashComponent } from './shared/intro-splash/intro-splash.component';
import { EggRevealComponent } from './shared/egg-reveal/egg-reveal.component';
import { MiniGameComponent } from './shared/mini-game/mini-game.component';
import { SfxService } from './core/services/sfx.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    GameHudComponent,
    QuestMapOverlayComponent,
    SceneTransitionComponent,
    IntroSplashComponent,
    EggRevealComponent,
    MiniGameComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly sfx = inject(SfxService);

  readonly started = signal(false);

  beginQuest(): void {
    this.sfx.unlock();
    this.started.set(true);
  }
}
