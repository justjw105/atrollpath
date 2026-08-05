import { Injectable } from '@angular/core';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const SITE_URL = 'https://atrollpath.com';

/**
 * Thin wrapper around GA4's gtag.js. Every call is a no-op if gtag isn't
 * loaded (e.g. no Measurement ID configured yet in index.html, or an ad
 * blocker) — so the app works identically with or without analytics wired up.
 *
 * GROWTH POINT: once you have a GA4 Measurement ID, drop it into the two
 * `G-XXXXXXXXXX` placeholders in src/index.html — no other changes needed,
 * page views (scene + item-modal changes) and Etsy click tracking are
 * already wired through this service.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  /** Fires a virtual page_view — called whenever the active scene or item modal changes. */
  trackPageView(path: string, title: string): void {
    this.send('page_view', {
      page_path: path,
      page_title: title,
      page_location: `${SITE_URL}${path}`
    });
  }

  /** Fires when a visitor clicks through to the Etsy shop, tagged with where they clicked from. */
  trackEtsyClick(source: string): void {
    this.send('etsy_click', {
      event_category: 'outbound',
      event_label: source,
      link_url: 'https://www.etsy.com/shop/ATrollPath'
    });
  }

  private send(eventName: string, params: Record<string, unknown>): void {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params);
  }
}
