import { Component } from '@angular/core';
import { ETSY_SHOP_URL } from '../../../core/data/products.data';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  readonly etsyUrl = ETSY_SHOP_URL;
}
