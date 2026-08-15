S&N WEDDING — SAFE UPDATE
==========================

This package is intentionally a PATCH, not a full rebuild.

Why:
The current GitHub version is already working (language reset, gate, music, countdown,
RSVP, photos, map, and scroll animation). Do NOT replace the whole project with an
older prototype; that is how the page got broken in earlier iterations.

1) Replace the existing `script.js` with the `script.js` in this package.

2) In `index.html`, replace ONLY the current opening `<button id="openInvitation"...>`
   block (the botanical/ornamental SVG block) with the snippet in `gate-replacement.html`.

3) At the bottom of `index.html`, remove this line if it exists:
   <script defer src="https://cdn.jsdelivr.net/npm/counterapi/dist/counter.browser.min.js"></script>

   Keep the normal:
   <script src="script.js"></script>

Nothing else should be changed.

What this update does:
- Restores the opening element to a minimal Tilda-style two-piece organic shape.
- Keeps the proven split/open timing, but makes it slightly slower (2.25 s).
- Keeps the language switch as a full page reset, so the gate always returns.
- Keeps the Persian date as the countdown source of truth.
- Keeps the English display date as exactly: 1 September 2026.
- Keeps the RSVP email flow to Saeed.sr72@gmail.com.
- Fixes `site_total_views`: it now calls CounterAPI directly and writes the returned
  global total into the hidden RSVP field before submission.
- Does NOT touch the existing vine artwork, photos, logo, map, or RSVP layout.
