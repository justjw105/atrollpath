import { Component, inject } from '@angular/core';
import { EasterEggService } from '../../core/services/easter-egg.service';

@Component({
  selector: 'app-egg-reveal',
  standalone: true,
  templateUrl: './egg-reveal.component.html',
  styleUrl: './egg-reveal.component.scss'
})
export class EggRevealComponent {
  readonly eggs = inject(EasterEggService);
}
