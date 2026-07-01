# PDP Changelog

All notable changes to the Produce Department Portal are documented here.

---

## [5.18.0] — 2026-07-01

### Changed
- **OpenRouter is now the default AI provider.** PDP’s scan/settings AI path now defaults to OpenRouter instead of Anthropic, while still allowing Anthropic to be selected manually.
- **Provider selection + key storage were added.** Settings now let you choose Anthropic or OpenRouter, store the matching key locally, and set an OpenRouter model.
- **OpenRouter request routing was added.** Scan requests now call OpenRouter’s chat completions endpoint when that provider is selected.
- This change preserves the existing Anthropic path for users who want to keep using it.

### Files
- `index.html` — Main app (OpenRouter default + provider switch)
- `sw.js` — cache bumped to `pdp-v5.17.0`
- `CHANGELOG.md` — this file
- `manifest.json`, icons — unchanged

---

## [5.11.0] — 2026-06-15

### Changed — Display Plan now reads and draws the fixtures as true grids
- **Promo tables & hero pods render as the real fixture.** A Refrigerated/Dry Promo Table or Hero Pod now draws as a bordered grid: the **Shelf** deck sits directly above the **Well** deck with the **columns aligned** (Shelf column 1 over Well column 1, etc.), and **Wings** show as bands above/below. This matches the printed sheet instead of a flat list.
- **Columns can stack.** A single column cell can hold several items stacked vertically plus its tags (e.g. "Strawberries / 11x14 / TPR") — these now stay together in the correct column instead of spilling sideways into the wrong slot.
- **Reworked the scan prompt to be grid-aware.** It now tells the model that the Shelf and Well are a 2-D grid with the same number of aligned columns, to count columns first, read column-by-column left→right, and keep each column's stacked items/tags together. This is the main fix for "items landing in the wrong spot/order" on denser weeks. Ends/islands still read as ordered Priority/Item lists (Front Wing → 1–N front-to-back → Back Wing).
- **Fixture vs. list is now detected automatically** by whether a block actually has Shelf/Well rows (ends stay as clean plain tables).

### Improved scan accuracy
- **Higher-resolution capture.** The image sent to the AI is now ~2048px at higher quality (was 1500px), so small grid text is legible and items map to the right column.
- **Capture guidance.** The Display Plan scanner now suggests holding the page straight, filling the frame, and splitting a dense plan into 2–3 close-ups (top half / bottom half) — each shot adds to the same week.

### Files
- `index.html` — Main app (v5.11.0)
- `sw.js` — cache bumped to `pdp-v5.11.0`
- `pdp-old-v5_10_0.html` — archived previous version
- `CHANGELOG.md` — this file
- `manifest.json`, icons — unchanged

---

## [5.10.0] — 2026-06-15

### Changed
- **"Sales Plan" is now "Display Plan"** everywhere in the app (tab section, scan flow, settings, toasts). Existing saved plans are untouched — only the labels changed.
- **Reworked the Display Plan scan prompt.** It is now fixture-aware and order-strict, which fixes the "wrong spots" problem seen on the second week:
  - **One item per row, left-to-right.** The model no longer crams several products into one cell. Each physical slot becomes its own row in printed order, so a shelf's left-to-right sequence is preserved exactly.
  - **Refrigerated Promo Table & Refrigerated Veg Promo Table** are read as a **Shelf** (upper deck) + **Well** (lower deck) with **Wings** on the ends, each read left-to-right.
  - **End caps / islands** (Stone Fruit, Berry, Grape, Potato, Organic Fruit, Avocado, Tomato…) are read in printed order: Front Wing → main positions (Left/Center/Right or 1–4, front-to-back) → Back Wing. The back-wing and island order are called out as critical.
  - The sheet's promo date range (e.g. "6/12-7/16") is no longer mistaken for the display week — the app sets the week itself (see below).

### Added
- **Item-description tags.** Promo flags **DEAL LOCK**, **SPOT BUY**, and **TPR** render as amber chips. Sign-size codes like **11x14** now render as a small grey chip attached to their item, instead of being lost in the text.
- **Display weeks (Fri → Thu).** Each Display Plan is a one-week plan running the upcoming **Friday through the next Thursday**. When you scan, the week is auto-set and shown with **‹ ›** buttons so you can shift it a week back/forward before saving. Add as many weeks as you like; switch between them with the date dropdown. Re-scanning an existing week lets you add to it or replace it.

### Display rendering
- **Refrigerated promo tables** now draw as a true fixture: wings broken out separately on top, then numbered Shelf slots, then numbered Well slots — so order on each deck is unmistakable.
- **Every other block** (ends, islands, hero pods, value bins, authorized displays) draws as a clean, ordered **plain table** (Position | Item), matching the printed layout.

### Storage / retention
- Display Plan retention extended to **70 days (~10 weeks)** so older weeks aren't pruned too soon. Daily Notes still keep the last two weeks.

### Files
- `index.html` — Main app (v5.10.0)
- `sw.js` — cache bumped to `pdp-v5.10.0`
- `pdp-old-v5_9_3.html` — archived previous version
- `CHANGELOG.md` — this file
- `manifest.json`, icons — unchanged

---

## [4.9.0] — 2026-06-14

### Changed
- **Netlify proxy for API calls**: All Claude AI scan requests now route through a Netlify serverless function (`netlify/functions/scan.js`) instead of calling Anthropic directly from the browser. The API key lives in Netlify's environment variables — never in GitHub source code or the browser.
- **API key UI removed**: No more "Enter API key" prompt or "Change API key" button. Scans just work for all coworkers with no setup required.

### Added
- `netlify/functions/scan.js` — Serverless proxy function. Reads `ANTHROPIC_API_KEY` from Netlify environment and forwards requests to Anthropic.

### Files
- `index.html` — Main app (v4.9.0)
- `pdp-old-v4_8_0.html` — Archived v4.8.0
- `sw.js` — Service worker (cache v4.9.0)
- `netlify/functions/scan.js` — NEW: API proxy function
- `CHANGELOG.md` — This file

---

## [4.8.0] — 2026-06-11

### Changed
- **Crossed-off items now drop to the bottom of the whole list — across categories, not just within them.**
  - **GEV:** Each category shows only the items still to do (with a live count). Everything you've crossed off collects under a single **Crossed off** group at the very bottom, regardless of which category it came from. Tap a crossed item there to bring it back up to its category.
  - **Holes (List view):** Items still needed stay grouped by section / stencil category as before; everything marked found drops into one **Found** group at the very bottom. The found/remaining summary is unchanged.

### Files
- `index.html` — Main app (v4.8.0)
- `sw.js` — cache bumped to `pdp-v4.8.0`
- `pdp-old-v4_7_0.html` — archived previous version
- `manifest.json`, icons — unchanged

---

## [4.7.0] — 2026-06-11

### Changed
- **GEV lists now sink crossed-off items to the bottom.** Within each category, items you haven't crossed off stay on top; tapping one to cross it off drops it to the bottom of that category, so what's left to do is always front and center. (Edit mode keeps the original order so you can manage the list.)
- **Document photos are hidden.** Daily Notes and Sales Plan no longer show the scanned picture or the "Copy photo" button — the digital version is all that's shown. New scans no longer store the photo at all, which keeps storage light. (The embedded example photos were removed too, shrinking the app by ~270 KB.)

### Sales Plan order
- Blocks now display in a fixed priority order: **Refrigerated Promo → Refrigerated Veg Promo → Stone Fruit End 2 (Power Side) → Berry End → Grape End**, with every other block following in its original order. Matching is by block name, so re-scans and the seeded example both follow this order automatically.

### Files
- `index.html` — Main app (v4.7.0)
- `sw.js` — cache bumped to `pdp-v4.7.0`
- `pdp-old-v4_6_0.html` — archived previous version
- `manifest.json`, icons — unchanged

---

## [4.6.0] — 2026-06-11

### Changed
- **Sales Plan now renders as a true digital copy of the plan** — not generic cards. Each block draws like the printed fixture: a titled header bar, position slots down the left (Power Wing, Shelf, Well, 1–4, Back Wing…), and the items stacked beside them. Cells holding several items are split onto their own lines, and **DEAL LOCK** / **SPOT BUY** print as small amber tags. Empty slots show a dash so the fixture shape is preserved. The plan's italic notes sit under each block header. Photos remain attached as backup, but the digital version is now the main read.
- Daily Notes keep their existing card/table layout — only the Sales Plan section gets the plan-style rendering. Edit mode, copy text/photo, delete, the dropdown, and the two-week retention all work exactly as before.

### Files
- `index.html` — Main app (v4.6.0)
- `sw.js` — cache bumped to `pdp-v4.6.0`
- `pdp-old-v4_5_0.html` — archived previous version
- `manifest.json`, icons — unchanged

---

## [4.5.0] — 2026-06-11

### Changed
- **Documents is now organized into sections.** Opening the Documents tab shows a chooser:
  - **Daily Notes** — the daily bulletin scanner from v4.4.0, now its own section.
  - **Sales Plan** — new. Scan the weekly produce display plan (the multi-page sheet of promo tables, end caps, hero pods, value bins, authorized displays, etc.). Claude rebuilds every titled block as a digital card with its grid reproduced as a table. Same multi-page scan flow as Daily Notes.
  - **Plan-O-Gram** — placeholder, still marked **Coming Soon**.

### Added
- **Two-week retention** (same idea as the Schedule's two-week window): each section automatically keeps only the last 14 days of documents, newest first, so storage stays bounded. Older entries drop off on their own.
- **Edit mode** for any scanned document (tap **Edit**, top right): rename the date label, edit each section's title / subject / contact, edit bullets (one per line; start a line with `>>` for a sub-bullet), and edit table cells. Add or delete sections, add tables, and add or delete table rows. Tap **Done** to save.
- **Delete** any individual document from its section (unchanged behavior, now per section).
- **Seeded example Sales Plan**: this build ships with the 6/12–7/16 display plan (pages 8 & 10) already transcribed into the Sales Plan section, original photos attached. It's a normal saved document — edit it or delete it like any other. (Double-check the dense recap/allocation-style grids against the printout; transcription was done from the photos and a couple of tight cells may need a tweak in Edit.)

### Files
- `index.html` — Main app (v4.5.0); includes the embedded example Sales Plan photos
- `sw.js` — cache bumped to `pdp-v4.5.0`
- `pdp-old-v4_4_0.html` — archived previous version
- `manifest.json`, icons — unchanged

---

## [4.4.0] — 2026-06-11

### Added
- **Documents tab (new)**: A dedicated section for department paperwork, with **Daily Notes** as the first document type. Lives in the bottom tab bar (folder icon) and as a tile on the Home screen.
- **Scan Daily Notes (multi-page)**: Tap **Scan** in the Documents tab, then add every page of the printed Daily Notes (camera or upload — a sheet usually runs 2+ pages). Claude reads all pages together and rebuilds the bulletin digitally: each Category / Contact / Subject block, every bullet (including indented sub-bullets), and **every table reproduced cell-for-cell** (Division Recap, Allocations, Organic End plans, etc.). Tables scroll horizontally so wide grids stay exact.
- **Stored by date with a dropdown**: Every scan is saved as its own dated document. A dropdown at the top of the tab cycles between days; newest first. Re-scanning a date you already have offers to replace or keep both.
- **Original photo kept**: The source photo(s) are stored with each document as thumbnails. Tap to open full-screen; **Copy photo** puts the image on the clipboard. **Copy text** copies the whole bulletin as clean plain text. **Delete** removes the current document.

### Notes
- Uses the same on-device Anthropic API key as the Schedule and GEV scanners — no extra setup if you've already entered one.
- Photos are compressed before storage to conserve space; if local storage fills up, the app warns that the oldest notes may not persist.

### Files
- `index.html` — Main app (v4.4.0)
- `sw.js` — cache bumped to `pdp-v4.4.0`
- `pdp-old-v4_3_0.html` — archived previous version
- `manifest.json`, icons — unchanged

---

## [4.3.0] — 2026-06-11

### Changed
- **Holes default items**: All sections now pre-loaded with actual Store 2606 items instead of generic placeholders. Endcaps (Apple end, Berry end, Grapes, Melons, Pears), Veg Wall, Stone fruit, Apples, Berries, Seasonal, Ethnic, Tomatoes, Citrus, Peppers, and Potatoes all reflect real department SKUs and variety names.

---

## [4.2.0] — 2026-06-11

### Changed
- **Home screen rework**: The Holes / GEV done / In today stat tiles are gone. In their place: a **Next in** card showing who comes in next and at what time (today, tomorrow, or the next scheduled day — pulled live from the Schedule tab, tap to open), and a **Reminders** field — a free-text scratchpad on the Home screen that auto-saves as you type (stored locally, survives restarts).
- **Coming Soon condensed**: Plan-O-Grams / Daily Notes / Sales Plan tiles collapsed into a single **Documents** tile (still marked Soon).

### Fixed
- **Giant trash icon on Notes**: The Delete Note button's trash icon had no size rule and rendered enormous. Now 15px and properly aligned.
- **Daily Checklist delete**: Same root cause — the edit/delete (pen/X) icons in checklist Edit mode had no size rule, rendering huge and breaking the row. Icons now sized correctly, so deleting checklist items works as intended (tap **Edit**, then the X next to an item).

### Scan accuracy
- **Other-department shifts are now excluded**: "(GROCERY) CLERK", "(DAIRY) CLERK", and any other non-produce role no longer appear on the schedule at all. Only CLERK, HEADCLERK, and MANAGER shifts count. This is enforced twice: in the AI prompt (treat loaned-out cells as empty) and in a code-level safety net that strips any shift containing a department label even if the AI slips one through.
- **Self-checking prompt**: The Wall Schedule prints its own math — each worked cell shows a daily-hours figure (e.g. 8.00) and each row a Total Hours figure. The AI is now instructed to verify every extracted shift against them (end − start − meal must equal the printed hours; row total must match Total Hours), catching misread digits and A/P mixups before they reach you.
- **Structured read procedure**: Prompt rewritten as an ordered procedure — orient first, read header dates, then process one row at a time following the gridlines (row heights vary). The model also states its determined orientation and week date on one line before the JSON, which forces it to commit to orientation before reading (the JSON parser already strips this preamble).

### Files
- `index.html` — Main app (v4.2.0)
- `pdp-old-v4_1_0.html` — Archived v4.1.0
- `sw.js` — Service worker (cache v4.2.0)
- `manifest.json` — PWA manifest (unchanged)

---

## [4.1.0] — 2026-06-11

### Changed
- **Condensed Home screen**: Tool tiles are now a compact 2-column grid — icon + name only, no descriptions. Coming Soon items shrunk to slim rows. Everything fits one screen.
- **Time on Home**: Current time now shows next to the date in the hero and ticks live while the Home tab is open.
- **"In today" stat** no longer counts Request Off / Unavailable entries as working.

### Fixed
- **Notifications now actually fire on phones**: Reminders were using `new Notification()`, which Android (and iOS) PWAs silently block — notifications must go through the service worker. All reminder alerts now use `registration.showNotification()` with vibration, falling back to in-app toast if blocked. Added a **Send test notification** button in Reminders so you can verify instantly.
- **Missed-reminder catch-up**: Browsers throttle timers while the app is backgrounded. When you return to the app, any reminders that came due while you were away now fire immediately (within 24h) instead of being lost.
- **Sideways scan photos**: Camera photos carry EXIF rotation data that the scanner was ignoring, sending Claude rotated images — a major source of failed/garbled scans. Images are now orientation-normalized via `createImageBitmap` before upload. JPEG quality bumped 0.85 → 0.92 for crisper text.

### Scan accuracy
- **Loaned-shift labels**: Shifts with a role other than CLERK / HEADCLERK / MANAGER (e.g. "(GROCERY) CLERK", "(DAIRY) CLERK") now keep the label — extracted as "4:00P-9:00P (Grocery)" so you can see who's loaned out. Standard produce roles stay clean time-only.
- **Rotation-aware prompt**: Claude is now told the photo may be rotated/tilted and to orient it before reading.
- **Structure tuned to the real Wall Schedule report**: prompt now describes the Total/Weekly/Sun-Hol hours columns (ignored), employee numbers under names (ignored), per-day hours figures (ignored), and rows that are entirely Request Off (still extracted).
- **Automatic retry**: A failed API call or malformed JSON now retries once automatically with a stricter instruction before showing the failure screen. Auth errors don't retry. JSON embedded in prose is salvaged.
- `max_tokens` raised 2000 → 4096 — large schedules were getting truncated mid-JSON, a hidden failure cause.

### Files
- `index.html` — Main app (v4.1.0)
- `pdp-old-v4_0_0.html` — Archived v4.0.0
- `sw.js` — Service worker (cache v4.1.0)
- `manifest.json` — PWA manifest
- `icon192.png` / `icon512.png` — PWA icons
- `CHANGELOG.md` — This file
- `README.md` — Project readme

---

## [4.0.0] — 2026-06-11

### Changed — Complete Visual Overhaul ("Dawn Market")
- **New design system**: Entire color palette rebuilt — deep pine-black canvas (`#0b110d`), richer elevated surfaces, and a brighter fresh-leaf green accent (`#34c45f`) replacing the old muddy olive. Softer larger corner radii and deeper shadows throughout.
- **New Home dashboard hero**: Time-aware greeting (Good morning / afternoon / evening), date, and three **live stat chips** — Holes left, GEV % done, and employees In Today — each tappable to jump straight to that tab. Subtle ambient sheen animation sweeps the hero (disabled when reduced-motion is on).
- **Produce-hued tiles**: Each Home tile icon now carries its own produce-inspired color — leaf green (Stencil), citrus (Holes), berry (GEV), sky (Schedule), amber (Tools).
- **Tab bar redesign**: Active tab gets a glowing green pill indicator; bar is taller with stronger blur.
- **Result cards & accents**: Claims/result cards now use the new hero gradient with a soft green glow; focus rings, danger tones, and toasts all retuned to the new palette.
- **PWA chrome**: `theme-color` and manifest background/theme colors updated to match the new canvas.

### Added
- **Daily Notes** placeholder tile on Home (Coming Soon) — planned shift handoff & day log.
- **Sales Plan** placeholder tile on Home (Coming Soon) — planned weekly ads, pushes & targets.
- New color tokens: citrus, berry, sky, brand gradient, and glow shadow for future features.

### Files
- `index.html` — Main app (v4.0.0)
- `pdp-old-v3_8_0.html` — Archived v3.8.0
- `sw.js` — Service worker (cache v4.0.0)
- `manifest.json` — PWA manifest (new theme colors)
- `icon192.png` / `icon512.png` — PWA icons
- `CHANGELOG.md` — This file
- `README.md` — Project readme

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
