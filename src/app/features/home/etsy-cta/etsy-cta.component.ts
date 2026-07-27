import { Component } from '@angular/core';
import { ETSY_SHOP_URL, FACEBOOK_URL, PINTEREST_URL } from '../../../core/data/products.data';

@Component({
  selector: 'app-etsy-cta',
  standalone: true,
  templateUrl: './etsy-cta.component.html',
  styleUrl: './etsy-cta.component.scss'
})
export class EtsyCtaComponent {
  readonly etsyUrl = ETSY_SHOP_URL;
  readonly facebookUrl = FACEBOOK_URL;
  readonly pinterestUrl = PINTEREST_URL;
}
