import { Product, GalleryItem } from '../models/product.model';

/**
 * GROWTH POINT: this is the single source of truth for featured products.
 * To add a new product, push a new object here — the featured-products
 * section and (soon) a full shop page will pick it up automatically.
 * Swap placeholder prices/copy for your real Etsy listing details.
 */
export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'dragon-egg-paint-kit',
    name: 'Dragon Egg Paint Kit',
    tagline: 'Hatch your own treasure',
    description:
      'A hand-cast fused glass dragon egg paired with everything you need to paint your own scales and markings — our best-selling quest for aspiring dragon keepers.',
    priceLabel: 'From the Troll Cave',
    image: 'assets/products/product-3.jpg',
    etsyUrl: 'https://www.etsy.com/shop/ATrollPath',
    badge: 'Top Seller'
  },
  {
    id: 'gothic-lantern-avatar',
    name: 'Gothic Stained Glass Lantern',
    tagline: 'Avatar-inspired laser-etched glass',
    description:
      'A moody stained-glass lantern featuring intricate laser-etched black artwork inspired by Avatar: The Last Airbender, glowing from within like a captured spark of firebending.',
    priceLabel: 'From the Troll Cave',
    image: 'assets/products/product-8.jpg',
    etsyUrl: 'https://www.etsy.com/shop/ATrollPath',
    badge: 'Fan Favorite'
  },
  {
    id: 'woodland-fused-piece',
    name: 'Woodland Fused Glass Art',
    tagline: 'One-of-a-kind forest treasure',
    description:
      'A unique fused glass piece etched and layered by hand — every one is a little different, just like every trail through the woods.',
    priceLabel: 'From the Troll Cave',
    image: 'assets/products/product-14.jpg',
    etsyUrl: 'https://www.etsy.com/shop/ATrollPath'
  }
];

/**
 * GROWTH POINT: gallery images pulled from real studio photos. Add more
 * entries here (or wire this up to a CMS/API later) to grow the gallery
 * without touching the component code.
 */
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'g1', image: 'assets/products/product-1.jpg', caption: 'Fresh from the kiln' },
  { id: 'g2', image: 'assets/products/product-2.jpg', caption: 'Laser-etched detail work' },
  { id: 'g3', image: 'assets/products/product-4.jpg', caption: 'Studio treasures' },
  { id: 'g4', image: 'assets/products/product-5.jpg', caption: 'Glass catching the light' },
  { id: 'g5', image: 'assets/products/product-6.jpg', caption: 'Hand-finished edges' },
  { id: 'g6', image: 'assets/products/product-7.jpg', caption: 'Fused glass in progress' },
  { id: 'g7', image: 'assets/products/product-9.jpg', caption: 'A gothic glow' },
  { id: 'g8', image: 'assets/products/product-10.jpg', caption: 'Etched black linework' },
  { id: 'g9', image: 'assets/products/product-11.jpg', caption: 'Ready for the Troll Cave' },
  { id: 'g10', image: 'assets/products/product-12.jpg', caption: 'Studio session' },
  { id: 'g11', image: 'assets/products/product-13.jpg', caption: 'Color study' },
  { id: 'g12', image: 'assets/products/product-15.jpg', caption: 'Fresh design test' },
  { id: 'g13', image: 'assets/products/product-16.jpg', caption: 'A piece in daylight' },
  { id: 'g14', image: 'assets/products/product-17.jpg', caption: 'Lantern glow' },
  { id: 'g15', image: 'assets/products/product-18.jpg', caption: 'Detail shot' },
  { id: 'g16', image: 'assets/products/product-19.jpg', caption: 'Finishing touches' },
  { id: 'g17', image: 'assets/products/product-20.jpg', caption: 'From the workbench' }
];

export const ETSY_SHOP_URL = 'https://www.etsy.com/shop/ATrollPath';
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61558581587381';
export const PINTEREST_URL = 'https://www.pinterest.com/justjw105';
