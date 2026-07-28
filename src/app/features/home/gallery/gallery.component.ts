import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { SceneService } from '../../../core/services/scene.service';
import { SfxService } from '../../../core/services/sfx.service';
import { HotspotComponent } from '../../../shared/hotspot/hotspot.component';
import { ItemInspectComponent, InspectableItem } from '../../../shared/item-inspect/item-inspect.component';

/**
 * The Workbench Tower scene — showcases custom commission pieces. Add more
 * completed commissions to core/data/products.data.ts (COMMISSIONS array)
 * and they'll appear here automatically as clickable artifacts.
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
  selected: InspectableItem | null = null;

  go(id: string): void {
    this.scene.navigateTo(id);
  }

  onHover(): void {
    this.sfx.play('tick');
  }

  inspect(item: (typeof this.commissions)[number]): void {
    this.sfx.play('tick');
    this.selected = {
      images: item.images && item.images.length > 0 ? item.images : [item.image],
      title: item.name,
      description: item.description,
      badge: item.badge,
      ctaUrl: item.ctaUrl,
      ctaLabel: item.ctaLabel
    };
  }

  closeInspect(): void {
    this.selected = null;
  }
}
