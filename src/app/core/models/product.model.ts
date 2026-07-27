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

/**
 * A one-of-a-kind custom commission piece shown in the Commissions scene.
 * Unlike Product, there's no fixed Etsy listing per piece (each commission
 * is bespoke) — ctaUrl/ctaLabel let each piece link somewhere sensible
 * (e.g. the shop's message-to-inquire page) once that's available.
 */
export interface CommissionPiece {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  badge?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}
