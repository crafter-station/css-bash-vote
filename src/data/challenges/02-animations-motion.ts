export const ROUND = {
  name: "Animations & motion",
  description:
    "scroll-driven animations, view-transitions, interpolate-size, @starting-style — the motion primitives that shipped in Chromium 115–125 that old training data consistently skips.",
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
    id: "02-01-scroll-progress-bar",
    title: "Chapter-aware reading tracker with per-section scroll progress",
    expectedFeature: "scroll-driven-animations",
    expectedKeywords: [
      "animation-timeline",
      "view(",
      "scroll(",
      "animation-range",
    ],
    prompt: `Build a self-contained HTML file with a long article split into five named chapters (each 300+ words of lorem text). Three coordinated indicators must all update without any JavaScript:

1. A fixed top progress bar that fills 0→100% across the full document scroll — driven by animation-timeline: scroll() on the document.
2. A floating chapter counter (top-right, sticky) showing a colored dot per chapter. As each chapter enters view, its dot fills — driven by animation-timeline: view() on each chapter element.
3. A per-chapter thin colored bar at the left edge of each chapter that grows from 0→100% height as that chapter scrolls through the viewport.

All three indicators must update simultaneously and in sync as the user scrolls.

CRITICAL constraints:
1. No JavaScript of any kind — no scroll listeners, no IntersectionObserver, no requestAnimationFrame.
2. The top progress bar must use animation-timeline: scroll() scoped to the root.
3. Each chapter's left-edge bar must use animation-timeline: view() on the chapter element — not a fixed percentage.
4. animation-range: entry 0% cover 100% must be set on each chapter bar so it grows precisely as the chapter traverses the viewport.
5. Do NOT use a single shared keyframe for all bars — each chapter must use its own color (use 5 distinct hues).
6. The floating dots must use animation-timeline: view() with animation-range: entry 50% exit 50% so they fill at the midpoint of each chapter.

The agent that understands both scroll() for document-level progress AND view() for element-level entry/exit will solve all three indicators. Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "02-02-list-to-grid-view-transition",
    title: "View-transition between list and grid",
    expectedFeature: "view-transitions",
    expectedKeywords: ["view-transition-name", "::view-transition"],
    prompt: `Build a self-contained HTML file with eight product cards and a toggle button labeled "Grid / List". Clicking the button switches between a single-column list layout and a 3-column grid. The transition must be a smooth animated morph — cards should visibly glide to their new positions. CRITICAL constraints: (1) The animation must use the View Transitions API (document.startViewTransition). (2) Each card must have a unique view-transition-name so the browser can match them individually during the transition. (3) No CSS keyframe animation may be placed directly on the cards — let the browser interpolate via ::view-transition-old and ::view-transition-new. The HTML file must be self-contained with inline <style> and minimal <script> only for toggling class + startViewTransition. No external resources.`,
  },
  {
    id: "02-03-interpolate-size-accordion",
    title:
      "Accordion with auto-height transition, nested images, and staggered timing",
    expectedFeature: "interpolate-size",
    expectedKeywords: [
      "interpolate-size",
      "allow-keywords",
      "lh",
      "transition",
    ],
    prompt: `Build a FAQ accordion with four items of deliberately heterogeneous content to stress-test auto-height transitions:

- Item 1 (short): two sentences + one inline badge.
- Item 2 (tall): a paragraph + a 200px placeholder image + a bullet list of 6 items.
- Item 3 (medium): three paragraphs of text.
- Item 4 (dynamic): a textarea where the user can type — the panel must grow and shrink as content is typed, with the height remaining at "auto" relative to the textarea.

Clicking a header toggles that item open/closed with a smooth height animation. Items are independent — two can be open simultaneously.

CRITICAL constraints:
1. No hardcoded pixel heights anywhere. The animation must stop exactly at the content's natural height, whatever it is.
2. Do NOT use max-height: 9999px or any fixed cap. That produces wrong easing and is immediately detectable.
3. interpolate-size: allow-keywords must be the mechanism that enables height: 0 → height: auto CSS transitions.
4. No JavaScript may read offsetHeight, scrollHeight, or any layout property. The only JS allowed is toggling a single [open] attribute or boolean class.
5. Each item must have a distinct transition-duration using lh-relative or ms values (200ms, 300ms, 400ms, 500ms) — the different speeds must be visibly obvious.
6. The textarea in item 4 must use field-sizing: content so it also grows without JS.

Output a single self-contained HTML file with inline <style> and minimal <script> for attribute toggling only. No external resources.`,
  },
  {
    id: "02-04-starting-style-enter",
    title:
      "Live notification tray with enter/exit CSS transitions and badge counter",
    expectedFeature: "starting-style",
    expectedKeywords: [
      "@starting-style",
      "transition-behavior",
      "allow-discrete",
      "overlay",
    ],
    prompt: `Build a live notification tray in the bottom-right corner of the page. Two buttons at the top: "Fire notification" and "Dismiss oldest". Each notification card shows an icon, title, and timestamp.

Firing a notification appends a new card that must animate in from the right (translateX(120%) → translateX(0)) and fade in (opacity 0→1). Dismissing removes the oldest card which must animate out to the right (translateX(0) → translateX(120%)) and fade out before disappearing from layout flow — the remaining cards must smoothly close the gap left behind (layout reflow must be animated).

A badge counter above the tray shows the live count. It must update without JavaScript reading the DOM — use CSS counter() on the list.

CRITICAL constraints:
1. The enter animation must use @starting-style to define the pre-insertion translateX and opacity — no setTimeout delay, no class added after insertion.
2. The exit animation must use transition-behavior: allow-discrete on both the display property and overlay property so the card visually completes its slide before collapsing from layout.
3. The remaining cards closing the gap must use a CSS transition on the layout (not a JS loop measuring heights).
4. No JavaScript may set inline styles, call .animate(), or manage animation classes. Only appending/removing DOM nodes is allowed.
5. The enter and exit directions must be opposite (enter from right, exit to right) — if both animate the same direction the solution is wrong.
6. CSS counter() must maintain the notification count on a ::before pseudo-element on the list.

Output a single self-contained HTML file with inline <style> and minimal <script> for DOM append/remove only. No external resources.`,
  },
  {
    id: "02-05-animation-composition",
    title: "Layered animations via animation-composition",
    expectedFeature: "animation-composition",
    expectedKeywords: ["animation-composition", "add"],
    prompt: `Build a layered animation card that combines animation-composition: add, a scroll-driven scale via view-timeline, and a hover-driven hue-rotate transition — all three compositing on the same element simultaneously without any layer overriding another.

The element: a 200px square card with an abstract gradient (oklch 270deg → 30deg). Three animation layers:

1. Continuous base rotation: a @keyframes spin (0deg → 360deg) running at 8s linear infinite, always active.
2. Scroll-driven scale: a @keyframes grow (scale(1) → scale(1.4)) on animation-timeline: view() with animation-range: entry 20% cover 60%. As the card enters the viewport it grows. animation-composition: add must stack this on top of the rotation.
3. Hover hue-rotate: a CSS transition on filter: hue-rotate() from 0deg to 120deg on :hover (duration 400ms ease-out cubic-bezier(0.25, 0.1, 0.25, 1)). Must compose with the other two layers — hovering mid-scroll must combine all three effects visually.

@media (prefers-reduced-motion: reduce) must freeze only the scroll-driven layer (animation-play-state: paused on the view-timeline animation) — the rotation and hover transition must remain active, just without the scroll-linked scale.

CRITICAL constraints:
1. animation-composition: add must appear on both the scroll-driven and hover animations — replace is the wrong value.
2. All three effects must compose visually when triggered together — not snap or override.
3. animation-timeline: view() must drive the scale — no JS IntersectionObserver or scroll listener.
4. prefers-reduced-motion must pause only the scroll-driven layer, not all animations.
5. No JavaScript.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "02-06-animation-range-scrub",
    title: "Scroll-scrubbed element reveal",
    expectedFeature: "scroll-driven-animations",
    expectedKeywords: ["animation-range", "view()"],
    prompt: `Build a self-contained HTML file with six content cards stacked vertically so each is taller than the viewport. As the user scrolls, each card must fade in (opacity 0→1) and slide up (translateY 40px→0) exactly as it enters the viewport, and reverse when it exits. CRITICAL constraints: (1) No JavaScript — no IntersectionObserver, no scroll listener. (2) animation-timeline: view() must drive each card's animation. (3) animation-range must be set to entry 0% entry 100% so the effect is tied precisely to the element entering and leaving the viewport. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "02-07-transition-behavior-discrete",
    title:
      "Command palette with layered popover transitions and anchored positioning",
    expectedFeature: "transition-behavior",
    expectedKeywords: [
      "transition-behavior",
      "allow-discrete",
      "@starting-style",
      "overlay",
      "anchor(",
    ],
    prompt: `Build a command palette triggered by a "Search commands" button. The palette is a floating overlay panel (not a modal, page remains interactive behind it) anchored below the button using CSS anchor positioning. The palette contains a text input and a list of 8 command items. Clicking a command closes the palette and shows the selected command in a status bar.

Two layers must animate independently:
1. A full-page scrim (semi-transparent dark overlay) fades in/out.
2. The palette panel slides up from 16px below its final position and fades in on open; reverses on close.

Both layers start as display: none when closed. Both must animate rather than snap.

CRITICAL constraints:
1. transition-behavior: allow-discrete must be set on both the scrim AND the panel's display property — they must animate from display: none, not just from opacity: 0.
2. @starting-style must define the pre-display state for both layers — no JS adds a class after insertion or uses setTimeout.
3. The panel must use anchor-name on the button and anchor() for its position — not JS getBoundingClientRect.
4. The scrim and panel exit animations must complete before layout collapses — confirm by observing the animation, not snapping.
5. No JavaScript may call .animate(), set inline styles, or manage animation/transition classes. Only toggling a [open] boolean attribute or equivalent is allowed.
6. The panel must use display: none (not visibility: hidden) in its closed state — so transition-behavior: allow-discrete is genuinely required.

Output a single self-contained HTML file with inline <style> and minimal <script> for the open/close toggle and command click only. No external resources.`,
  },
  {
    id: "02-08-property-color-animation",
    title: "Color tween via @property + @starting-style + view-transitions",
    expectedFeature: "registered-custom-properties",
    expectedKeywords: ["@property", "syntax:", "initial-value:", "@starting-style", "startViewTransition"],
    prompt: `Build a button that triggers a view-transition on click, where the new state's background color animates from its @property initial-value into the target color — interpolation is only possible because @property registers the type.

Single button labeled "Activate". It has two states: inactive (background: --btn-color at oklch(0.45 0.05 250), a muted slate) and active (--btn-color at oklch(0.55 0.22 270), vivid indigo). Clicking toggles the active class via document.startViewTransition.

@property registration:
- --btn-color: syntax '<color>', inherits: false, initial-value: oklch(0.45 0.05 250).

Inside ::view-transition-new, an @starting-style block sets --btn-color to its initial-value so the browser can tween from muted → vivid as the new state enters. The transition duration must be 600ms ease-in-out. Without @property + @starting-style, the color would snap.

Additionally: the button text must change from "Activate" to "Deactivate" via content in the ::view-transition-new pseudo-element — demonstrating that view-transition captures the layout state, not just the background.

CRITICAL constraints:
1. @property with syntax: '<color>' and initial-value must register --btn-color — unregistered vars cannot interpolate across view-transitions.
2. @starting-style inside ::view-transition-new must set the from-color — no JS sets inline styles or runs setTimeout to stage the animation.
3. document.startViewTransition is the only JS allowed — the entire color animation must be CSS-driven.
4. The transition must be visibly smooth through intermediate oklch colors — not a cross-fade snap.
5. No animation libraries, no Web Animations API.

Output a single self-contained HTML file with inline <style> and minimal <script> for startViewTransition only. No external resources.`,
  },
  {
    id: "02-09-scroll-snap-carousel",
    title:
      "Scroll-snap testimonial carousel with view()-driven progress and auto-play toggle",
    expectedFeature: "scroll-snap",
    expectedKeywords: [
      "scroll-snap-type",
      "scroll-snap-align",
      "animation-timeline",
      "view(",
      "scroll(",
    ],
    prompt: `Build a testimonial carousel with eight slides. Each slide has a 120×120px circular avatar placeholder, a quote (2-3 sentences), and a name + company. Below the carousel: eight dot indicators that animate to filled as each slide enters the viewport. A progress bar above the carousel fills proportionally to overall carousel scroll.

CRITICAL constraints:
1. scroll-snap-type: x mandatory on the carousel container and scroll-snap-align: center on each slide must drive snapping. No JS position tracking.
2. Each dot must animate from hollow to filled using animation-timeline: view() scoped to the carousel element — not a JS currentIndex variable.
3. The top progress bar must use animation-timeline: scroll() scoped to the carousel container (not the document) — not a JS scroll handler.
4. Prev/next arrow buttons may use scrollBy() only — that is the only JS allowed for navigation. No JS may read scrollLeft, compute indices, or set active classes.
5. An "Auto-play" toggle button must start/stop auto-advance via CSS animation-play-state on a hidden ticker element — the ticker uses @keyframes to nudge scrollLeft, not a setInterval. If this auto-play pattern is too complex without JS, implement it with a CSS-only animation on scroll-left using animation-play-state controlled by the button toggling a class — and document that setInterval is explicitly forbidden.
6. Each slide must have a distinct accent color (border or background) to make the snap position visually clear.

Output a single self-contained HTML file with inline <style> and minimal <script> for scrollBy() and the play/pause toggle only. No external resources.`,
  },
  {
    id: "02-10-view-transition-shared-element",
    title: "Shared-element hero expand via view-transition",
    expectedFeature: "view-transitions",
    expectedKeywords: [
      "view-transition-name",
      "::view-transition-old",
      "::view-transition-new",
    ],
    prompt: `Build a self-contained HTML file with a grid of three product cards, each with a thumbnail image (use a colored placeholder div). Clicking a card must expand it into a full-page detail view, with the thumbnail morphing smoothly into a large hero image. Clicking outside the detail dismisses it with the reverse animation. CRITICAL constraints: (1) The morph must use document.startViewTransition with the same view-transition-name on both the card thumbnail and the expanded hero so the browser treats them as the same element. (2) ::view-transition-old and ::view-transition-new must be used to customize the cross-fade timing. (3) No CSS keyframe animation on the images directly — the browser must interpolate position and size. The HTML file must be self-contained with inline <style> and minimal <script>. No external resources.`,
  },
];
