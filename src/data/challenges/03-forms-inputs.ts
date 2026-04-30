export const ROUND = {
  name: "Forms & inputs",
  description:
    "field-sizing, :user-valid, :has() for form logic, accent-color, exclusive <details> — form primitives that shipped in 2023–2024 that most LLMs still patch with JavaScript.",
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
    id: "03-01-field-sizing-textarea",
    title: "Chat compose area with reactive button and character counter",
    expectedFeature: "field-sizing",
    expectedKeywords: ["field-sizing", "content", ":has(", "lh"],
    prompt: `Build a chat compose area with three coordinated reactive parts:
- A <textarea> labeled "Message" that grows from one line to a maximum of 6 lines as the user types, then locks at 6 with internal scroll.
- A "Send" button to the right that is visually disabled (gray, pointer-events: none) when the textarea is empty or only whitespace, and becomes vivid green and clickable as soon as there is at least one non-space character.
- A character counter at the bottom-right of the textarea that shows remaining characters out of 280. It turns amber when within 40 characters of the cap, then red on the last 20.

CRITICAL constraints:
1. No JavaScript event listeners. No oninput, onchange, no React state, no manual height calculation.
2. The button enabled state must respond purely to CSS — use :has() combined with :placeholder-shown or :user-valid on the textarea.
3. The 6-line maximum must use a line-relative unit (lh), not a hardcoded pixel value like 144px.
4. field-sizing: content must be the grow mechanism — not scrollHeight assignment.
5. No rows attribute on the textarea.

The agent that knows field-sizing: content, lh units, and :has() with form pseudo-classes will solve this in under 80 lines of self-contained HTML. Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "03-02-user-valid-feedback",
    title:
      "Multi-step registration form with :user-valid, field-level error content, and gated progress",
    expectedFeature: "user-valid",
    expectedKeywords: [
      ":user-valid",
      ":user-invalid",
      ":has(",
      "interpolate-size",
    ],
    prompt: `Build a four-field registration form: email (type="email", required), password (required, minlength=10), username (required, pattern="[a-zA-Z0-9_]{3,20}"), and a bio textarea (maxlength=160). Requirements:

- On initial load, every field shows a clean neutral state — no red borders, no error messages, no checkmarks.
- After a user interacts with a field (types and blurs), :user-invalid fields show a red left border PLUS an inline error message in a div below the field that smoothly expands from height: 0 to height: auto. :user-valid fields show a green checkmark icon via ::after.
- The error expansion animation must use interpolate-size: allow-keywords — no max-height: 9999px hack. The error div must be display: none while valid and animate open only on :user-invalid.
- The "Create account" button must be visually disabled (gray, pointer-events: none, reduced opacity) until ALL four fields are simultaneously :user-valid. The button turns vivid indigo and becomes clickable only then.
- A step indicator above the form shows a 0–4 filled circle count matching how many fields are currently :user-valid — CSS counter() or :has() counting must drive this, not JavaScript.

CRITICAL constraints:
1. No JavaScript — no blur listeners, no class toggling, no validity.valid.
2. :user-valid and :user-invalid (NOT :valid/:invalid) must drive all feedback — they must not trigger on untouched fields.
3. The button enabled state must use a :has() selector on the form.
4. interpolate-size: allow-keywords must enable the error message height: 0 → height: auto animation.
5. No additional wrapper elements may be added around inputs — the CSS must work on the existing field structure.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "03-03-has-submit-enable",
    title: "Submit enables when form is complete via :has()",
    expectedFeature: "has",
    expectedKeywords: [":has(", ":invalid", ":valid"],
    prompt: `Build a self-contained HTML file with a contact form: name (required text), email (required email type), message (required textarea). The submit button must be visually disabled (gray, cursor: not-allowed) when any field is invalid or empty. It must become enabled (vivid green, clickable) only when ALL fields are valid simultaneously. CRITICAL constraints: (1) No JavaScript. (2) The submit button state must be controlled by a :has() selector on the form that checks for :invalid descendants. (3) The button must use CSS pointer-events and opacity to signal its state — not the disabled HTML attribute alone. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "03-04-accent-color-theme",
    title:
      "Multi-accent settings panel with color-scheme-aware native controls and light-dark() palette",
    expectedFeature: "accent-color",
    expectedKeywords: [
      "accent-color",
      "color-scheme",
      "light-dark(",
      "color-mix(",
    ],
    prompt: `Build a full settings panel containing: a checkbox group (4 items), a radio group (4 options), a range slider, a progress bar at 72%, a color input, a meter element, and a file input. Four accent presets at the top — "Indigo", "Rose", "Emerald", "Amber" — plus a light/dark toggle.

The native controls must look tinted in all four accent colors AND must render correctly in both light and dark modes.

CRITICAL constraints:
1. accent-color must be the SOLE tinting mechanism for native controls — no appearance: none, no custom pseudo-elements replacing checkboxes or radios.
2. Each accent preset must change ONLY a --accent custom property on :root (e.g. --accent: #6366f1). Every native control must inherit it via a single 'accent-color: var(--accent)' rule with no per-control overrides.
3. The hover shade for buttons must derive from the accent using color-mix(in oklch, var(--accent) 80%, black) — no separate hardcoded hover hex value.
4. The dark mode toggle must flip color-scheme on :root only. Native controls must automatically adapt to dark rendering through color-scheme — not through a separate background-color on each control.
5. All page colors (background, text, card surface, borders) must use light-dark() so each color is written exactly once — no duplicate blocks in @media or dark-class.
6. Five distinct accent presets AND both light/dark modes must work without page reload — the panel itself is the demo.

Output a single self-contained HTML file with inline <style> and minimal <script> for attribute/property toggling only. No external resources.`,
  },
  {
    id: "03-05-popover-anchor-input",
    title: "Input suggestion popover with anchor positioning",
    expectedFeature: "anchor-positioning",
    expectedKeywords: ["anchor-name", "position-anchor", "anchor("],
    prompt: `Build a self-contained HTML file with a search input. Below it a suggestion popover lists three items ("Apple", "Banana", "Cherry"). Clicking a suggestion fills the input. The popover must be absolutely positioned so it always appears directly below the input regardless of where the input sits in the viewport. CRITICAL constraints: (1) CSS anchor positioning (anchor-name on the input, position-anchor on the popover, anchor() for position values) must be used — not JavaScript getBoundingClientRect. (2) The popover must use the HTML popover attribute for show/hide behavior. (3) No JavaScript may calculate or set the popover's position. The HTML file must be self-contained with inline <style> and minimal <script> only for suggestion click. No external resources.`,
  },
  {
    id: "03-06-color-scheme-form-controls",
    title:
      "System-integrated preferences form: light-dark(), color-scheme, and forced-colors resilience",
    expectedFeature: "color-scheme",
    expectedKeywords: [
      "color-scheme",
      "light-dark(",
      "color-scheme: light dark",
      "Canvas",
      "Field",
    ],
    prompt: `Build a preferences form with eight native controls: a text input, an email input, a date picker, a number input, a select dropdown, a checkbox, a range slider, and a file input. The form must fully support light and dark modes AND must degrade gracefully in forced-colors (high contrast) mode.

CRITICAL constraints:
1. color-scheme: light dark must be declared on :root so ALL browser-native controls automatically adapt to the OS theme — no appearance: none, no custom replacements.
2. Every page color (background, text, card background, border, label) must be declared using light-dark() exactly once — no @media (prefers-color-scheme) blocks, no duplicate rules, no dark-mode class.
3. The toggle button must flip color-scheme by setting document.documentElement.style.colorScheme — that single change must be the only mechanism that switches every color on the page simultaneously.
4. Structural surface colors must use CSS system keywords (Canvas, CanvasText, Field, FieldText) where appropriate so they remain correct in forced-colors mode without a separate @media block.
5. A @media (forced-colors: active) block must exist with ONLY the brand accent color remapped to Highlight — all other colors must already be correct from the system keywords.
6. Do NOT use appearance: none on any form control — the native appearance must be preserved and must visibly differ between light and dark modes.

Output a single self-contained HTML file with inline <style> and minimal <script> for the toggle only. No external resources.`,
  },
  {
    id: "03-07-file-selector-button",
    title:
      "Accessible file upload zone: ::file-selector-button, :has() gate, and focus-within state",
    expectedFeature: "file-selector-button",
    expectedKeywords: [
      "::file-selector-button",
      ":has(",
      ":focus-within",
      "color-mix(",
    ],
    prompt: `Build a multi-file upload form with these visible zones:

1. A styled drop zone containing a native file input (multiple, accept image/*). The "Choose files" button inside the input must be styled with vivid teal (#0d9488) background, white text, pill shape (border-radius: 9999px), hover state that darkens by 15% using color-mix(in oklch, ..., black).
2. The filename/count text beside the button must be muted gray. When multiple files are selected, it should show "{n} files selected" — pure CSS, no JS text manipulation.
3. The drop zone container must show a dashed teal border and a light teal tint on :focus-within — CSS only.
4. A "Upload" submit button below must be visually disabled (gray, pointer-events: none, cursor: not-allowed) when no file is selected, and become vivid green and clickable as soon as at least one file is selected.

CRITICAL constraints:
1. ::file-selector-button must style the choose-files button — do NOT use appearance: none, do NOT hide the native input with a label trick, do NOT create a custom div replacement.
2. The native file picker must still open when the button is clicked.
3. The "Upload" button enabled/disabled state must use a :has() selector on the form detecting the file input's non-empty state — no JavaScript.
4. No JavaScript event listeners at all — no change, input, click, or dragover handlers.
5. The hover darkening on the ::file-selector-button must use color-mix() — not a separate hardcoded hex value.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "03-08-focus-visible-ring",
    title:
      "Focus ring system: element-specific rings, forced-colors resilience, and :has() compound selector",
    expectedFeature: "focus-visible",
    expectedKeywords: [
      ":focus-visible",
      "outline-offset",
      ":focus",
      "forced-colors",
      ":has(",
    ],
    prompt: `Build a full UI with four distinct focusable element types: a navigation bar (5 links), a card grid (3 clickable cards), a form (text input, email input, select, checkbox, submit button), and a toolbar (4 icon-only buttons). Each type must have a visually distinct keyboard focus ring:

- Nav links: 2px dashed blue (oklch(0.5 0.2 250)), 4px offset, no fill change.
- Cards: 3px solid violet (oklch(0.5 0.2 290)), 0px offset, plus a box-shadow glow in the same color at 30% opacity.
- Form controls: 2px solid teal (oklch(0.6 0.15 185)), 2px offset.
- Toolbar buttons: inset ring (outline-offset: -3px) in amber (oklch(0.7 0.2 70)), to avoid overflow clipping.

Additionally: when a card has :focus-visible, its title must change color — using the :has() selector on the card container to detect the focused child, without JS.

CRITICAL constraints:
1. :focus-visible must drive ALL ring visibility — :focus must only set outline: none to suppress mouse rings globally.
2. No JavaScript may detect keyboard vs mouse input.
3. All four ring styles must be visibly distinct — colors, offsets, and widths must differ.
4. Rings must use outline (not box-shadow alone) so they survive forced-colors mode. A @media (forced-colors: active) block must remap all ring colors to Highlight.
5. The card title color-change on focus must use :has(:focus-visible) on the card — no JS class toggling.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "03-09-exclusive-accordion-details",
    title:
      "Exclusive accordion with auto-height animation, scroll-driven highlight, and nested tables",
    expectedFeature: "exclusive-details",
    expectedKeywords: [
      "name=",
      "interpolate-size",
      "allow-keywords",
      "animation-timeline",
      "view(",
    ],
    prompt: `Build a six-item FAQ accordion using native <details> and <summary> elements embedded in a long scrollable page. The accordion must behave as an exclusive group AND integrate with scroll-driven animation.

Panel content is heterogeneous and deliberately stresses the auto-height requirement:
- Item 1: three paragraphs.
- Item 2: a data table (4 columns, 6 rows).
- Item 3: a code block plus a bullet list.
- Item 4: an embedded image (200px placeholder) plus caption text.
- Item 5: a nested sub-accordion (two more <details> inside).
- Item 6: a textarea where the user can type (growing via field-sizing: content).

CRITICAL constraints:
1. The name attribute must be shared across all six top-level <details> to form a native exclusive group — no JavaScript toggling, no aria-expanded management.
2. interpolate-size: allow-keywords must enable height: 0 → height: auto CSS transitions on each panel. Do NOT use max-height with any pixel cap.
3. No JavaScript at all — not even for the accordion open/close.
4. The nested sub-accordion in item 5 must use a DIFFERENT name value so it does not join the outer exclusive group.
5. Each open summary must show a rotated chevron (▸ rotating to ▾) via [open] > summary ::before — driven by CSS only.
6. As the accordion scrolls into view, it must fade in using animation-timeline: view() on the accordion container — no JS IntersectionObserver.

Output a single self-contained HTML file with inline <style>. No external resources.`,
  },
  {
    id: "03-10-inert-dialog-background",
    title: "Dialog with inert background via <dialog>",
    expectedFeature: "dialog-inert",
    expectedKeywords: ["<dialog", "showModal", "inert"],
    prompt: `Build a self-contained HTML file with page content (several inputs and links) and a button "Open dialog". Clicking the button opens a modal dialog. While the dialog is open, all content behind it must be inert — keyboard Tab must not reach background elements, and clicking background elements must do nothing. CRITICAL constraints: (1) The native <dialog> element with showModal() must be used — this automatically makes background content inert via the browser's top-layer behavior. (2) Do NOT manually add the inert attribute to the page body. (3) A close button inside the dialog must call dialog.close(). The HTML file must be self-contained with inline <style> and minimal <script> for open/close only. No external resources.`,
  },
];
