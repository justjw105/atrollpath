import { Injectable } from '@angular/core';
import { FEATURED_PRODUCTS, GALLERY_ITEMS } from '../data/products.data';
import { GalleryItem, Product } from '../models/product.model';

/**
 * Thin data-access layer. Today it just returns the static arrays in
 * products.data.ts, but because everything reads through this service,
 * swapping the source for a real API/CMS later only means editing this
 * one file — no component changes needed.
 */
@Injectable({ providedIn: 'root' })
export class ProductsService {
  getFeaturedProducts(): Product[] {
    return FEATURED_PRODUCTS;
  }

  getGalleryItems(): GalleryItem[] {
    return GALLERY_ITEMS;
  }
}
