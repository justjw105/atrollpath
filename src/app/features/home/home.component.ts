import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { GalleryComponent } from './gallery/gallery.component';
import { EtsyCtaComponent } from './etsy-cta/etsy-cta.component';

/**
 * GROWTH POINT: this page is a thin composition of section components.
 * To add a new section (e.g. "About", "Reviews", "Custom Orders"):
 *   1. Create a new folder under features/home/<section-name>/ with its
 *      own component (copy the pattern used by gallery/ or etsy-cta/).
 *   2. Import it here and drop <app-your-section> in the template below,
 *      wrapped in a <section id="your-id">.
 *   3. Add a matching entry to QUEST_NODES in core/services/scroll-spy.service.ts
 *      so the world-map nav grows a new waypoint automatically.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, FeaturedProductsComponent, GalleryComponent, EtsyCtaComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {}
