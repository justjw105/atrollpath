import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../core/services/newsletter.service';
import { SfxService } from '../../core/services/sfx.service';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * The actual "Join the Party" email signup form — reused in two places:
 * the global HUD modal (any scene) and the dedicated Camp scene. `source`
 * is passed in by whoever hosts this so submissions can be told apart
 * later (e.g. "hud-modal" vs "camp-scene") without needing two components.
 */
@Component({
  selector: 'app-join-party-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './join-party-form.component.html',
  styleUrl: './join-party-form.component.scss'
})
export class JoinPartyFormComponent {
  private readonly newsletter = inject(NewsletterService);
  private readonly sfx = inject(SfxService);

  /** Tag recorded alongside the email so you can tell where a signup came from. */
  @Input() source = 'unknown';
  /** Tighter spacing/smaller type for the compact HUD-modal placement. */
  @Input() compact = false;

  @Output() joined = new EventEmitter<void>();

  readonly email = signal('');
  /** Hidden honeypot field — real visitors never see or fill this in. */
  readonly website = signal('');
  readonly state = signal<FormState>('idle');

  async submit(): Promise<void> {
    if (this.state() === 'submitting') return;

    this.state.set('submitting');
    const result = await this.newsletter.subscribe(this.email(), this.source, this.website());

    if (result === 'ok') {
      this.state.set('success');
      this.sfx.play('chime');
      this.joined.emit();
    } else if (result === 'invalid-email') {
      this.state.set('error');
    } else {
      this.state.set('error');
    }
  }

  reset(): void {
    this.email.set('');
    this.state.set('idle');
  }
}
