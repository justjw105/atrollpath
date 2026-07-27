import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

/**
 * GROWTH POINT: the site is one route today (the landing page). When you're
 * ready to add standalone pages (a full shop, a full gallery, an about page),
 * add them here, e.g.:
 *   { path: 'shop', loadComponent: () => import('./features/shop/shop.component').then(m => m.ShopComponent) }
 * Lazy-loading via loadComponent keeps the initial bundle small as the site grows.
 */
export const routes: Routes = [
  { path: '', component: HomeComponent }
];
