import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProductsComponent {
  private readonly products = inject(ProductsService);
  readonly items = this.products.getFeaturedProducts();
}
