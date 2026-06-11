# PDP Changelog

All notable changes to the Produce Department Portal are documented here.

---

## [3.8.0] — 2026-06-11

### Added
- **Daily Checklist**: New tool in the Tools hub — create an editable list of daily tasks that auto-resets each day. Edit mode lets you rename, delete, and reorder items. Persists in `pdp_checklist_v1`.
- **General Calculator**: Full calculator in the Tools hub — basic arithmetic (+, −, ×, ÷), percentage, sign flip, and copy result. Accessible from its own card tile.
- **Item reordering in Holes edit mode**: Up/down arrow buttons on each product let you change the display order while editing a section or subsection.
- **Subsections in any section**: When editing a flat section (like Veg Wall), a new "Add Subsection" button appears. Adding one converts the section into a grouped section (existing items move into a "General" group). Works just like Endcaps.

### Fixed
- **Notes not saving on mobile**: Save and Delete buttons in the note editor now use `addEventListener` with `preventDefault`/`stopPropagation` instead of bare `.onclick`, fixing tap reliability on Android and iOS.
- **Notifications permission flow**: Permission is now requested as an `async/await` flow inside the Set Reminder tap handler (proper user gesture). Status feedback tells you whether notifications are enabled, blocked, or unsupported. Added note that app must stay open/backgrounded for timer-based alerts.

### Changed
- Tools hub now shows Daily Checklist and Calculator as top-level card tiles
- Claims Calculator copy button rebound with `addEventListener`
- Notification status message is more descriptive and honest about limitations
- Home Tools tile description updated to "Checklist, Notes, Calculator & more"
- Version bumped to v3.8.0

### Files
- `index.html` — Main app (v3.8.0)
- `pdp-old-v3_7_0.html` — Archived v3.7.0
- `sw.js` — Service worker (cache v3.8.0)
- `manifest.json` — PWA manifest
- `icon192.png` / `icon512.png` — PWA icons
- `CHANGELOG.md` — This file
- `README.md` — Project readme

---

## [3.7.0] — 2026-06-10

### Fixed
- **Reminders tab not opening on mobile**: The notification permission prompt was being requested the moment the Reminders view rendered. iOS only allows that request from a direct tap, so it threw an error and killed the view before anything drew. Permission is now requested when you tap **Set Reminder** (a real tap), and the whole call is guarded so it can never break the page again.
- **Scan retry mode bug**: After a failed GEV scan, tapping Retry reopened the scanner in Schedule mode. Retry now keeps the original scan mode.

### Added
- **Per-day Inventory Check actions**: Each saved day in Inv. Check now has its own small **Copy** and **Delete** buttons on the day header — copy or remove a single day without touching the rest.

### Changed
- **New scanning animation**: A scanner-style light beam sweeps over your photo while Claude reads it, with a smooth indeterminate progress bar (no more frozen pulsing bar). Respects reduced-motion settings.
- **Cleaner scan failure screen**: Failures now show one tidy card — icon, "Scan failed," the reason, and clear **Try Again** / **Cancel** buttons — instead of an error box appended under the in-progress UI.
- Inv. Check bottom buttons renamed to **Copy All** / **Clear All** for clarity
- Tools hub and Reminders buttons rebound with `addEventListener` for Android tap reliability
- Version bumped to v3.7.0

### Files
- `index.html` — Main app (v3.7.0)
- `pdp-old-v3_6_0.html` — Archived v3.6.0
- `sw.js` — Service worker (cache v3.7.0)
- `manifest.json` — PWA manifest
- `icon192.png` / `icon512.png` — PWA icons
- `CHANGELOG.md` — This file
- `README.md` — Rewritten

---

## [3.6.0] — 2026-06-10

### Added
- **Notes**: Full notes system in the Tools tab — create, edit, and delete notes. Persists in localStorage (`pdp_notes_v1`), sorted by last updated.
- **Reminders / Calendar**: Date & time reminders with push notification support, upcoming and past lists, and auto-scheduled alerts for reminders within 7 days. Persists in `pdp_reminders_v1`.
- **Tools Hub**: Tools tab redesigned as a navigation hub with card links to Notes, Reminders, and Claims Calculator, with sub-view back navigation.
- New icons: Note, Bell, Trash

### Changed
- Home Tools tile updated to "Tools / Notes, Claims & Reminders"
- Version bumped to v3.6.0

---


## [2.9.0] — 2026-06-09

### Added
- **Editable Stencil**: Tap Edit in the Stencil topbar to enter edit mode. Add custom items (code, description, pack, unit), edit any item (custom or built-in), and delete custom items. Custom items appear under "★ Custom Items" at the top of the list with a CUSTOM badge.
- **Stencil custom storage**: Custom items saved in `pdp_stencil_custom_v1`, edits to built-in items saved in `pdp_stencil_edits_v1`
- **Pencil edit icon**: New icon in the icon set

### Changed
- **GEV tile description removed**: Home tile for GEV List no longer shows a subtitle
- Stencil item count now includes custom items
- Version bumped to v2.9.0

### Files
- `index.html` — Main app (v2.9.0)
- `pdp-v2_5_0.html` — Archived v2.5.0
- `icon192.png` / `icon512.png` — PWA icons (circular)
- `sw.js` — Service worker (cache v2.9.0)
- `manifest.json` — PWA manifest
- `CHANGELOG.md` — This file

---

## [2.8.0] — 2026-06-09

### Changed
- **Scanner rebuilt with Claude Vision API**: Replaced Tesseract.js OCR with Anthropic's Claude API (vision). Photos are sent to Claude Sonnet which reads the grid layout visually and returns structured JSON — dramatically more accurate than client-side OCR on complex grid schedules.
- **One-time API key setup**: First scan prompts for an Anthropic API key (stored in localStorage as `pdp_api_key`, never leaves the device). "Change API key" option available in the scan overlay.
- **Removed Tesseract.js**: No longer loaded from CDN — smaller footprint, no external dependency for core app features
- Image compression: photos resized to max 1800px and JPEG-compressed before sending to API for fast upload
- Version bumped to v2.8.0

### Files
- `index.html` — Main app (v2.8.0)
- `pdp-v2_5_0.html` — Archived v2.5.0
- `icon192.png` / `icon512.png` — PWA icons (circular)
- `sw.js` — Service worker (cache v2.8.0)
- `manifest.json` — PWA manifest
- `CHANGELOG.md` — This file

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
