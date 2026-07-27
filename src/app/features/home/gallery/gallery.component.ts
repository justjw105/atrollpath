import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { GalleryItem } from '../../../core/models/product.model';
import { LightboxComponent } from '../../../shared/lightbox/lightbox.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [LightboxComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  private readonly products = inject(ProductsService);
  readonly items = this.products.getGalleryItems();
  selected: GalleryItem | null = null;

  open(item: GalleryItem): void {
    this.selected = item;
  }

  close(): void {
    this.selected = null;
  }
}
