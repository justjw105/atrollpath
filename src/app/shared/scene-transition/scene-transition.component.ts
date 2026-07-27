import { Component, inject } from '@angular/core';
import { SceneService } from '../../core/services/scene.service';

@Component({
  selector: 'app-scene-transition',
  standalone: true,
  templateUrl: './scene-transition.component.html',
  styleUrl: './scene-transition.component.scss'
})
export class SceneTransitionComponent {
  readonly scene = inject(SceneService);
}
