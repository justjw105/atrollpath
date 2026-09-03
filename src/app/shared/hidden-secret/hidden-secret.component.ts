import { Component, Input, inject } from '@angular/core';
import { EasterEggService, SecretDef } from '../../core/services/easter-egg.service';

/**
 * A deliberately subtle, easy-to-miss clickable glimmer hidden in the
 * scenery. Unlike app-hotspot (which pulses and reveals a label to invite
 * clicks), this stays faint until hovered — the whole point is that you
 * have to go looking for it.
 */
@Component({
  selector: 'app-hidden-secret',
  standalone: true,
  templateUrl: './hidden-secret.component.html',
  styleUrl: './hidden-secret.component.scss'
})
export class HiddenSecretComponent {
  private readonly eggs = inject(EasterEggService);

  @Input({ required: true }) secret!: SecretDef;

  get found(): boolean {
    return this.eggs.isFound(this.secret.id);
  }

  reveal(): void {
    this.eggs.discover(this.secret);
  }
}
