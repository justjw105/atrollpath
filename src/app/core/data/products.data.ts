import { Product, GalleryItem, CommissionPiece } from '../models/product.model';

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
      'A set of white, 3D-printed dragon eggs paired with everything you need to paint your own scales and markings — our best-selling quest for aspiring dragon keepers.',
    priceLabel: 'From the Troll Cave',
    image: 'assets/products/product-12.jpg',
    etsyUrl: 'https://www.etsy.com/shop/ATrollPath',
    badge: 'Top Seller'
  },
  {
    id: 'elemental-avatar-lantern',
    name: 'Elemental Avatar Lantern',
    tagline: 'One lantern, four elements',
    description:
      'A gothic stained-glass lantern inspired by Avatar: The Last Airbender, laser-etched with one pane per bending element — a fiery orange flame for Fire, a swirling wave for Water, a solid emblem for Earth, and a matching mark for Air — each pane glowing in its own elemental color.',
    priceLabel: 'From the Troll Cave',
    image: 'assets/products/product-7.jpg',
    etsyUrl: 'https://www.etsy.com/shop/ATrollPath',
    badge: 'Fan Favorite'
  }
];

/**
 * GROWTH POINT: past studio photos, kept for possible future use (e.g. a
 * "process" or "about" page) but no longer shown by the Workbench/Maker's
 * Tower scene, which now spotlights custom commission pieces instead.
 */
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'g1', image: 'assets/products/product-1.jpg', caption: 'Fresh from the studio' },
  { id: 'g2', image: 'assets/products/product-2.jpg', caption: 'Laser-etched detail work' },
  { id: 'g3', image: 'assets/products/product-4.jpg', caption: 'Studio treasures' },
  { id: 'g4', image: 'assets/products/product-5.jpg', caption: 'Glass catching the light' },
  { id: 'g5', image: 'assets/products/product-6.jpg', caption: 'Water and Fire panes together' },
  { id: 'g6', image: 'assets/products/product-7.jpg', caption: 'Earth and Water panes together' },
  { id: 'g7', image: 'assets/products/product-9.jpg', caption: 'Water pane, close up' },
  { id: 'g8', image: 'assets/products/product-10.jpg', caption: 'Earth pane, close up' },
  { id: 'g9', image: 'assets/products/product-11.jpg', caption: 'Water pane, another angle' },
  { id: 'g10', image: 'assets/products/product-12.jpg', caption: 'Dragon egg kit, boxed up' },
  { id: 'g11', image: 'assets/products/product-13.jpg', caption: 'Color study' },
  { id: 'g12', image: 'assets/products/product-15.jpg', caption: 'Fresh design test' },
  { id: 'g13', image: 'assets/products/product-16.jpg', caption: '3D-printed dragon eggs, ready to paint' },
  { id: 'g14', image: 'assets/products/product-17.jpg', caption: 'Kit packaging' },
  { id: 'g15', image: 'assets/products/product-18.jpg', caption: 'Detail shot' },
  { id: 'g16', image: 'assets/products/product-19.jpg', caption: 'Finishing touches' },
  { id: 'g17', image: 'assets/products/product-20.jpg', caption: 'From the workbench' }
];

/**
 * GROWTH POINT: this is the single source of truth for custom commission
 * pieces shown in the Maker's Tower scene (the tower on the hero map). Add a
 * new past commission here as you complete more — each becomes a clickable
 * artifact in the tower with its own inspect panel. Swap ctaUrl/ctaLabel for
 * a dedicated "request a commission" link once you have one.
 */
export const COMMISSIONS: CommissionPiece[] = [
  {
    id: 'memorial-lantern',
    name: 'Memorial Lantern',
    tagline: 'A keepsake to hold their light',
    description:
      'A custom memorial lantern commissioned in loving memory of a customer’s family member. A dark-framed, domed lantern with scalloped detailing and ornate filigree corners houses richly tinted glass panels, hand-etched in fine white linework and personalized with meaningful memorial artwork. Every memorial piece is designed one-on-one with the family to reflect the person being honored.',
    image: 'assets/commissions/memorial-lantern.jpg',
    badge: 'Custom Commission',
    ctaLabel: 'Inquire About a Commission',
    ctaUrl: 'https://www.etsy.com/shop/ATrollPath'
  }
];

export const ETSY_SHOP_URL = 'https://www.etsy.com/shop/ATrollPath';
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61558581587381';
export const PINTEREST_URL = 'https://www.pinterest.com/justjw105';
