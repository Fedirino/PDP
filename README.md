# PDP — Produce Department Portal

**Current version: v5.18.0**

So here's the thing: I work in a produce department, not a software company. I didn't set out to "build an app." I set out to stop rewriting the same pull list on a crumpled piece of paper every morning. One thing led to another, and now my phone runs the whole department.

This is that app.

## What it actually does

- **Holes / Load List** — Walk the floor, tap what's empty, get a clean pull list. Snapshot whatever's still unchecked into an **Inventory Check** so order adjustments don't live in my head. Crossed-off items drop to the bottom across all categories, not just within them.
- **Stencil** — A master item log (item codes, pack sizes, units) built by photographing every price stencil in the back room. Searchable in two keystrokes, editable when the warehouse changes things on us. Includes AI-assisted search over normalized item names.
- **Schedule** — Point the camera at the printed wall schedule and AI reads the whole grid: every employee, every shift, net hours calculated after meal breaks. Keeps This Week and Next Week, with a one-tap **Push Next Week → This Week** when the new sheet goes up.
- **GEV Lists** — Scannable, checkable Guaranteed Everyday Variety lists. Tap to cross off, keep multiple named lists.
- **Documents** — Department paperwork: **Daily Notes**, **Display Plan**, and **Sales Items**. Scan the printed sheets and AI rebuilds them digitally — blocks, bullets, and tables reproduced cell-for-cell. Original photo kept alongside, full edit mode, one-tap copy.
- **Tools** — Notes, date/time reminders, checklists, and a claims calculator, because pockets only hold so many sticky notes.

## Architecture

One HTML file. Plain CSS and JavaScript. No frameworks, no build tools, no bundler — partly because I didn't know them, mostly because I didn't need them.

| Piece | What it is |
|---|---|
| **App** | Single-file vanilla HTML/CSS/JS PWA (`index.html`) |
| **Local storage** | `localStorage`, keys prefixed `pdp_*` |
| **Offline** | Service worker (`sw.js`), cache name `pdp-v{version}` |
| **Hosting** | Firebase Hosting — project `producedepartmentportal` |
| **Sync / auth** | Firebase Firestore + Google sign-in (`signInWithPopup`) |
| **AI scanning** | OpenRouter, model selectable in Settings (default `google/gemini-3.1-pro-preview`) |
| **Deploy** | GitHub Actions → `.github/workflows/firebase-hosting-merge.yml`, fires on push to `main` |

Firestore access is governed by `firestore.rules`. Hosting config, including the `no-cache` headers that keep stale builds from sticking, lives in `firebase.json`.

## Deploying a new version

Every change follows the same five steps. Skipping step 2 is how v5.17.7 ended up live wearing a v5.17.6 label:

1. Add the entry to `CHANGELOG.md`
2. Bump the version string in `index.html` — the Home-tab footer **and** the three icon `?v=` query strings in `<head>`
3. Bump the `manifest.json` version query strings (`start_url` + both icons)
4. Bump the `sw.js` cache name to `pdp-v{version}`
5. Run `node scripts/verify-project.mjs`, then push to `main` — GitHub Actions runs the same check before deploying hosting and Firestore rules

Old versions live in git history, not as `pdp-old-*.html` files. To pull one: `git show {commit}:index.html`.

## Lessons collected along the way (the hard way)

- Mobile browsers treat `.onclick` like a suggestion. `addEventListener` with `preventDefault`/`stopPropagation`, or nothing.
- iOS will let you *ask* for notification permission only when a human finger is involved. Ask at render time and your whole view silently dies. (v3.7.0 learned this one personally.)
- All asset paths must be relative (`./icon192.png`, never `/icon192.png`).
- Two hidden file inputs on mobile = chaos. One input with a toggled `capture` attribute = peace.
- `seed()` only runs on fresh installs. It never overwrites data already on a device.
- Don't rewrite a working scan prompt without a reason. Two separate rewrites both made accuracy worse.
- After changing icons or the manifest, re-add the PWA to your home screen. Yes, again.

Every change is logged in [CHANGELOG.md](CHANGELOG.md).

---

*Built one shift at a time, for Store 2606's produce crew.*
