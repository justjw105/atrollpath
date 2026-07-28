# ATrollPath

A point-and-click, video-game-style landing page for the ATrollPath Etsy shop (Troll Cave) — built with Angular 18 (standalone components + signals).

## How it works

This isn't a scrolling website — it's a small point-and-click adventure:

- **Scenes, not sections.** Only one full-screen scene is ever on stage at a time: **Cave Entrance → Treasure Room → Friends of the Troll → The Maker's Tower → Troll Cave Exit**. Navigation is a `SceneService` signal (`core/services/scene.service.ts`), not scroll position.
- **Hotspots.** Every place you can travel to is a glowing, pulsing hotspot drawn directly on the scene artwork (`shared/hotspot/`) — click a hotspot to go there, exactly like a classic point-and-click adventure game. Off-screen hotspots get a directional edge-arrow marker (`shared/edge-arrow/`) so you always know which way to look.
- **Iris-wipe transitions.** Traveling between scenes plays an old-game circle-close/circle-open transition (`shared/scene-transition/`) with a torch-flicker loading beat and a whoosh + chime sound effect.
- **Quest Map overlay.** The HUD's map button (`shared/game-hud/`) opens a full map overlay (`shared/quest-map-overlay/`) so you can jump to any scene directly, like a game's pause-menu map.
- **Inspect-item panels.** Clicking a product or commission opens an inventory-style "item found" panel (`shared/item-inspect/`) with a multi-photo gallery (prev/next + dots) instead of a plain lightbox.
- **Sound.** Soft hover ticks, a travel chime, and a scene-transition whoosh, togglable from the HUD and persisted to `localStorage` (`core/services/sfx.service.ts`).
- **Intro splash.** A "Click to Begin Your Quest" screen unlocks audio playback (browsers block autoplay before a user gesture) and sets the tone immediately.

## Growth points

- **Add a product or commission**: edit `src/app/core/data/products.data.ts` (`FEATURED_PRODUCTS`, `COMMISSIONS`, `FRIEND_SHOPS`). Add an optional `images: string[]` array to give any item its own photo gallery. No other file changes.
- **Add a new scene**: add an entry to `SCENES` in `core/services/scene.service.ts`, create a component under `features/home/<scene-name>/`, add a `@case` in `home.component.html`, and add a hotspot somewhere that leads to it.

## ⚠️ Image & audio assets (required before first run)

The source code in this repo is complete, but the generated illustrations, your
studio product photos, and the sound effects are **not committed to git** —
they were generated/uploaded in a chat session and are provided as a one-time
download instead of bloating the repo history.

1. Download the asset bundle (link shared with you in the Magica chat that built this project).
2. Unzip it into `public/assets/` so the folder structure matches what's referenced in `products.data.ts` and the scene components (`public/assets/img/`, `public/assets/products/`, `public/assets/commissions/`, `public/assets/sfx/`).
3. From then on, treat `public/assets/` like any other tracked folder — add new photos there and reference them in `products.data.ts`. New scene backgrounds go in `public/assets/img/`.

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
# unzip the asset bundle into public/assets/ first (see above) — the build needs it
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
# then unzip the asset bundle into public/assets/ (see above)
npm start
```

Commit and push your changes from whichever machine you're on, and `git pull` on the others before you start working.
