import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SceneSeo {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. '/treasure-room' */
  path: string;
  /** Social-preview image, relative to site root */
  image?: string;
}

const SITE_URL = 'https://atrollpath.com';
const DEFAULT_OG_IMAGE = '/assets/img/hero-map.webp';

/**
 * Keeps <title>, meta description, canonical link, and Open Graph / Twitter
 * Card tags in sync with whichever scene is active — so every scene has its
 * own real, distinct, shareable SEO identity even though navigation between
 * them never triggers a full page reload.
 *
 * GROWTH POINT: add a scene's SEO copy alongside its SCENES entry in
 * scene.service.ts (see SCENE_SEO there) — this service just applies
 * whatever it's given.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(seo: SceneSeo): void {
    const url = `${SITE_URL}${seo.path}`;
    const image = `${SITE_URL}${seo.image ?? DEFAULT_OG_IMAGE}`;

    this.title.setTitle(seo.title);

    this.setMeta('description', seo.description);
    this.setMeta('og:title', seo.title, 'property');
    this.setMeta('og:description', seo.description, 'property');
    this.setMeta('og:url', url, 'property');
    this.setMeta('og:image', image, 'property');
    this.setMeta('og:type', 'website', 'property');
    this.setMeta('twitter:card', 'summary_large_image');
    this.setMeta('twitter:title', seo.title);
    this.setMeta('twitter:description', seo.description);
    this.setMeta('twitter:image', image);

    this.setCanonical(url);
  }

  /** Injects or replaces a JSON-LD structured-data block identified by `id`. Pass `data: null` to remove it. */
  setJsonLd(id: string, data: object | null): void {
    const existing = this.document.getElementById(id);
    if (existing) {
      existing.remove();
    }
    if (!data) return;

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  private setMeta(name: string, content: string, attr: 'name' | 'property' = 'name'): void {
    if (this.meta.getTag(`${attr}="${name}"`)) {
      this.meta.updateTag({ [attr]: name, content } as never);
    } else {
      this.meta.addTag({ [attr]: name, content } as never);
    }
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
