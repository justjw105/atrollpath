import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GalleryItem } from '../../core/models/product.model';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss'
})
export class LightboxComponent {
  @Input() item: GalleryItem | null = null;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
