import { Component, inject } from '@angular/core';
import { ETSY_SHOP_URL, FACEBOOK_URL, PINTEREST_URL } from '../../../core/data/products.data';
import { SceneService } from '../../../core/services/scene.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { HotspotComponent } from '../../../shared/hotspot/hotspot.component';

@Component({
  selector: 'app-etsy-cta',
  standalone: true,
  imports: [HotspotComponent],
  templateUrl: './etsy-cta.component.html',
  styleUrl: './etsy-cta.component.scss'
})
export class EtsyCtaComponent {
  readonly scene = inject(SceneService);
  private readonly analytics = inject(AnalyticsService);
  readonly etsyUrl = ETSY_SHOP_URL;
  readonly facebookUrl = FACEBOOK_URL;
  readonly pinterestUrl = PINTEREST_URL;

  go(id: string): void {
    this.scene.navigateTo(id);
  }

  trackEtsyClick(): void {
    this.analytics.trackEtsyClick('Troll Cave Exit CTA');
  }
}
