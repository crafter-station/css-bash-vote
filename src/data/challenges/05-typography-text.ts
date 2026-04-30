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
    prompt: `Build a long-form editorial that combines initial-letter, ::first-line styling, and CSS columns: 2 — and stress-tests all three working together.

Layout: a 700px-wide article split into two columns via columns: 2. The article has four paragraphs of 80+ words each. Requirements:

- The very first letter of the entire article must be a 3-line drop cap using initial-letter: 3. It must float correctly inside the first column, with column-spanning text wrapping around it. The drop cap must render in oklch(0.45 0.22 30) (a warm rust) with font-weight: 700.
- The ::first-line of EVERY paragraph (including the one containing the drop cap) must render in small-caps via font-variant-caps: small-caps and a slightly muted hue.
- Both columns must be on-screen simultaneously — no column breaks should split a paragraph mid-sentence.
- A "Magnify" button exists below the article. When it receives :focus-visible, the article must gain a :focus-within state that transitions the initial-letter from 3 lines to 5 lines using interpolate-size: allow-keywords and a CSS transition on the initial-letter property — no layout jump.

CRITICAL constraints:
1. initial-letter: 3 (growing to 5 on :focus-within) must be the drop cap mechanism — no float + font-size hack.
2. ::first-line must drive small-caps — no <span> wrappers.
3. columns: 2 must split the article — no flexbox or grid multi-column trick.
4. interpolate-size: allow-keywords must enable the initial-letter size transition — no JS.
5. No JavaScript at all.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "05-04-text-box-trim",
    title: "Optical alignment with text-box-trim",
    expectedFeature: "text-box-trim",
    expectedKeywords: ["text-box-trim", "text-box-edge"],
    prompt: `Build a button size system that combines text-box-trim + text-box-edge with @container queries — demonstrating that optical centering holds across every container size with zero hardcoded padding adjustments.

Create a single button component used in three container contexts: sm (240px), md (480px), lg (720px). The button auto-sizes its padding and font-size via @container queries using cqi units. In every size, the icon (inline SVG, 1em square) and text label must be optically centered — no descender gap below, no leading gap above.

Show each size as a side-by-side pair: "Default (no trim)" vs "Trimmed" — six buttons total. The Default column must visibly show the gap above/below text caused by line-height. The Trimmed column must eliminate it.

Text-box configuration: text-box-trim: trim-both; text-box-edge: cap alphabetic on the button label span.

Additionally: a fourth "Error state" row shows a button with a red border and error icon. The text-box-trim must hold in the error state — confirm by showing it alongside the normal button at md size.

CRITICAL constraints:
1. text-box-trim: trim-both and text-box-edge: cap alphabetic must be the centering mechanism — no transform: translateY, no negative margin, no line-height: 1 hack.
2. @container queries with cqi units must control button padding and font-size across sm/md/lg — no @media breakpoints for component sizing.
3. container-type: inline-size must wrap each context column.
4. The before/after comparison must be visually unambiguous — both columns must be on screen simultaneously.
5. No JavaScript.

Output a single self-contained HTML file with inline <style>. No external resources.`,
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
    prompt: `Build a color-font animation showcase that combines @font-palette-values, @property-registered color variables, and a morphing palette animation — with a prefers-reduced-motion freeze guard.

Display six large emoji (at least 96px each): 🎉🔥🌈🚀💎🎯. Define a custom palette using @font-palette-values that overrides the emoji's default colors with two registered @property variables: --palette-primary (syntax: '<color>', initial: oklch(0.55 0.22 280)) and --palette-accent (syntax: '<color>', initial: oklch(0.75 0.18 55)). Wire the palette's override-colors to these registered properties.

Animate both properties together over 8s ease-in-out alternate infinite:
- --palette-primary: oklch(0.55 0.22 280) → oklch(0.45 0.25 15) (purple → crimson).
- --palette-accent: oklch(0.75 0.18 55) → oklch(0.85 0.2 95) (gold → lime).

The emoji colors must visibly morph through the full spectrum as the keyframes run — snapping would reveal unregistered variable usage.

A second static row shows the same emoji at their default system palette for contrast.

@media (prefers-reduced-motion: reduce) must freeze both animations at their initial-value state — use animation-play-state: paused, not animation: none.

CRITICAL constraints:
1. @font-palette-values with override-colors must be the palette mechanism — no SVG or canvas fallback.
2. @property with syntax: '<color>' must register both palette variables — unregistered vars cannot interpolate colors in @font-palette-values.
3. The animation must be driven by @keyframes on the registered properties — not filter or hue-rotate.
4. prefers-reduced-motion must freeze (paused), not remove, the animation.
5. No JavaScript.

Output a single self-contained HTML file with inline <style>. No external resources.`,
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
    prompt: `Build a typographic showcase that combines hanging-punctuation: first, text-wrap: pretty, and initial-letter: 2 on the opening paragraph — with a container query that disables hanging-punctuation on narrow containers.

Layout: a two-column editorial page. Left column (450px): three blockquotes, each starting with a curly opening quote mark (“). Right column (350px): the same three blockquotes. On the left column, hanging-punctuation: first must push the quote mark into the left margin so the first word letter aligns with the body text. On the right column, hanging-punctuation is off — showing the misaligned default for direct contrast.

Above both columns: a single intro paragraph with initial-letter: 2 on its first character (2-line drop cap, oklch(0.5 0.2 250) blue, font-weight: 700). The entire article uses text-wrap: pretty so no orphaned single words appear on the last line of any paragraph.

A @container query on each column: when its inline-size drops below 480px, hanging-punctuation must switch off automatically — the small viewport cannot accommodate the visual gap. This must be driven by container-type: inline-size on the column wrapper, not @media.

CRITICAL constraints:
1. hanging-punctuation: first must be the sole margin-alignment mechanism — no negative text-indent, no padding-left adjustment.
2. text-wrap: pretty must prevent orphans — no <br> or soft hyphens.
3. initial-letter: 2 must handle the drop cap — no float + font-size hack.
4. The @container query must disable hanging-punctuation below 480px inline-size — not @media.
5. No JavaScript.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
];
