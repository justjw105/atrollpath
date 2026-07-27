import { Component } from '@angular/core';
import { ETSY_SHOP_URL, FACEBOOK_URL, PINTEREST_URL } from '../../core/data/products.data';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss'
})
export class SiteFooterComponent {
  readonly etsyUrl = ETSY_SHOP_URL;
  readonly facebookUrl = FACEBOOK_URL;
  readonly pinterestUrl = PINTEREST_URL;
  readonly year = new Date().getFullYear();
}
