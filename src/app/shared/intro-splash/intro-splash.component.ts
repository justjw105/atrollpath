import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-intro-splash',
  standalone: true,
  templateUrl: './intro-splash.component.html',
  styleUrl: './intro-splash.component.scss'
})
export class IntroSplashComponent {
  @Output() begin = new EventEmitter<void>();
}
