# PDP Changelog

All notable changes to the Produce Department Portal are documented here.

---

## [2.3.0] — 2026-06-08

### Fixed
- **Unfound clear button**: Rewired with addEventListener for reliable event binding on mobile

### Changed
- **Smaller buttons**: All `.btn` elements reduced from 15px/15px to 13px/10px padding — cleaner, more professional on mobile
- **Schedule simplified**: Removed fullscreen, download, and expand overlay buttons — just the two images stacked with "Replace" as a subtle inline link next to the label. Tap image to zoom.
- **Load list action bar**: Tighter spacing, smaller summary text
- **Unfound items**: Slightly smaller cards and text for denser scanning

---

## [2.2.0] — 2026-06-08

### Added
- **Save Unfound Items**: New action at the bottom of the compiled list saves all unchecked items to persistent storage for order adjustment reference, then clears the list
- **Unfound tab**: Third segment on the Load List ("Unfound") shows saved unfound snapshots grouped by date — stores up to 10 most recent saves
- **Action bar**: Compiled list now shows a found/unfound summary with "Save Unfound" and "Clear List" buttons at the bottom
- **Clear Saved Unfound**: Button on the Unfound tab to wipe saved history

### Changed
- "Clear" button removed from topbar; list actions now consolidated at the bottom of the compiled list for clearer workflow
- Service worker cache bumped to v2.2.0

### Storage
- New localStorage key: `pdp_unfound_v1`

---

## [2.1.0] — 2026-06-07

### Changed
- **Dark theme**: Full app switched to a dark green-tinted background with light text — easier on the eyes in back-of-house lighting
- **Schedule shows both pages**: Page 1 and Page 2 now display stacked on one screen — no more tab switching to compare weeks
- **Schedule upload**: Each page has its own independent upload/replace/download/fullscreen controls

### Updated
- Theme color meta tag and manifest background updated for dark mode
- Service worker cache bumped to v2.1.0
- Topbar and tabbar blur layers matched to dark palette
- Hero gradient, claims calculator, and all tint colors adjusted for dark contrast

---

## [2.0.0] — 2026-06-07

### Changed
- **PLU Lookup → Stencil**: Renamed across entire app (tab, home tile, tools panel, load list references)
- **Stencil now shows full item list**: All 816 items display grouped by category on load — no search required to browse
- **Filter replaces search-only**: Sticky filter bar at top lets you narrow down the full list by name, code, or keyword
- **Filter icon**: Stencil tab uses a filter icon instead of a magnifying glass to reflect the new browse-first behavior

### Added
- **Plan-O-Grams (Coming Soon)**: New tile on home screen and tools panel — section layout diagrams coming in a future release
- **Version number**: "PDP v2.0.0" displayed at the bottom of the home screen
- **Custom SVG logo**: `favicon.svg` — a branded PDP icon used as the app favicon
- **PWA manifest**: `manifest.json` for home-screen installation with proper app name, colors, and icon
- **Service worker**: `sw.js` caches all assets for full offline support
- **Changelog**: This file (`CHANGELOG.md`) — updated with every release

### Files
- `index.html` — Main app (v2.0.0)
- `pdp-v1.0.0.html` — Archived previous version
- `favicon.svg` — App logo
- `manifest.json` — PWA manifest
- `sw.js` — Service worker
- `CHANGELOG.md` — This file

---

## [1.0.0] — 2026 (initial)

### Features
- Five-tab layout: Home, PLU, Load List, Schedule, Tools
- PLU Lookup with 816-item stencil search
- Load List with sections, subsections, inline editing, pull tracking
- Schedule image manager with two-page support, compression, lightbox
- 3% Claims Calculator with clipboard copy
- Fully offline, single-file architecture
- localStorage persistence (`produce_pull_list_v5`, `pdp_schedule_v2`)
- Corporate bottom navigation bar
