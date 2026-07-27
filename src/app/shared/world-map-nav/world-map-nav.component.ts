import { Component, inject } from '@angular/core';
import { QUEST_NODES } from '../../core/services/scroll-spy.service';
import { ScrollSpyService } from '../../core/services/scroll-spy.service';

@Component({
  selector: 'app-world-map-nav',
  standalone: true,
  templateUrl: './world-map-nav.component.html',
  styleUrl: './world-map-nav.component.scss'
})
export class WorldMapNavComponent {
  private readonly spy = inject(ScrollSpyService);

  readonly nodes = QUEST_NODES;
  readonly activeId = this.spy.activeId;

  travelTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
