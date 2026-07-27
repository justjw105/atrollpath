import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface InspectableItem {
  image: string;
  title: string;
  description?: string;
  badge?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

/**
 * Inventory-style "inspect item" panel. Used for both the treasure room
 * (products) and the workbench gallery (photos) so clicking anything in
 * either scene feels like picking up an item to examine it, rather than
 * a plain lightbox.
 */
@Component({
  selector: 'app-item-inspect',
  standalone: true,
  templateUrl: './item-inspect.component.html',
  styleUrl: './item-inspect.component.scss'
})
export class ItemInspectComponent {
  @Input() item: InspectableItem | null = null;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
