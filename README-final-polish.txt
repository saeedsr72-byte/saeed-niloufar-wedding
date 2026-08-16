S&N Wedding Invitation — final polish patch

Based on the CURRENT GitHub Pages V6 repository.

Upload these two files to the repository root:
- final-polish.css
- final-fix.js

Then add these two lines immediately BEFORE </head> / </body> as indicated:

Inside <head>, after style.css:
<link rel="stylesheet" href="final-polish.css">

Immediately BEFORE </body>, after script.js:
<script src="final-fix.js"></script>

Important:
- Do NOT delete Ordinary.mp3 or Pol.mp3.
- Do NOT delete fingerprint-seal.png, logo.png, vine-left.svg, vine-right.svg, or lotus.svg.
- Do NOT change the existing RSVP code.
- Do NOT change the existing music code.

What this patch fixes:
1. Small top logo is no longer rendered as a button/card.
2. Hero logo becomes smaller and slightly lower.
3. The fingerprint gate no longer relies on SVG foreignObject, which is the likely cause of the broken/cropped fingerprint seen on mobile.
4. The two fingerprint halves remain the existing fingerprint-seal.png artwork and split with the existing gate animation.
5. Vines start at A FEW MOMENTS rather than revealing from the top of the page, stay close to the edges, and converge toward the closing section.
6. The decorative layer cannot create a phantom empty tail after the page.
