export interface Challenge {
  id: string;
  title: string;
  expectedFeature: string;
  expectedKeywords: string[];
  prompt: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "01-popover-flip",
    title: "Tooltip that flips when near the viewport edge",
    expectedFeature: "anchor-positioning",
    expectedKeywords: [
      "anchor-name",
      "position-anchor",
      "anchor(",
      "position-try",
    ],
    prompt: `Build an HTML page with three buttons placed near the top, middle, and bottom of the viewport. Each button shows a tooltip on hover. The tooltip must appear ABOVE the button if the button is near the bottom edge of the viewport, and BELOW the button otherwise — the position must adjust automatically without JavaScript. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "02-form-valid-submit",
    title: "Submit button enables only when all inputs are valid",
    expectedFeature: "has",
    expectedKeywords: [":has(", ":invalid", ":user-valid", ":valid"],
    prompt: `Build an HTML page with a form containing three required inputs: name (text), email (email type), age (number, min=18). The submit button must be visually disabled (gray) when any input is invalid or empty, and become enabled (vivid green) only when ALL three are valid. Use no JavaScript. No event listeners, no class toggling. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "03-textarea-fits-content",
    title: "Textarea sized to fit content automatically",
    expectedFeature: "field-sizing",
    expectedKeywords: ["field-sizing"],
    prompt: `Build an HTML page with a textarea labeled "Quick note". Initially the textarea should fit roughly one line of placeholder text. As the user types, the textarea must grow to fit the content — no scroll, no fixed rows. Use no JavaScript at all (no auto-resize libraries, no event handlers). The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "04-list-grid-toggle",
    title: "Smooth morph between list and grid layouts",
    expectedFeature: "view-transitions",
    expectedKeywords: [
      "view-transition",
      "::view-transition",
      "view-transition-name",
    ],
    prompt: `Build an HTML page with six product cards and a button labeled "Switch layout". Clicking the button toggles between a vertical list (one card per row) and a 3-column grid. The transition between layouts must be a smooth animated morph where cards visibly move from one position to the other (not a hard cut). Minimal JavaScript is allowed only to toggle a class. No keyframe animations on the cards directly. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "05-light-dark-card",
    title: "Card that adapts to system color scheme",
    expectedFeature: "light-dark",
    expectedKeywords: ["light-dark(", "color-scheme"],
    prompt: `Build an HTML page with a single hero card (title, body paragraph, CTA button). The card colors must automatically adapt when the user toggles their operating system between light and dark mode. The CSS must NOT use prefers-color-scheme media queries and must NOT duplicate any color value across two rules. Each color is declared once and resolves to the right shade depending on the system scheme. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "06-accordion-zero-to-auto",
    title: "Accordion that animates to natural content height",
    expectedFeature: "interpolate-size",
    expectedKeywords: ["interpolate-size", "calc-size(", "allow-keywords"],
    prompt: `Build an HTML page with three accordion items. Each item has a clickable header and a collapsed body. Clicking the header smoothly animates the body open from height 0 to its natural content height over 300ms. The animation must work even though the content height varies per item, and you must NOT measure heights with JavaScript or use a max-height trick with a large fixed value. The HTML file must be self-contained with inline <style> and minimal <script>. No external resources.`,
  },
  {
    id: "07-scroll-progress",
    title: "Scroll progress bar with no JavaScript",
    expectedFeature: "scroll-driven-animations",
    expectedKeywords: ["animation-timeline", "scroll(", "view("],
    prompt: `Build an HTML page with five long sections of placeholder text totaling several screens of scroll. A horizontal progress bar at the top must fill from 0% to 100% as the user scrolls from the top to the bottom of the page. Use NO JavaScript at all — no scroll listener, no requestAnimationFrame. The HTML file must be self-contained with inline <style>. No external resources or scripts.`,
  },
  {
    id: "08-scoped-rules",
    title: "Style block scoped to a subtree only",
    expectedFeature: "scope",
    expectedKeywords: ["@scope", "to (", "from "],
    prompt: `Build an HTML page with two cards. The page has a global rule \`p { color: red; }\`. Inside the card with class "scoped", paragraphs must remain BLACK. Inside any element with class "preview" nested INSIDE the scoped card, paragraphs must again be RED (the scope must respect a lower boundary). No additional classes on the paragraphs themselves, no inline styles, no JavaScript, no custom properties hacks. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "09-balanced-headline",
    title: "Headline that balances across lines",
    expectedFeature: "text-wrap-balance",
    expectedKeywords: ["text-wrap", "balance"],
    prompt: `Build an HTML page with a hero section containing a long headline (about 12-14 words) over a fixed width of 500px. The headline must wrap so the lines have roughly equal length — no single short word dangling alone on the last line, no manual <br> tags. Use modern CSS only. The HTML file must be self-contained with inline <style>. No external resources.`,
  },
  {
    id: "10-typed-animated-prop",
    title: "Animatable typed custom property",
    expectedFeature: "registered-custom-properties",
    expectedKeywords: ["@property", "syntax:", "inherits:", "initial-value:"],
    prompt: `Build an HTML page with a single button "Trigger glow". On click (or on hover, your choice), the button must animate a custom CSS property representing a color from gray (#888) to a vivid blue (#0ea5e9) over 800ms. The animation must visibly transition through intermediate color values, not snap. CSS custom properties are NOT animatable by default — make this one animatable using a recent CSS feature. The HTML file must be self-contained with inline <style>. Minimal <script> allowed only to toggle a class. No external resources.`,
  },
];
