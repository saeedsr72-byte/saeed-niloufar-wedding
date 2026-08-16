S&N WEDDING INVITATION — V7 POLISH PATCH

BASE:
This patch is designed specifically for SN-Wedding-RECOVERED-V6-STABLE + the existing final-polish/final-fix layer.
It is additive and does not replace the working RSVP, language, countdown or audio system.

UPLOAD / REPLACE:
1. Replace final-polish.css with the supplied final-polish.css.
2. Replace final-fix.js with the supplied final-fix.js.
3. Add lotus-real-transparent.png to the repository root.

DO NOT DELETE:
Ordinary.mp3
Pol.mp3
fingerprint-seal.png
logo.png
vine-left.svg
vine-right.svg
lotus.svg

WHAT V7 CHANGES:
- Small floating logo is completely transparent and no longer resembles a button/card.
- Hero logo is only slightly smaller/lower; composition is otherwise untouched.
- Fingerprint gate uses the complete fingerprint-seal.png artwork and splits the actual image into two halves.
- No SVG foreignObject is used for the fingerprint, avoiding the mobile cropping/rendering problem.
- Fingerprint split is deliberately slow (2.55s) and keeps the original artwork unchanged.
- Existing botanical ornament remains around the fingerprint and fades after the split.
- Vines use the supplied illustrated SVG assets, become much smaller/lighter, start at A FEW MOMENTS, and reveal downward with scroll.
- The wide SVG viewBox lets the two vines naturally travel inward toward each other near the end instead of remaining stuck to the edges.
- The merge glow is removed; no CSS-drawn vine/flower is used.
- The final flower is a real lotus PNG with its white background removed, appearing only at the end of the vine scene.
- Vine scene ends shortly after the final gallery image, so it cannot create a giant empty scroll tail.

IMPORTANT:
Do not modify index.html or script.js for this patch.
Do not touch the RSVP code.
Do not touch the music files.

TEST ORDER:
1. Open Persian version.
2. Tap fingerprint once: both halves should leave slowly and cleanly.
3. Check English version separately.
4. Check small logo: no box/background/border.
5. Scroll to A FEW MOMENTS: vines should begin there, not above it.
6. Continue through the three gallery images: vines should travel down from both edges.
7. After the last image they should approach the center and the real lotus should appear.
8. Continue scrolling: there should be no large decorative/blank tail added by the vines.
9. Test RSVP submission.
10. Test both music tracks.
