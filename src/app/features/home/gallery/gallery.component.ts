import { Component, computed, inject } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { SceneService } from '../../../core/services/scene.service';
import { SfxService } from '../../../core/services/sfx.service';
import { HotspotComponent } from '../../../shared/hotspot/hotspot.component';
import { ItemInspectComponent, InspectableItem } from '../../../shared/item-inspect/item-inspect.component';

/**
 * The Maker's Tower scene — showcases custom commission pieces. Add more
 * completed commissions to core/data/products.data.ts (COMMISSIONS array)
 * and they'll appear here automatically as clickable artifacts, each with
 * its own shareable URL (see ITEM_SEO in scene.service.ts).
 */
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [HotspotComponent, ItemInspectComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  private readonly products = inject(ProductsService);
  private readonly sfx = inject(SfxService);
  readonly scene = inject(SceneService);

  readonly commissions = this.products.getCommissions();

  /** Derived from the shared, URL-synced activeItemSlug signal — see FeaturedProductsComponent for why. */
  readonly selected = computed<InspectableItem | null>(() => {
    const slug = this.scene.activeItemSlug();
    const item = slug ? this.commissions.find((c) => c.id === slug) : undefined;
    if (!item) return null;

    return {
      images: item.images && item.images.length > 0 ? item.images : [item.image],
      title: item.name,
      description: item.description,
      badge: item.badge,
      ctaUrl: item.ctaUrl,
      ctaLabel: item.ctaLabel
    };
  });

  go(id: string): void {
    this.scene.navigateTo(id);
  }

  onHover(): void {
    this.sfx.play('tick');
  }

  inspect(item: (typeof this.commissions)[number]): void {
    this.scene.openItem(item.id);
  }

  closeInspect(): void {
    this.scene.closeItem();
  }
}
