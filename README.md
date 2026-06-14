# PDP — Produce Department Portal

So here's the thing: I work in a produce department, not a software company. I didn't set out to "build an app." I set out to stop rewriting the same pull list on a crumpled piece of paper every morning. One thing led to another, and now my phone runs the whole department.

This is that app.

## What it actually does

- **Holes / Load List** — Walk the floor, tap what's empty, and get a clean pull list. Snapshot whatever's still unchecked into an **Inventory Check** so order adjustments don't live in my head.
- **Stencil** — An 816-item master log (item codes, pack sizes, units) built by photographing every price stencil in the back room. Searchable in two keystrokes, editable when the warehouse changes things on us.
- **Schedule** — Point the camera at the printed wall schedule and AI reads the whole grid: every employee, every shift, with net hours calculated after meal breaks. The thing reads a schedule better than I do at 6 AM.
- **GEV Lists** — Scannable, checkable variety lists. Tap to cross off, keep multiple named lists.
- **Documents** — A section for department paperwork, split into **Daily Notes** and **Sales Plan** (Plan-O-Gram coming soon). Scan the printed sheets front-to-back and AI rebuilds them digitally — every block, bullet, and table reproduced cell-for-cell. Each section keeps the last two weeks, with a dropdown to flip between dates, the original photo kept alongside, full edit mode, and one-tap copy of the text or the picture.
- **Tools** — Notes, date/time reminders, and a claims calculator, because pockets only hold so many sticky notes.

## How a produce guy ended up here

The honest version: I started with a single HTML file and a lot of questions. No frameworks, no build tools, no backend — partly because I didn't know them, mostly because I didn't need them. The whole app is **one HTML file**, plain CSS and JavaScript, with everything saved to localStorage right on the phone. It installs as a PWA from GitHub Pages and works offline in the back room where the signal goes to die.

The fanciest part is the scanner: photos go to Claude's vision API (you bring your own API key, it never leaves your device) and come back as structured data. Watching it correctly read a coffee-stained schedule grid for the first time was genuinely one of the cooler moments of this whole adventure.

## Lessons collected along the way (the hard way)

- Mobile browsers treat `.onclick` like a suggestion. `addEventListener` or nothing.
- iOS will let you *ask* for notification permission only when a human finger is involved. Ask at render time and your whole view silently dies. (v3.7.0 learned this one personally.)
- GitHub Pages subdirectories will eat your PWA icons unless every path is relative.
- Two hidden file inputs on mobile = chaos. One input with a toggled `capture` attribute = peace.
- After changing icons or the manifest, re-add the PWA to your home screen. Yes, again.

## Running it

It's hosted on GitHub Pages — open it, tap "Add to Home Screen," done. To deploy a new version: replace the files, bump the service worker cache name, and re-add the PWA. Old versions are archived in the repo as `pdp-old-v{version}.html` because trust takes years to build and one bad deploy to lose.

Every change is logged in [CHANGELOG.md](CHANGELOG.md). Currently at **v4.8.0**.

---

*Built one shift at a time, for Store 2606's produce crew.*
