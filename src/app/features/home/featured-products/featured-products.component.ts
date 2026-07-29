import { Component, computed, inject } from '@angular/core';
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

  /**
   * Derived entirely from the shared, URL-synced activeItemSlug signal —
   * so a click, a direct link, or the browser back/forward buttons all
   * open/close the exact same modal state automatically.
   */
  readonly selected = computed<InspectableItem | null>(() => {
    const slug = this.scene.activeItemSlug();
    const item = slug ? this.items.find((i) => i.id === slug) : undefined;
    if (!item) return null;

    return {
      images: item.images && item.images.length > 0 ? item.images : [item.image],
      title: item.name,
      description: item.description,
      badge: item.badge,
      ctaUrl: item.etsyUrl,
      ctaLabel: 'View in the Troll Cave →'
    };
  });

  go(id: string): void {
    this.scene.navigateTo(id);
  }

  onHover(): void {
    this.sfx.play('tick');
  }

  inspect(item: (typeof this.items)[number]): void {
    this.scene.openItem(item.id);
  }

  closeInspect(): void {
    this.scene.closeItem();
  }
}
