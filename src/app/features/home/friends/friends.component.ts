import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { SceneService } from '../../../core/services/scene.service';
import { SfxService } from '../../../core/services/sfx.service';
import { HotspotComponent } from '../../../shared/hotspot/hotspot.component';

/**
 * "Friends of the Troll" — cross-promotes partnered/friend shops. Add
 * entries to FRIEND_SHOPS in core/data/products.data.ts and they'll appear
 * here automatically as clickable cards that open the shop in a new tab.
 */
@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [HotspotComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss'
})
export class FriendsComponent {
  private readonly products = inject(ProductsService);
  private readonly sfx = inject(SfxService);
  readonly scene = inject(SceneService);

  readonly friends = this.products.getFriendShops();

  go(id: string): void {
    this.scene.navigateTo(id);
  }

  onHover(): void {
    this.sfx.play('tick');
  }
}
