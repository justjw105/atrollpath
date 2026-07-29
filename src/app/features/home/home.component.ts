import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { GalleryComponent } from './gallery/gallery.component';
import { EtsyCtaComponent } from './etsy-cta/etsy-cta.component';
import { FriendsComponent } from './friends/friends.component';
import { SceneService } from '../../core/services/scene.service';

/**
 * GROWTH POINT: this is the scene stage. Exactly one scene renders at a
 * time, driven by SceneService.activeSceneId. To add a new scene:
 *   1. Add an entry to SCENES (and SCENE_SEO) in core/services/scene.service.ts.
 *   2. Add a matching route in app.routes.ts.
 *   3. Create a component under features/home/<scene-name>/ (copy an
 *      existing scene like gallery/ as a starting point).
 *   4. Import it here and add a matching @case below.
 *   5. Add a hotspot in whichever scene should lead to it.
 *
 * The initial scene is read once from the matched route's `sceneId` data —
 * this is what makes each scene a real, distinct, bookmarkable/shareable
 * URL instead of everything living behind only client-side clicks.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, FeaturedProductsComponent, GalleryComponent, EtsyCtaComponent, FriendsComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  readonly scene = inject(SceneService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const initialSceneId = this.route.snapshot.data['sceneId'] as string | undefined;
    this.scene.setInitialScene(initialSceneId ?? 'hero');
  }
}
