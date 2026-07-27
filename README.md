# ATrollPath

Whimsical fantasy landing page for the ATrollPath Etsy shop (Troll Cave) — built with Angular 18 (standalone components).

## Design

- **Theme**: cozy troll/gnome cave, woodland fantasy — moss, amber lantern light, hand-carved wood.
- **Navigation**: a video-game "world map" — click glowing waypoints to travel between sections.
- **Growth-ready**: products and gallery images live in `src/app/core/data/products.data.ts`. Add a product/photo there and it shows up automatically. New page sections are documented inline in `src/app/features/home/home.component.ts` and `src/app/core/services/scroll-spy.service.ts`.

## Development

```bash
npm install
npm start
```

Navigate to `http://localhost:4200/`. The app reloads automatically on file changes.

## Build

```bash
npm run build
```

Output goes to `dist/atrollpath/browser` — deployable to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc).

## Working from multiple computers

This repo is the single source of truth. On each machine:

```bash
git clone https://github.com/justjw105/atrollpath.git
cd atrollpath
npm install
npm start
```

Commit and push your changes from whichever machine you're on, and `git pull` on the others before you start working.
