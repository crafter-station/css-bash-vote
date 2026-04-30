export const ROUND = {
  name: "Color & theming",
  description:
    "light-dark(), color-mix(), relative color syntax, @property typed colors, oklch gradients — the color layer that rewrote itself in CSS 2023–2024.",
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
    id: "04-01-light-dark-card",
    title:
      "Full UI with light-dark(), system colors, and @property color animation",
    expectedFeature: "light-dark",
    expectedKeywords: [
      "light-dark(",
      "color-scheme",
      "color-scheme: light dark",
      "@property",
      "Canvas",
    ],
    prompt: `Build a full-page layout: a top nav bar with three links and a logo, a hero section with headline and two CTA buttons, four feature cards, a testimonials strip, and a footer. Every color must adapt seamlessly to both light and dark OS themes, plus support a manual override toggle.

CRITICAL constraints:
1. Do NOT use @media (prefers-color-scheme) anywhere — that is the old pattern.
2. light-dark() must wrap EVERY color declaration on the page — backgrounds, text, borders, button fills, link colors, card shadows, placeholder text. Each color appears exactly once.
3. color-scheme: light dark must be declared on :root. The toggle sets document.documentElement.style.colorScheme to "light" or "dark" — that single change must flip all colors simultaneously.
4. Structural chrome (page background, card surfaces, input backgrounds) must use CSS system keywords (Canvas, CanvasText, Field, FieldText) inside the light-dark() call rather than hardcoded hex — so forced-colors mode also works.
5. The primary CTA button must have an animated gradient using a @property-registered custom property for the hue shift — the animation must loop in both light and dark modes without JS.
6. The page must have at least 12 distinct semantic color roles (background, surface, text-primary, text-muted, border, brand, brand-hover, link, focus-ring, shadow, badge, icon) — all using light-dark().

Output a single self-contained HTML file with inline <style> and minimal <script> for the toggle only. No external resources.`,
  },
  {
    id: "04-02-color-mix-palette",
    title: "Palette generator with color-mix()",
    expectedFeature: "color-mix",
    expectedKeywords: ["color-mix(", "in "],
    prompt: `Build a self-contained HTML file showing a brand color palette. Start from a single seed color (a vivid teal #0d9488). Display seven swatches: the seed, three progressively lighter tints (mixed with white at 25%, 50%, 75%), and three progressively darker shades (mixed with black at 25%, 50%, 75%). CRITICAL constraints: (1) color-mix() in the oklch color space must generate every tint and shade — no hardcoded hex values for derived colors. (2) The seed color must be defined once in a CSS custom property. (3) No JavaScript. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "04-03-relative-color-syntax",
    title:
      "Adaptive design-token system: single seed → full palette, light-dark, and component states",
    expectedFeature: "relative-color-syntax",
    expectedKeywords: ["oklch(from", "from var(--", "light-dark(", "calc("],
    prompt: `Build a design-token laboratory page from a SINGLE seed color declared as --brand: #2563eb. From that one variable, derive and display ALL tokens below — no other hardcoded color values anywhere.

Derive and label:
- A 9-step lightness scale (L50 through L900): each step modifies oklch lightness by calc(0.95 - (N * 0.09)) from the seed.
- A hover state (10% lighter, same hue), active/pressed state (20% darker, 5% more chroma), and disabled state (50% desaturated, 30% lighter).
- A danger variant: hue-rotated to red territory (oklch hue ≈ 30°), same lightness as seed.
- A surface tint: seed color at 5% opacity blended into white/dark background using relative color syntax — not a fixed rgba().
- A high-contrast text color: derived by pushing oklch lightness to 0.05 in dark mode and 0.95 in light mode.

Derive all token values using only oklch(from var(--brand) calc(...) ...) syntax. The seed is the only source of truth.

CRITICAL constraints:
1. Every single derived color must use relative color syntax — oklch(from var(--brand) ...). No --brand-hover: #1d4ed8 or any sibling hardcoded variable.
2. calc() must compute each lightness/chroma step inside the relative color function — not precomputed literals.
3. All token labels on the page must show the CSS expression that generates them (use CSS content with the value).
4. A live seed picker (a color input) lets the user change --brand, and the entire page repaints via --brand: \${picker.value} on :root — one line of JS only.
5. No JavaScript color math — all computation must be in CSS.

Output a single self-contained HTML file with inline <style> and minimal <script> for the color picker only. No external resources.`,
  },
  {
    id: "04-04-property-color-animation",
    title: "Typed color animation via @property",
    expectedFeature: "registered-custom-properties",
    expectedKeywords: ["@property", "syntax:", "initial-value:"],
    prompt: `Build a self-contained HTML file with a notification badge that continuously animates its background color through a warm-to-cool spectrum: from amber (#f59e0b) through coral (#f97316) to indigo (#6366f1) and back, looping forever. CRITICAL constraints: (1) The background color must be stored in a @property-registered custom property with syntax: "<color>" so the browser interpolates through intermediate colors in each keyframe step. (2) A plain CSS variable must NOT be used — it would snap between values. (3) The animation must loop infinitely with no JavaScript. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "04-05-oklch-gradient",
    title:
      "Color-space gradient laboratory: oklch vs sRGB, hue interpolation modes, and animated hue wheel",
    expectedFeature: "oklch-color",
    expectedKeywords: [
      "oklch(",
      "in oklch",
      "in srgb",
      "hue-interpolation",
      "shorter hue",
    ],
    prompt: `Build a gradient laboratory with four comparison sections and a live interactive demo:

**Section 1 — Space comparison (six strips):** Show the same blue→orange gradient in: sRGB (muddy gray midpoint), sRGB linear, HSL, HWB, oklch shorter-hue, oklch longer-hue. Each strip must be labeled with the interpolation method. The muddy midpoint of sRGB must be visibly obvious against the vivid oklch variants.

**Section 2 — Hue path explorer:** A single hue pair (blue→red) rendered with all four oklch hue-interpolation methods: shorter hue, longer hue, increasing hue, decreasing hue. Label the dominant midpoint hue for each.

**Section 3 — Animated hue wheel:** A square that continuously cycles its background through the full hue wheel using a @property-registered hue variable (syntax: "<angle>"). The animation must loop smoothly at constant perceptual lightness — not cycling through sRGB rainbow which pulses brightness.

**Section 4 — Live builder:** Two oklch color pickers (hue sliders, not native color inputs) that update --stop-a and --stop-b CSS custom properties. A live gradient preview updates reactively. A dropdown selects the hue-interpolation method.

CRITICAL constraints:
1. All gradient strips must use the linear-gradient(in <space> <method>, ...) CSS syntax explicitly.
2. The hue-interpolation keywords (shorter hue, longer hue, increasing hue, decreasing hue) must be spelled out in the CSS — not approximated.
3. The animated hue wheel must use @property with syntax: "<angle>" and initial-value: 0deg — unregistered variables cannot animate angles.
4. The live builder must update a CSS custom property on :root — minimal JS only. No JS color computation.
5. No external libraries.

Output a single self-contained HTML file with inline <style> and minimal <script>. No external resources.`,
  },
  {
    id: "04-06-color-scheme-system",
    title:
      "Hybrid UI: system colors, forced-colors resilience, and side-by-side mode comparison",
    expectedFeature: "color-scheme",
    expectedKeywords: [
      "Canvas",
      "CanvasText",
      "Field",
      "ButtonFace",
      "color-scheme",
      "forced-colors",
    ],
    prompt: `Build a full settings panel that uses system color keywords for all structural chrome and a vivid brand (--brand: #6d28d9 violet) for interactive accents. The panel contains: a text input, a password input, a select, a native checkbox group (3 items), a native radio group (3 options), a range slider, a primary CTA ("Save changes"), and a secondary button ("Cancel").

Show the panel TWICE side-by-side on the same page: once with explicit color-scheme: light and once with color-scheme: dark on each wrapper — so both modes are visible simultaneously without OS-level switching.

CRITICAL constraints:
1. ALL structural colors (page background, panel background, input backgrounds, text, borders, button chrome) must use CSS system keywords (Canvas, CanvasText, Field, FieldText, ButtonFace, ButtonText, GrayText) — no hardcoded hex for any structural color.
2. color-scheme: light dark on :root and explicit color-scheme on each panel wrapper must be the sole mechanisms — no @media (prefers-color-scheme).
3. The primary CTA uses the --brand hardcoded color for background, but its text must use ButtonText. Its hover state must use color-mix(in oklch, var(--brand) 85%, black).
4. Native checkboxes, radios, and range slider must render correctly in both modes via color-scheme + accent-color: var(--brand) — no appearance: none replacements.
5. A @media (forced-colors: active) block must map --brand to Highlight and ensure all interactive elements remain accessible.
6. No appearance: none on any form control.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "04-07-accent-color-uniform",
    title:
      "Comprehensive native-controls dashboard with accent inheritance, container-adaptive layout, and dark mode",
    expectedFeature: "accent-color",
    expectedKeywords: [
      "accent-color",
      "light-dark(",
      "color-scheme",
      "@container",
      "color-mix(",
    ],
    prompt: `Build a dashboard settings panel with: 5 checkboxes, a radio group (4 options), a range slider, a progress element at 72%, a meter element, a search input, and a color input. Five accent presets — "Indigo", "Rose", "Emerald", "Amber", "Cyan" — plus a light/dark toggle.

The panel must also respond to its own container width: when narrower than 560px, the checkbox and radio groups must stack into a single column. When wider, they must show a 2-column layout. Use a @container query for this, NOT a @media query.

CRITICAL constraints:
1. accent-color must be the SOLE tinting mechanism for ALL native controls — no appearance: none, no custom replacements. One rule: accent-color: var(--accent) on the panel — all descendants inherit.
2. Switching accent preset changes ONLY --accent on :root. Per-control overrides are forbidden.
3. Dark mode toggle changes ONLY color-scheme on :root. Native controls adapt automatically — no separate background-color per control.
4. All page and panel colors use light-dark() — each color declared exactly once.
5. The color input must show a tinted border using color-mix(in oklch, var(--accent) 40%, transparent) — no hardcoded border color.
6. The @container layout switch must use container-type: inline-size on the panel wrapper — not a @media breakpoint.
7. Native appearance must be preserved on all controls.

Output a single self-contained HTML file with inline <style> and minimal <script> for toggling only. No external resources.`,
  },
  {
    id: "04-08-currentcolor-inheritance",
    title:
      "Icon system with currentColor inheritance, relative-color tints, and dark-mode adaptation",
    expectedFeature: "currentcolor",
    expectedKeywords: [
      "currentColor",
      "color-mix(",
      "oklch(from",
      "light-dark(",
    ],
    prompt: `Build a navigation sidebar with eight icon+label menu items, each with a unique accent color. Each item has three states — default, hover, active/selected. The icon and label must always share the same color with zero separate per-element color declarations.

Requirements per item:
- Default: muted accent (50% desaturated version of the accent).
- Hover: full accent color + background tint at 12% opacity of the accent.
- Active: full accent color + a 4px filled left-border indicator + background tint at 20% opacity.

The page must also work in light and dark modes (toggle button in the top-right).

CRITICAL constraints:
1. Every SVG icon must use currentColor for BOTH fill (one path) and stroke (another path) — no hardcoded colors in SVG markup.
2. Only one CSS color property may change per state on the parent item — that single change must cascade to both label text AND both SVG paths simultaneously.
3. The hover and active background tints must use color-mix(in oklch, currentColor N%, transparent) — not a hardcoded rgba() or a separate custom property.
4. The muted default state must use oklch(from currentColor l calc(c * 0.5) h) relative color syntax — not a separate hex value.
5. Light and dark modes must use light-dark() on page background and sidebar surface — no @media query duplication.
6. No JavaScript, no per-SVG-element CSS rules.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "04-09-forced-colors-mode",
    title:
      "E-commerce card with full forced-colors resilience, forced-color-adjust opt-outs, and visible simulation",
    expectedFeature: "forced-colors",
    expectedKeywords: [
      "forced-colors: active",
      "CanvasText",
      "ButtonText",
      "forced-color-adjust",
      "Highlight",
    ],
    prompt: `Build a product card with rich custom styling: a gradient hero image placeholder, a "SALE" badge (vivid red), a discount price in green, a five-star rating with yellow stars, a CTA button ("Add to cart"), and a "Wishlist" secondary button. The card must degrade perfectly in forced-colors mode — every element must remain readable and functional.

Show the card FOUR times side-by-side:
1. Normal mode — full vivid custom colors.
2. Forced-colors simulation — second card wrapped in a class that mimics the high-contrast palette by applying Canvas/CanvasText/Highlight/ButtonFace/ButtonText system keywords directly, making the degradation visible without a real OS switch.
3. forced-color-adjust: none opt-out — third card where the badge background uses forced-color-adjust: none and manually sets its background to Highlight — demonstrating when and why to opt out.
4. Dark mode + forced-colors combo — fourth card with explicit color-scheme: dark and the forced-colors simulation class, showing the interaction.

CRITICAL constraints:
1. In normal mode at least 8 distinct non-system colors must be used (gradients, hex, oklch).
2. A @media (forced-colors: active) block must semantically map every custom color to the correct system keyword: Canvas, CanvasText, Highlight, HighlightText, ButtonFace, ButtonText, Mark, MarkText.
3. The SALE badge must use forced-color-adjust: none inside the @media block and manually set background to Highlight and color to HighlightText — not relying on forced-color override.
4. No JavaScript. Use literal system keywords in the forced-colors block (no CSS custom properties there).
5. The star rating SVG icons must use currentColor for fill so they adapt correctly.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "04-10-hwb-color-mixing",
    title: "HWB color space for tinting",
    expectedFeature: "hwb-color",
    expectedKeywords: ["hwb("],
    prompt: `Build a self-contained HTML file with a row of seven swatches showing a single hue (200°, a sky blue) progressively tinted from pure (0% white, 0% black) through increasing whiteness (5 steps to 100% white). A second row shows the same hue going through increasing blackness. CRITICAL constraints: (1) hwb() color function must be used — it directly accepts hue, whiteness, blackness making the progression trivial. (2) No color-mix() or relative color syntax for this challenge — the point is hwb's intuitive tinting model. (3) No JavaScript. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
];
