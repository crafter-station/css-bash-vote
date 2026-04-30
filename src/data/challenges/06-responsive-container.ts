export const ROUND = {
  name: "Responsive & container",
  description:
    "container queries, @scope, style queries, subgrid, fit-content, @layer — the layout layer that made component-scoped responsiveness finally possible in 2023.",
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
    id: "06-01-container-query-card",
    title: "Card layout changes via container query",
    expectedFeature: "container-queries",
    expectedKeywords: ["container-type", "@container"],
    prompt: `Build a self-contained HTML file with a product card component used in two contexts: a narrow sidebar (300px wide) and a wide main area (700px wide). In the narrow context the card must show image above text (stacked). In the wide context the card must show image left with text right (horizontal). CRITICAL constraints: (1) @container queries on the card's container must drive the layout switch — not @media viewport queries. (2) container-type: inline-size must be declared on the card's parent wrapper. (3) The same HTML/CSS card must adapt in both columns without any layout-specific classes. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "06-02-scope-component",
    title: "Component scoped styles with @scope",
    expectedFeature: "scope",
    expectedKeywords: ["@scope", "from ", "to ("],
    prompt: `Build a self-contained HTML file with two comment thread components side by side. One component uses the class "theme-light", the other "theme-dark". Each must have completely isolated link styles (color, underline) that do NOT bleed into the other component or the page. A global link style must be present and must only apply outside both components. CRITICAL constraints: (1) @scope with from/to boundaries must isolate the link styles per component — not specificity hacks or BEM naming. (2) The scope lower boundary (to ()) must exclude nested .avatar elements inside each component. (3) No JavaScript, no shadow DOM. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "06-03-container-style-query",
    title: "Style query switches layout on custom property",
    expectedFeature: "container-style-queries",
    expectedKeywords: ["style(", "@container"],
    prompt: `Build a self-contained HTML file with a list of announcement banners. Each banner has a --variant custom property set inline (--variant: warning, --variant: success, --variant: error). Without adding any class names to child elements, the banner's icon, border color, and background must change per variant. CRITICAL constraints: (1) @container style(--variant: warning) must match the custom property and apply scoped styles — not a class selector. (2) container-type must be declared on the banner so child elements can query it. (3) No JavaScript. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "06-04-subgrid-alignment",
    title: "Card row alignment with subgrid",
    expectedFeature: "subgrid",
    expectedKeywords: ["subgrid", "grid-template-rows"],
    prompt: `Build a self-contained HTML file with a 3-column card grid where each card has: an image area, a title (1–3 lines), a body paragraph (2–6 lines), and a CTA button. All cards in the same row must have their titles, bodies, and buttons aligned horizontally — even when content lengths differ. CRITICAL constraints: (1) subgrid must propagate the parent grid's row tracks into each card so internal elements align across cards. (2) No JavaScript height measurement or uniform min-height hacks. (3) The alignment must hold even for the card with the longest title and the card with the shortest. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "06-05-fit-content-sizing",
    title:
      "Adaptive data table: fit-content() columns, subgrid row alignment, and container-query layout flip",
    expectedFeature: "fit-content",
    expectedKeywords: ["fit-content(", "minmax(", "@container", "subgrid"],
    prompt: `Build a product inventory table with 10 rows and 6 columns: SKU (short, fixed), Product name (medium, variable), Category badge (short), Description (long, variable), Price (short numeric, right-aligned), and Status (badge). Column sizing:

- SKU: min-content width, no wider.
- Category badge: fit-content(120px) — hugs content up to 120px cap.
- Description: fit-content(380px) — fills space up to 380px, then truncates with ellipsis.
- Price: a fixed 80px column, right-aligned digits using font-variant-numeric: tabular-nums.
- Product name: minmax(160px, 1fr) — flexible, minimum 160px.
- Status: min-content.

When the table container is narrower than 640px (via @container), the layout must switch from a flat 6-column grid to a card-based list: each row becomes a card with SKU + Name on top, Category + Status as badges, Description below, Price bottom-right. This is NOT the same as hiding columns — it is a full layout reflow.

When the table container is wider than 960px, use subgrid to align the price column across all rows with perfect decimal-point alignment.

CRITICAL constraints:
1. fit-content() must be used for the Category and Description column tracks — not max-width on cells, not minmax(0, Npx).
2. The @container query must drive the narrow card-layout switch — container-type: inline-size on the wrapper.
3. subgrid must propagate price-column alignment in wide mode.
4. No JavaScript for layout, width calculation, or resize observation. Sorting on header click is the only JS allowed.
5. The font-variant-numeric: tabular-nums must apply to the price column — not a monospace font.

Output a single self-contained HTML file with inline <style> and minimal <script> for sort only. No external resources.`,
  },
  {
    id: "06-06-layer-cascade",
    title:
      "Multi-layer design system with revert-layer, @scope isolation, and live layer inspector",
    expectedFeature: "cascade-layers",
    expectedKeywords: ["@layer", "revert-layer", "@scope", "!important"],
    prompt: `Build a full design system simulation with five cascade layers and a live inspector that reveals which layer is winning for each component. The page shows: a primary button, a secondary button, a danger button, an info/warning/success banner set, a form (text input, select, checkbox), and a card with badge.

Layer architecture:
- @layer reset: browser normalization only.
- @layer base: typography, box-sizing, color primitives.
- @layer components: structural component rules (padding, border-radius, layout).
- @layer theme: brand color overrides (primary = oklch(0.5 0.2 270), secondary = slate, danger = red).
- @layer utilities: single-purpose atomic overrides (always win over named layers).
- Unlayered styles (outside all @layer declarations): must demonstrably beat @layer utilities.

Layer behaviors to demonstrate:
1. revert-layer on the danger button in the theme layer: it must fall back to the components layer's base red, not inherit from base or reset.
2. !important inside a lower-priority layer (reset) must beat a normal declaration in a higher layer (theme) — show this on the card border with a labeled annotation.
3. The info/warning/success banners must be styled using @scope with from/to boundaries so their icon and text colors do not bleed outside the banner component.

A "Layer inspector" panel at the bottom shows a clickable list of the five layers. Clicking a layer name temporarily disables it by adding a data-disable-layer attribute to :root, and a @layer rule inside a :not() rejects it — or simply show a visual diff. One line of JS for the toggle.

CRITICAL constraints:
1. Layer order must be declared at the top: @layer reset, base, components, theme, utilities.
2. revert-layer must be demonstrably used and visibly distinct from inherit or unset.
3. @scope must isolate banner styles within from/to boundaries.
4. No JavaScript for styling — only the layer inspector toggle.

Output a single self-contained HTML file with inline <style> and minimal <script>. No external resources.`,
  },
  {
    id: "06-07-display-mode-media",
    title: "Layout adapts to display-mode (standalone)",
    expectedFeature: "display-mode",
    expectedKeywords: ["display-mode", "standalone"],
    prompt: `Build a self-contained HTML file with an app shell (top nav, content area, bottom tab bar). In browser mode the top nav must show the full URL bar placeholder and the bottom tab bar must be hidden. In standalone PWA mode (@media (display-mode: standalone)) the top nav must shrink to just a title, and the bottom tab bar must appear. CRITICAL constraints: (1) @media (display-mode: standalone) must control the layout switch — no JavaScript navigator.standalone check. (2) The page must visually demonstrate both states simultaneously: include a toggle button that adds a class simulating standalone mode so both layouts are visible in the same browser session. (3) No external resources.`,
  },
  {
    id: "06-08-prefers-reduced-motion",
    title:
      "Accessible motion system: seven animation types, reduced-motion alternatives, and preference override",
    expectedFeature: "prefers-reduced-motion",
    expectedKeywords: [
      "prefers-reduced-motion",
      "reduce",
      "animation-timeline",
      "scroll(",
      "@property",
    ],
    prompt: `Build a full hero page with seven distinct animation types. Each must degrade gracefully for reduced-motion users, with a visually distinct (not identical) non-motion alternative. Label every animation clearly so the judge can verify each degrades correctly.

Animation types:
1. Spinning loader — replace with a pulsing opacity ring (no rotation) in reduced mode.
2. Headline slide-in on load — replace with a simple opacity fade in reduced mode.
3. CTA button continuous bounce — replace with a soft box-shadow glow pulse in reduced mode.
4. @property-animated gradient background (hue cycles via registered angle property) — snap to a static gradient in reduced mode.
5. Scroll-driven parallax image (animation-timeline: scroll()) — remove the parallax translateY, keep the image static in reduced mode.
6. Scroll-triggered card reveal (animation-timeline: view() per card, fade + slide up) — reduce to opacity fade only, no translate in reduced mode.
7. An SVG progress ring that animates its stroke-dashoffset from 0 to 80% on load — reduce to no animation, jump to 80% directly in reduced mode.

Additionally: a "Motion" segmented control with three options ("OS default", "Reduced", "Full") that overrides the OS setting. The OS default uses @media, the override uses a data-motion attribute on <html>.

CRITICAL constraints:
1. @media (prefers-reduced-motion: reduce) is the primary control — no JS animation controller.
2. The data-motion attribute override must have higher specificity than the @media rule in CSS — one JS line to set the attribute.
3. Animations 5 and 6 must use animation-timeline: scroll() and view() respectively — no JS scroll handlers.
4. Animation 4 must use a @property-registered angle variable — unregistered CSS variables cannot interpolate angles.
5. No animation libraries.

Output a single self-contained HTML file with inline <style> and minimal <script> for the preference toggle only. No external resources.`,
  },
  {
    id: "06-09-aspect-ratio-responsive",
    title:
      "Media gallery: aspect-ratio across five contexts, object-fit modes, and scroll-snapping containers",
    expectedFeature: "aspect-ratio",
    expectedKeywords: [
      "aspect-ratio",
      "object-fit",
      "@container",
      "scroll-snap-type",
    ],
    prompt: `Build a responsive media gallery with five distinct section types that each require a different aspect-ratio value AND a different @container breakpoint behavior:

**Section 1 — Video grid (16/9 → 4/3):** Four video placeholders. Wide: 2-column, 16/9 each. Narrow (<560px container): 1-column, switches to 4/3. The aspect ratio change must be driven by @container, not @media.

**Section 2 — Photo mosaic (3/2 → 1/1):** Six image placeholders using object-fit: cover. Wide: 3-column grid, 3/2 ratio. Narrow (<440px): 2-column, 1/1 (square) ratio. Each image must fill its cell without distortion.

**Section 3 — Wide-screen cinema (21/9):** A single cinematic banner with object-fit: cover and object-position: center 30%. Must maintain 21/9 at all container widths above 400px; below 400px switch to 16/9.

**Section 4 — Avatar row (1/1, scroll-snap):** 12 circular avatars in a horizontally scrollable row with scroll-snap-type: x mandatory on the container, scroll-snap-align: center on each avatar. All must stay perfectly square.

**Section 5 — Story cards (9/16):** Four portrait-orientation story cards (like Instagram Stories). Each must maintain 9/16 ratio as container width changes.

CRITICAL constraints:
1. aspect-ratio must be the sizing mechanism for all five sections — the padding-top: 56.25% hack is explicitly forbidden and must be commented out as wrong.
2. @container query (not @media) must drive aspect-ratio switches for sections 1–3 — each section needs container-type: inline-size.
3. object-fit must be set on all image/video placeholders.
4. Section 4's scroll-snap must use scroll-snap-type: x mandatory — no JS carousel.
5. No JavaScript for layout, sizing, or resize observation.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "06-10-color-gamut-hdr",
    title: "Wide-gamut color with @media (color-gamut)",
    expectedFeature: "color-gamut",
    expectedKeywords: ["color-gamut", "p3"],
    prompt: `Build a self-contained HTML file with two gradient swatches side by side: one labeled "sRGB" using standard hex colors, one labeled "P3 wide-gamut" using more vivid equivalents. On displays that support Display P3 (most modern MacBooks and iPhones), the P3 swatch must appear noticeably more vivid. On sRGB-only displays, both must look similar. CRITICAL constraints: (1) @media (color-gamut: p3) must conditionally apply the P3 color values using color(display-p3 ...) syntax. (2) The sRGB swatch must use a standard oklch or hex gradient as the base. (3) No JavaScript. Include a label on each swatch showing which gamut is active. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
];
