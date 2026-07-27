# ATrollPath

Whimsical fantasy landing page for the ATrollPath Etsy shop (Troll Cave) — built with Angular 18 (standalone components).

## Design

- **Theme**: cozy troll/gnome cave, woodland fantasy — moss, amber lantern light, hand-carved wood.
- **Navigation**: a video-game "world map" — click glowing waypoints to travel between sections.
- **Growth-ready**: products and gallery images live in `src/app/core/data/products.data.ts`. Add a product/photo there and it shows up automatically. New page sections are documented inline in `src/app/features/home/home.component.ts` and `src/app/core/services/scroll-spy.service.ts`.

## ⚠️ Image assets (required before first run)

The source code in this repo is complete, but the image files themselves (the
generated fantasy illustrations + your studio product photos, ~16MB total)
are **not committed to git** — they were generated/uploaded in a chat session
and are provided as a one-time download instead of bloating the repo history.

1. Download the asset bundle: **(link shared with you in the Magica chat that built this project)**
2. Unzip it so you end up with:
   ```
   atrollpath/public/assets/img/       <- hero-cave.png, nav-map.png, frame.png, logo.png
   atrollpath/public/assets/products/  <- product-1.jpg ... product-20.jpg
   ```
3. From then on, treat `public/assets/` like any other tracked folder — add new product photos there and reference them in `products.data.ts`.

If you'd rather version images in git going forward, just `git add public/assets` and commit — nothing in `.gitignore` excludes it; they were simply left out of the initial automated push.

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
# then unzip the asset bundle into public/assets/ (see above)
npm start
```

Commit and push your changes from whichever machine you're on, and `git pull` on the others before you start working.
