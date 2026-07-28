import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

export interface InspectableItem {
  /** One or more photos of the item. The gallery only shows nav controls when there's more than one. */
  images: string[];
  title: string;
  description?: string;
  badge?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

/**
 * Inventory-style "inspect item" panel. Used for both the treasure room
 * (products) and the Maker's Tower (commissions) so clicking anything in
 * either scene feels like picking up an item to examine it, rather than
 * a plain lightbox. Supports a small photo gallery per item — prev/next
 * arrows plus a dot strip — for products with multiple reference photos.
 */
@Component({
  selector: 'app-item-inspect',
  standalone: true,
  templateUrl: './item-inspect.component.html',
  styleUrl: './item-inspect.component.scss'
})
export class ItemInspectComponent {
  private _item: InspectableItem | null = null;

  readonly activeIndex = signal(0);

  @Input()
  set item(value: InspectableItem | null) {
    this._item = value;
    this.activeIndex.set(0);
  }
  get item(): InspectableItem | null {
    return this._item;
  }

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  next(event?: Event): void {
    event?.stopPropagation();
    const total = this._item?.images.length ?? 0;
    if (total < 2) return;
    this.activeIndex.update((i) => (i + 1) % total);
  }

  prev(event?: Event): void {
    event?.stopPropagation();
    const total = this._item?.images.length ?? 0;
    if (total < 2) return;
    this.activeIndex.update((i) => (i - 1 + total) % total);
  }

  selectIndex(i: number, event?: Event): void {
    event?.stopPropagation();
    this.activeIndex.set(i);
  }
}
