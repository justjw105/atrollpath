/**
 * Core product shape used across the site (featured cards, gallery, future
 * category pages). Add new products in `core/data/products.data.ts` — this
 * file only defines the shape.
 */
export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceLabel: string;
  image: string;
  etsyUrl: string;
  badge?: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
}
