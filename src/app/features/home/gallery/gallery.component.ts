import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { SceneService } from '../../../core/services/scene.service';
import { SfxService } from '../../../core/services/sfx.service';
import { HotspotComponent } from '../../../shared/hotspot/hotspot.component';
import { ItemInspectComponent, InspectableItem } from '../../../shared/item-inspect/item-inspect.component';

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

  readonly items = this.products.getGalleryItems();
  selected: InspectableItem | null = null;

  go(id: string): void {
    this.scene.navigateTo(id);
  }

  onHover(): void {
    this.sfx.play('tick');
  }

  inspect(item: (typeof this.items)[number]): void {
    this.sfx.play('tick');
    this.selected = { image: item.image, title: item.caption };
  }

  closeInspect(): void {
    this.selected = null;
  }
}
