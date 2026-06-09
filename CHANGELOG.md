# PDP Changelog

All notable changes to the Produce Department Portal are documented here.

---

## [2.7.0] — 2026-06-08

### Added
- **OCR Schedule Scanner**: Tap "Scan" in the Schedule topbar to photograph a printed schedule. Uses Tesseract.js OCR engine to extract text, then a custom text parser identifies employee names and shift times automatically. Includes image pre-processing (contrast boost, sharpening), progress bar, parsed result preview, and apply/retry flow.
- **Tesseract.js v5**: Loaded from CDN for in-browser OCR capability
- **Scan icon**: New viewfinder-style icon in the icon set

### Changed
- Schedule empty state now mentions "Scan" as the primary action
- Schedule home tile description updated to "Scan or build the weekly schedule"
- Version bumped to v2.7.0

### Technical
- Image pre-processing pipeline: resize to max 2000px, contrast 1.3×, brightness 1.05×
- Text parser handles common schedule formats: tab/space-delimited rows, name + 7 shift cells
- Normalizes OCR artifacts (l→1, O→0 in numeric context), dash types, and OFF variants
- Scan results can replace or append to existing employee data

### Files
- `index.html` — Main app (v2.7.0)
- `pdp-v2_5_0.html` — Archived v2.5.0
- `icon192.png` — PWA icon (192×192, circular)
- `icon512.png` — PWA icon (512×512, circular)
- `sw.js` — Service worker (cache v2.7.0)
- `manifest.json` — PWA manifest
- `CHANGELOG.md` — This file

---

## [2.6.0] — 2026-06-08

### Added
- **Digital Schedule**: Replaced photo upload with a full digital schedule entry system. Two-week view ("This Week" / "Next Week") with segment control. Add employees, enter shift times per day (Sun–Sat), tap any cell to edit inline. Auto-calculates weekly hours per employee. Edit mode with add/remove employees and inline shift editing.
- **Schedule Edit button**: Edit/Done toggle in topbar when on the Schedule tab

### Changed
- **Claims tile description**: "Quick shrink calculator" → "Quick Claims Calculator"
- **Claims panel subtitle**: Updated to "Quick Claims Calculator"
- **PWA icons**: New clean circular design with "PDP / PRODUCE DEPT" text on dark green background — fits properly inside phone circle masks
- Service worker cache bumped to `pdp-v2.6.0`

### Removed
- **Image-based schedule**: Removed photo upload, lightbox, pinch-zoom, and all image schedule code
- **Lightbox**: Removed entirely (HTML, CSS, JS) — no longer needed

### Storage
- New localStorage key: `pdp_schedule_v3` (digital schedule data)
- Old key `pdp_schedule_v2` (image data) is no longer used

### Files
- `index.html` — Main app (v2.6.0)
- `pdp-v2_5_0.html` — Archived previous version
- `icon192.png` — PWA icon (192×192, new circular design)
- `icon512.png` — PWA icon (512×512, new circular design)
- `sw.js` — Service worker (cache v2.6.0)
- `CHANGELOG.md` — This file

---

## [2.5.0] — 2026-06-08

### Added
- **Stencil search in Edit mode**: When adding products to any Holes list section or subsection, typing 2+ characters triggers a live stencil autocomplete dropdown showing up to 6 matching items with highlighted text, item codes, and pack/unit info. Tap a suggestion to add it instantly — or type a custom name and hit Add as before.

### Changed
- Service worker cache bumped to `pdp-v2.5.0`

### Files
- `index.html` — Main app (v2.5.0)
- `pdp-v2_4_0.html` — Archived previous version
- `sw.js` — Service worker (cache v2.5.0)
- `CHANGELOG.md` — This file

---

## [2.4.0] — 2026-06-08

### Added
- **GEV List tab**: Dedicated page for the GEV checklist — all 24 categories and 73 items from the master manifest PDF. Tap any item to cross it out; state persists on device. Reset button clears all. Accessible from its own tab and a Home tile.
- **PWA app icon**: The in-app PDP logo is now used as the phone home screen icon (192px and 512px PNG), replacing the SVG favicon
- **Version number**: App version displayed on home screen (v2.4.0)

### Changed
- **Renamed "Load List" → "Holes"**: Tab, home tile, topbar, and all internal references updated
- **Renamed "Unfound" → "Inventory Check"**: Segment control and all related labels
- **Renamed "3% Claims Calculator" → "Claims Calculator"**: Removed "3%" from the tool name (calculation unchanged)
- **6-tab layout**: Tab bar now includes Home, Stencil, Holes, GEV, Schedule, Tools
- Service worker cache bumped to `pdp-v2.4.0`

### Removed
- **Data Specifications section**: Removed from GEV list (was a PDF formatting artifact)
- **"Produce Department Master Manifest Lookup Matrix"**: Removed subtitle text

### Storage
- New localStorage key: `pdp_gev_v1` (GEV crossed-out state)

### Files
- `index.html` — Main app (v2.4.0)
- `pdp-v2_3_0.html` — Archived previous version
- `icon-192.png` — PWA icon (192×192)
- `icon-512.png` — PWA icon (512×512)
- `manifest.json` — Updated with PNG icons
- `sw.js` — Service worker (cache v2.4.0)
- `CHANGELOG.md` — This file

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
