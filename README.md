# ATrollPath

A point-and-click, video-game-style landing page for the ATrollPath Etsy shop (Troll Cave) — built with Angular 18 (standalone components + signals).

## How it works

This isn't a scrolling website — it's a small point-and-click adventure:

- **Scenes, not sections.** Only one full-screen scene is ever on stage at a time: **Cave Entrance → Treasure Room → Friends of the Troll → The Maker's Tower → Troll Cave Exit**. Navigation is a `SceneService` signal (`core/services/scene.service.ts`), not scroll position.
- **Real per-scene URLs.** Each scene also has a real, crawlable, shareable URL (`/`, `/treasure-room`, `/friends-of-the-troll`, `/the-makers-tower`, `/troll-cave`) — see the SEO section below. Every product/commission also gets its own URL (e.g. `/treasure-room/dragon-egg-paint-kit`) that opens the same inspect modal.
- **Hotspots.** Every place you can travel to is a glowing, pulsing hotspot drawn directly on the scene artwork (`shared/hotspot/`) — click a hotspot to go there, exactly like a classic point-and-click adventure game. Off-screen hotspots get a directional edge-arrow marker (`shared/edge-arrow/`) so you always know which way to look.
- **Iris-wipe transitions.** Traveling between scenes plays an old-game circle-close/circle-open transition (`shared/scene-transition/`) with a torch-flicker loading beat and a whoosh + chime sound effect.
- **Quest Map overlay.** The HUD's map button (`shared/game-hud/`) opens a full map overlay (`shared/quest-map-overlay/`) so you can jump to any scene directly, like a game's pause-menu map.
- **Inspect-item panels.** Clicking a product or commission opens an inventory-style "item found" panel (`shared/item-inspect/`) with a multi-photo gallery (prev/next + dots) instead of a plain lightbox.
- **Sound.** Soft hover ticks, a travel chime, and a scene-transition whoosh, togglable from the HUD and persisted to `localStorage` (`core/services/sfx.service.ts`).
- **Intro splash.** A "Click to Begin Your Quest" screen unlocks audio playback (browsers block autoplay before a user gesture) and sets the tone immediately — it's a visual overlay only, so the actual page content is always present underneath for both users and search engines.

## SEO

- **Real URLs per scene**, defined in `app.routes.ts` and `SCENES` in `core/services/scene.service.ts`. Clicking a hotspot updates the URL via Angular's `Location` service (no page reload, transition animation stays intact); browser back/forward also works correctly.
- **Real URLs per product/commission too** (`ITEM_SEO` in `scene.service.ts`, auto-derived from `products.data.ts` — nothing to maintain by hand). Closing the modal via the ✕ button uses `history.back()` if it was opened by a click, or navigates to the parent scene if arrived at directly (so a shared link never accidentally sends someone away from the site).
- **Per-scene/per-item title, meta description, canonical link, and Open Graph / Twitter Card tags**, applied by `core/services/seo.service.ts`. Edit the copy in `SCENE_SEO` (`scene.service.ts`) to change what search engines and social-media link previews show for each scene.
- **Organization structured data** (JSON-LD) is in `src/index.html`, site-wide.
- **`public/robots.txt`** and **`public/sitemap.xml`** list every real URL — update `sitemap.xml` if you add/rename a scene or product, and resubmit it in Google Search Console (Indexing > Sitemaps, just enter `sitemap.xml`).
- **Images are WebP**, not PNG — illustrations went from ~4-5MB each to ~450-550KB with no visible quality loss, which matters for page-speed ranking. Keep new scene backgrounds in WebP too (`convert file.png -quality 82 file.webp`).

## Analytics (Google Analytics 4)

The app is wired for GA4 but ships with a placeholder Measurement ID, so it's a no-op until you add your own:

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com) (Admin > Create Property > Web stream for `atrollpath.com`) and copy its Measurement ID (`G-XXXXXXXXXX`).
2. In `src/index.html`, replace **both** occurrences of `G-XXXXXXXXXX` with your real ID.
3. Rebuild and redeploy as usual.

What's tracked automatically once the ID is in:
- A `page_view` for every scene AND every product/commission modal (each has its own path/title) — fired from `core/services/seo.service.ts`, so it's always in sync with what's SEO-visible.
- A `etsy_click` event, labeled with exactly where the click happened (e.g. `"Dragon Egg Paint Kit"`, `"Memorial Lantern"`, `"Troll Cave Exit CTA"`), whenever someone clicks through to your Etsy shop — from `core/services/analytics.service.ts`. In GA4, look under Reports > Engagement > Events > `etsy_click`, or build an Explore report broken down by the `event_label` parameter to compare which products/pages drive the most Etsy clicks.
- GA4's own "Enhanced measurement" (on by default for new properties) also auto-tracks generic outbound clicks as a safety net, independent of the app's own tracking.

GROWTH POINT: to track clicks on something new (e.g. the Friends of the Troll external links), inject `AnalyticsService` and call `trackEtsyClick(...)` or add a new method following the same pattern.

## Growth points

- **Add a product or commission**: edit `src/app/core/data/products.data.ts` (`FEATURED_PRODUCTS`, `COMMISSIONS`, `FRIEND_SHOPS`). Add an optional `images: string[]` array to give any item its own photo gallery. No other file changes — it automatically gets its own SEO'd URL and click tracking too.
- **Add a new scene**: add an entry to `SCENES` **and** `SCENE_SEO` in `core/services/scene.service.ts`, add a matching route in `app.routes.ts`, create a component under `features/home/<scene-name>/`, add a `@case` in `home.component.html`, and add a hotspot somewhere that leads to it.

## ⚠️ Image & audio assets (required before first run)

The source code in this repo is complete, but the generated illustrations, your
studio product photos, and the sound effects are **not committed to git** —
they were generated/uploaded in a chat session and are provided as a one-time
download instead of bloating the repo history.

1. Download the asset bundle (link shared with you in the Magica chat that built this project).
2. Unzip it into `public/` so the folder structure matches what's referenced in `products.data.ts` and the scene components (`public/assets/img/`, `public/assets/products/`, `public/assets/commissions/`, `public/assets/sfx/`, plus `public/robots.txt` and `public/sitemap.xml`).
3. From then on, treat `public/assets/` like any other tracked folder — add new photos there and reference them in `products.data.ts`. New scene backgrounds go in `public/assets/img/` (as WebP, see SEO section above).

If you'd rather version assets in git going forward, just `git add public/assets` and commit — nothing in `.gitignore` excludes it; they were simply left out of the initial automated push.

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

Output goes to `dist/atrollpath/browser` — deployable to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, Firebase Hosting, etc).

## Deploying to Firebase Hosting

This repo already includes `firebase.json` and `.firebaserc` pointed at the
`atrollpath` Firebase project, configured for a single-page app (all routes
rewrite to `index.html`) with long-cache headers for built assets.

From your own machine (where you're already logged into your Firebase account):

```bash
npm install -g firebase-tools   # if you don't have it yet
git clone https://github.com/justjw105/atrollpath.git
cd atrollpath
npm install
# unzip the asset bundle into public/ first (see above) — the build needs it
npm run build
firebase login                  # opens a browser to sign in, once
firebase deploy --only hosting
```

That deploys the contents of `dist/atrollpath/browser` to your existing
Firebase Hosting site, replacing whatever was there before. If your project
has more than one Hosting site, add `--only hosting:YOUR_SITE_ID` to target
the right one (list them with `firebase hosting:sites:list`).

## Working from multiple computers

This repo is the single source of truth. On each machine:

```bash
git clone https://github.com/justjw105/atrollpath.git
cd atrollpath
npm install
# then unzip the asset bundle into public/ (see above)
npm start
```

Commit and push your changes from whichever machine you're on, and `git pull` on the others before you start working.
