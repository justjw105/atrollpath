import { Component, inject } from '@angular/core';
import { PartyModalService } from '../../core/services/party-modal.service';
import { JoinPartyFormComponent } from '../join-party-form/join-party-form.component';

/**
 * Global "Join the Party" modal, mounted once in app.component.html
 * (alongside the mini-games) so it can pop up over any scene when the HUD
 * button is clicked. Same self-contained overlay pattern as the hidden
 * mini-games — reads PartyModalService.isOpen, closes itself.
 */
@Component({
  selector: 'app-party-modal',
  standalone: true,
  imports: [JoinPartyFormComponent],
  templateUrl: './party-modal.component.html',
  styleUrl: './party-modal.component.scss'
})
export class PartyModalComponent {
  readonly party = inject(PartyModalService);
}
