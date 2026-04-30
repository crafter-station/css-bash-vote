export const ROUND = {
  name: "Typography & text",
  description:
    "text-wrap balance/pretty, initial-letter, text-box trim, line-clamp, ::first-line — the typographic layer that finally became controllable in CSS 2023–2024.",
};

export interface Challenge {
  id: string;
  title: string;
  expectedFeature: string;
  expectedKeywords: string[];
  prompt: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "05-01-text-wrap-balance",
    title:
      "Typography control center: balance vs pretty, scroll-driven width morph, and live toggle",
    expectedFeature: "text-wrap-balance",
    expectedKeywords: [
      "text-wrap: balance",
      "text-wrap: pretty",
      "animation-timeline",
      "scroll(",
    ],
    prompt: `Build a typography laboratory that demonstrates both text-wrap: balance and text-wrap: pretty with rigorous visual proof at multiple widths, plus a live interactive comparison.

**Section 1 — Headline grid (text-wrap: balance):** Show 4 headlines of different lengths in three container widths: 260px, 400px, 580px. For EACH headline at EACH width show side-by-side: "Default" vs "Balanced". The orphan/balanced difference must be visually obvious — use a real headline like "Why distributed systems knowledge matters for every product designer".

**Section 2 — Body text (text-wrap: pretty):** A 5-paragraph article in a 440px column. Every paragraph shown twice side-by-side: "Default" vs "Pretty". The last line of the default version must have a dangling single word. The pretty version must not.

**Section 3 — Live slider:** A range input (280px–720px) that changes the article container width. A scroll-driven progress bar above the slider shows the current position via animation-timeline: scroll() on the range container — no JS reading the value. The headline rebalances and the body rewraps continuously as the user drags.

CRITICAL constraints:
1. text-wrap: balance is the ONLY mechanism preventing orphan headlines — no <br>, no word-spacing, no max-width per headline.
2. text-wrap: pretty is the ONLY mechanism preventing body orphans — no soft hyphens, no zero-width joiners.
3. The slider updates a --col-width CSS custom property on the article — one line of JS for the input event only.
4. No JavaScript may adjust text layout.
5. The scroll-driven progress bar must use animation-timeline: scroll() — no JS scroll listener.

Output a single self-contained HTML file with inline <style> and minimal <script>. No external resources.`,
  },
  {
    id: "05-02-text-wrap-pretty",
    title:
      "Multi-author editorial with text-wrap: pretty, contrast toggle, and per-author column widths",
    expectedFeature: "text-wrap-pretty",
    expectedKeywords: [
      "text-wrap: pretty",
      "text-wrap: balance",
      ":has(",
      "container-type",
    ],
    prompt: `Build a magazine-style editorial page with three distinct author columns, each 220px–480px wide, set inside a CSS multi-column layout. Each column contains an author byline, a headline, and 3-4 paragraphs.

The layout rules:
- All headlines use text-wrap: balance.
- All body paragraphs use text-wrap: pretty.
- Columns narrow and widen reactively as the user resizes the browser window — text re-wraps and text-wrap rules must continuously apply.
- A "Show orphans" toggle at the top adds a class that disables both text-wrap properties simultaneously, making orphans reappear. The toggle must work by flipping a single class on a container element.

Additionally: each author column is a named CSS container. When a column is narrower than 300px, its headline must switch from text-wrap: balance to text-wrap: wrap to avoid over-compression — driven by a @container query on the column, not by a @media viewport query.

CRITICAL constraints:
1. text-wrap: pretty is the ONLY orphan-prevention mechanism for body paragraphs — no <br>, no soft hyphens, no zero-width joiners, no word-spacing adjustments.
2. text-wrap: balance is the ONLY headline mechanism — no fixed max-widths on headlines.
3. The per-column container switch must use @container (max-inline-size: 300px) — not @media.
4. The toggle must add/remove a single class that disables both text-wrap properties — one JS event listener.
5. No JavaScript may measure or adjust text layout.

Output a single self-contained HTML file with inline <style> and minimal <script>. No external resources.`,
  },
  {
    id: "05-03-initial-letter-drop-cap",
    title: "Drop cap with initial-letter",
    expectedFeature: "initial-letter",
    expectedKeywords: ["initial-letter"],
    prompt: `Build a self-contained HTML file with a long-form article section (3 paragraphs). The very first letter of the first paragraph must be a three-line drop cap — large, typographically raised, with surrounding text wrapping around it naturally. CRITICAL constraints: (1) initial-letter: 3 must be the mechanism — no manual font-size + float + negative margin hack. (2) The drop cap must be styled differently from body text (different color and/or font weight). (3) No JavaScript. The drop cap must not affect subsequent paragraphs. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "05-04-text-box-trim",
    title: "Optical alignment with text-box-trim",
    expectedFeature: "text-box-trim",
    expectedKeywords: ["text-box-trim", "text-box-edge"],
    prompt: `Build a self-contained HTML file with a button row where each button contains both an icon (inline SVG) and a text label. The text and icon must be perfectly optically centered — no top/bottom spacing differences caused by line-height or descenders. CRITICAL constraints: (1) text-box-trim: trim-both with text-box-edge: cap alphabetic must be used on the button text to eliminate leading/trailing whitespace from the text box. (2) No negative margin hacks or transform: translateY adjustments. (3) The alignment must be demonstrably better than the default: show the buttons in a "default" row and a "trimmed" row for comparison. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "05-05-first-line-styled",
    title:
      "Typeset newspaper: ::first-line small-caps, ::first-letter drop cap, and responsive column count",
    expectedFeature: "first-line",
    expectedKeywords: [
      "::first-line",
      "::first-letter",
      "font-variant-caps",
      "columns",
      "hanging-punctuation",
    ],
    prompt: `Build a newspaper-style editorial layout with a CSS multi-column article body. Design rules:

- The article's very first character must be a four-line drop cap in a distinct serif font (Georgia or Times) with an accent color — ::first-letter on the first paragraph only.
- The first physical line of EVERY paragraph must render in small-caps (font-variant-caps: small-caps) with a slightly warmer color — ::first-line on all <p> tags.
- The drop cap and the ::first-line small-caps must coexist correctly on the same first paragraph — they must not visually conflict.
- The column count must be fluid: 1 column below 480px, 2 columns 480px–800px, 3 columns above 800px — all via CSS columns property (not flexbox/grid columns).
- Any paragraph that starts with an opening quotation mark must have it hanging into the left margin via hanging-punctuation: first — not a negative text-indent hack.
- Pull quotes (styled <blockquote> elements) embedded between paragraphs must NOT receive the ::first-line small-caps treatment — use a :not(blockquote) selector to exclude them.

CRITICAL constraints:
1. ::first-line must be the sole small-caps mechanism — no <span> wrapping words, no JavaScript.
2. ::first-letter must handle the drop cap — no manually wrapped float span.
3. The column count must use CSS columns — not grid or flexbox column tricks.
4. No additional HTML markup may be added to paragraphs for styling purposes.
5. hanging-punctuation: first must apply to opening quote marks — not a text-indent trick.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "05-06-font-palette",
    title: "Recolor emoji font via font-palette",
    expectedFeature: "font-palette",
    expectedKeywords: ["font-palette", "@font-palette-values"],
    prompt: `Build a self-contained HTML file displaying six large emoji (🎉🔥🌈🚀💎🎯) with a custom color palette applied — the emoji must render in a duotone purple-and-gold palette rather than their default colors. CRITICAL constraints: (1) @font-palette-values must define the custom palette with override-colors. (2) font-palette must reference the defined palette on the element. (3) No SVG or canvas fallback — this must use the CSS font-palette system. Note: this feature requires a color font (COLRv1/v0); use the system emoji font by referencing it explicitly if needed. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "05-07-highlight-pseudo",
    title:
      "Four-zone highlight system: ::selection, ::highlight(), grammar marks, and active reading mode",
    expectedFeature: "selection-pseudo",
    expectedKeywords: [
      "::selection",
      "::highlight(",
      "CSS.highlights",
      "::spelling-error",
    ],
    prompt: `Build a long-form reading view with four distinct highlight zones that must coexist without interfering:

**Zone 1 — User selection:** User text selection shows amber (#f59e0b) background with black text via ::selection. Code blocks use a separate ::selection rule: green (#22c55e) background, white text.

**Zone 2 — Search highlights:** A search input at the top highlights all matching text across the article in vivid pink (#f472b6) using the CSS Custom Highlight API (CSS.highlights.set() with a custom Highlight object and @::highlight(search-results) CSS rule). Clearing the input removes all highlights.

**Zone 3 — "Reading mode" highlights:** A "Mark key terms" toggle button highlights a predefined list of technical terms (e.g. "CSS", "cascade", "specificity") in a soft blue (#bfdbfe) using a second named CSS custom highlight — @::highlight(key-terms) — without modifying the HTML.

**Zone 4 — Error simulation:** Any word manually flagged in the JS must receive a wavy red underline using a third highlight object mapped to @::highlight(spelling-errors) with text-decoration-color: red.

CRITICAL constraints:
1. ::selection handles zone 1 — no JS drag events.
2. Zones 2, 3, and 4 each use CSS.highlights.set() with distinct named highlight objects and distinct @::highlight() CSS rules.
3. All four zones must coexist — toggling search, key-terms, or spelling highlights must not erase the others.
4. No innerHTML manipulation or <mark> injection for any zone — the DOM must not be mutated for highlighting.
5. No third-party libraries.

Output a single self-contained HTML file with inline <style> and minimal <script>. No external resources.`,
  },
  {
    id: "05-08-line-clamp",
    title:
      "News feed with adaptive line-clamp, smooth expand, per-card clamp depth, and scroll-driven reveal",
    expectedFeature: "line-clamp",
    expectedKeywords: [
      "-webkit-line-clamp",
      "line-clamp",
      ":has(",
      "interpolate-size",
      "animation-timeline",
    ],
    prompt: `Build a news feed of seven article cards with these requirements:

- Cards 1-2: short excerpts (< 3 lines) — must NOT show an ellipsis or an expand button.
- Cards 3-4: medium excerpts (4-5 lines) — clamped at 3 lines when collapsed.
- Cards 5-6: long excerpts (8-10 lines) — clamped at 3 lines when collapsed.
- Card 7: very long excerpt (15+ lines) — clamped at 5 lines when collapsed (a different clamp depth).

Each card with clamped text shows an "Expand" button. Clicking expands to full text with a smooth height animation. A second click collapses back with animation.

As the user scrolls, each card fades in using scroll-driven animation — no JS IntersectionObserver.

CRITICAL constraints:
1. -webkit-line-clamp (or line-clamp) must be the clamping mechanism — not overflow: hidden with a fixed pixel height.
2. Cards 1-2 must hide the expand button using :has() to detect that the content does NOT overflow — no JavaScript measuring line count.
3. The expand height animation must use interpolate-size: allow-keywords and height: auto — not max-height: 9999px.
4. Card 7's different clamp depth (5 lines) must use a data attribute or class that sets a separate -webkit-line-clamp value via CSS — not a separate JS branch.
5. The scroll-driven card reveal must use animation-timeline: view() on each card — no JS.
6. The only JS allowed: toggling a class on card click to disable/enable the clamp.

Output a single self-contained HTML file with inline <style> and minimal <script> for toggle only. No external resources.`,
  },
  {
    id: "05-09-font-variant-numeric",
    title:
      "Financial dashboard with stacked numeric variants, live sort, and dark-mode adaptation",
    expectedFeature: "font-variant-numeric",
    expectedKeywords: [
      "font-variant-numeric",
      "tabular-nums",
      "ordinal",
      "diagonal-fractions",
      "lining-nums",
    ],
    prompt: `Build a financial dashboard with four distinct numeric display zones, each requiring a different combination of font-variant-numeric values:

**Zone 1 — Live price table:** 8 stocks, 6 days of OHLC price data. Digit alignment is critical — decimal points must align in every column for all 8 rows. A "Tabular ↔ Proportional" toggle must make the alignment difference strikingly obvious. Positive deltas green, negative red — using color-mix(in oklch, ...) relative to a neutral.

**Zone 2 — Leaderboard with ordinals:** 10 ranked entries. Rank numbers must use font-variant-numeric: ordinal to render "st", "nd", "rd", "th" at correct OpenType scale — not font-size: 0.6em sup hacks. The leaderboard must be sortable (JS click on column header — the only JS on the page besides the zone 1 toggle).

**Zone 3 — Fractional shares:** 8 holdings showing fractional amounts like 3/4, 5/16, 7/8. Fractions must render as diagonal-fractions. The slash between numerator and denominator must be the Unicode fraction slash (U+2044), not a regular forward slash, for proper OpenType fraction rendering.

**Zone 4 — Historical P&L (lining vs oldstyle):** Show the same set of yearly figures in two side-by-side columns — one using lining-nums (uniform cap height) and one using oldstyle-nums (ascending/descending digits). The visual difference must be obvious.

CRITICAL constraints:
1. font-variant-numeric must be used with four distinct values: tabular-nums, ordinal, diagonal-fractions, lining-nums + oldstyle-nums — one per zone.
2. Do NOT use a monospace font to fake tabular alignment.
3. Use the system font stack for all zones — no external font.
4. Zone 1 toggle and Zone 2 sort are the only JS allowed.

Output a single self-contained HTML file with inline <style> and minimal <script>. No external resources.`,
  },
  {
    id: "05-10-hanging-punctuation",
    title: "Optical margin alignment with hanging-punctuation",
    expectedFeature: "hanging-punctuation",
    expectedKeywords: ["hanging-punctuation"],
    prompt: `Build a self-contained HTML file with a pull-quote section containing three blockquotes, each starting with an opening quotation mark. The opening quote marks must hang into the left margin so the first letter of the text aligns with the body column — not indented by the quote mark's width. CRITICAL constraints: (1) hanging-punctuation: first must be the mechanism — no negative text-indent hack. (2) No JavaScript. (3) The hanging effect must be visible: show one blockquote WITHOUT hanging-punctuation and one WITH it side by side for contrast. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
];
