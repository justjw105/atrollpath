import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { SceneService } from '../../../core/services/scene.service';
import { SfxService } from '../../../core/services/sfx.service';
import { HotspotComponent } from '../../../shared/hotspot/hotspot.component';
import { ItemInspectComponent, InspectableItem } from '../../../shared/item-inspect/item-inspect.component';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [HotspotComponent, ItemInspectComponent],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProductsComponent {
  private readonly products = inject(ProductsService);
  private readonly sfx = inject(SfxService);
  readonly scene = inject(SceneService);

  readonly items = this.products.getFeaturedProducts();
  selected: InspectableItem | null = null;

  go(id: string): void {
    this.scene.navigateTo(id);
  }

  onHover(): void {
    this.sfx.play('tick');
  }

  inspect(item: (typeof this.items)[number]): void {
    this.sfx.play('tick');
    this.selected = {
      image: item.image,
      title: item.name,
      description: item.description,
      badge: item.badge,
      ctaUrl: item.etsyUrl,
      ctaLabel: 'View in the Troll Cave →'
    };
  }

  closeInspect(): void {
    this.selected = null;
  }
}
