import { Injectable, OnDestroy, signal } from '@angular/core';

export interface QuestNode {
  id: string;
  label: string;
  /** position along the world-map path, 0-100 (%) on both axes */
  x: number;
  y: number;
}

/**
 * GROWTH POINT: add a new section to the site by:
 *  1. Adding an entry to QUEST_NODES below (id must match the section's DOM id).
 *  2. Adding a matching <section id="..."> in home.component.html (or a new page).
 * The world-map nav and active-state tracking pick it up automatically.
 */
export const QUEST_NODES: QuestNode[] = [
  { id: 'hero', label: 'Welcome', x: 12, y: 78 },
  { id: 'featured', label: 'Treasures', x: 38, y: 32 },
  { id: 'gallery', label: 'Gallery', x: 66, y: 62 },
  { id: 'visit', label: 'Troll Cave', x: 90, y: 22 }
];

@Injectable({ providedIn: 'root' })
export class ScrollSpyService implements OnDestroy {
  readonly activeId = signal<string>(QUEST_NODES[0].id);

  private observer?: IntersectionObserver;

  /** Call once from the shell after view init to start tracking sections. */
  observe(root: HTMLElement | null = null): void {
    this.disconnect();

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          this.activeId.set(visible.target.id);
        }
      },
      { root, rootMargin: '-35% 0px -50% 0px', threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    for (const node of QUEST_NODES) {
      const el = document.getElementById(node.id);
      if (el) {
        this.observer.observe(el);
      }
    }
  }

  disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
