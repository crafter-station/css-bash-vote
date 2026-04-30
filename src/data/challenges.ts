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
    title: "Popover toolbar that flips to any viewport edge",
    expectedFeature: "anchor-positioning",
    expectedKeywords: [
      "anchor-name",
      "position-anchor",
      "position-try-fallbacks",
      "position-area",
    ],
    prompt: `Build a self-contained HTML page with a horizontal toolbar fixed to the top of the screen containing four icon buttons: Info, Settings, Share, Delete. Each button, when clicked (or focused), shows a popover panel with a short description. The popover must open BELOW the button by default. When the button is near the RIGHT edge, the popover must flip LEFT. When near the LEFT edge, it must open RIGHT. Use CSS anchor positioning — anchor-name on each button, position-anchor on each popover, and position-try-fallbacks to declare at least four candidate positions (block-start, block-end, inline-start, inline-end) so the browser picks whichever fits. No JavaScript for positioning logic. position-area must be used for at least one fallback candidate. Each popover must use the HTML popover attribute and be opened with popovertarget. The file must be self-contained with inline style. No external resources.`,
  },
  {
    id: "02-form-valid-submit",
    title: "Subgrid form with cross-row baseline alignment",
    expectedFeature: "subgrid",
    expectedKeywords: [
      "subgrid",
      "grid-template-columns: subgrid",
      "grid-column",
      "align-content",
    ],
    prompt: `Build a self-contained HTML page with a registration form that has four rows: Full Name, Email, Password, and Bio (a textarea). The form layout must be a CSS Grid with three explicit columns: label column, input column, helper-text column. Each row is a child that spans all three columns using grid-column: 1 / -1 and internally lays out its three cells with grid-template-columns: subgrid, inheriting the parent track sizing. Labels in the label column must align to last baseline across all rows, even though the textarea in the Bio row makes its row taller. Use align-content: last baseline on the label cell. No floats, no tables, no JavaScript. The submit button sits below the grid, full-width. The HTML file must be self-contained with inline style. No external resources.`,
  },
  {
    id: "03-textarea-fits-content",
    title: "Three-pane intrinsic layout with fit-content, min, max",
    expectedFeature: "intrinsic-size",
    expectedKeywords: [
      "fit-content(",
      "min-content",
      "max-content",
      "minmax(",
    ],
    prompt: `Build a self-contained HTML page with a horizontal three-pane layout filling the full viewport width. Left pane: uses width: min-content — it must shrink to the width of its longest unbreakable word and never wrap further. Centre pane: uses width: max-content — it grows to fit all its text on one line regardless of viewport width, with overflow: auto so horizontal scroll appears if needed. Right pane: uses width: fit-content(320px) — it grows with text up to 320px then wraps. Each pane has a live contenteditable body so the user can type and watch the sizing change. Add a clear visible label at the top of each pane naming the keyword in use. Panes must be children of a CSS Grid container using grid-template-columns: min-content max-content fit-content(320px). No JavaScript for sizing. The HTML file must be self-contained with inline style. No external resources.`,
  },
  {
    id: "04-list-grid-toggle",
    title: "List-to-grid morph with view-transitions and container queries",
    expectedFeature: "view-transitions",
    expectedKeywords: [
      "view-transition-name",
      "::view-transition-group",
      "startViewTransition",
      "container-type",
    ],
    prompt: `Build a self-contained HTML page with eight product cards and a toggle checkbox labeled "Grid view". When unchecked, cards render as a single-column list (full width). When checked, they render as a responsive multi-column grid. Use :has(:checked) on the wrapper to switch layout — no extra JavaScript for the layout change. However, wrapping the class toggle in document.startViewTransition is required so the browser animates the cards morphing between positions using named view-transitions. Each card must have a unique view-transition-name. Additionally, each card is a container (container-type: inline-size) and its internal layout — title size, image visibility, description line-clamp — must respond to the card's own container width via @container queries. No fixed breakpoints on the viewport. The HTML file must be self-contained with inline style and minimal script (only the startViewTransition call). No external resources.`,
  },
  {
    id: "05-light-dark-card",
    title: "Scroll-snap carousel with overscroll containment",
    expectedFeature: "scroll-snap",
    expectedKeywords: [
      "scroll-snap-type",
      "scroll-snap-align",
      "scroll-margin",
      "overscroll-behavior",
    ],
    prompt: `Build a self-contained HTML page with a horizontally scrolling card carousel containing eight cards. The carousel must snap to the centre of each card using scroll-snap-type: x mandatory on the container and scroll-snap-align: center on each card. Cards must have scroll-margin of at least 16px so the snapped card never touches the container edge. The carousel container must have overscroll-behavior-x: contain so that swiping past the first or last card does not scroll the page. Below the carousel, add a long vertical article so the page itself is scrollable — the overscroll-behavior containment must prevent the card scroll from bleeding into the page scroll. Show a custom scroll-padding on the container that accounts for a sticky 48px header at the top of the page. No JavaScript for snap or scroll logic. The HTML file must be self-contained with inline style. No external resources.`,
  },
  {
    id: "06-accordion-zero-to-auto",
    title: "Native details accordion animating height: auto",
    expectedFeature: "interpolate-size",
    expectedKeywords: [
      "interpolate-size",
      "allow-keywords",
      "::details-content",
      "transition-behavior",
    ],
    prompt: `Build a self-contained HTML page with four native HTML details/summary accordion items. Each item has a summary header and body content of varying length (short paragraph, medium list, long blockquote, nested definition list). When a details element is opened, the body must smoothly animate from height 0 to its natural content height over 350ms using a CSS transition — not a max-height hack with an arbitrarily large value. Achieve this by setting interpolate-size: allow-keywords on :root so that CSS can transition to height: auto, then targeting ::details-content with height: 0 when closed and height: auto when open, with transition: height 350ms ease and transition-behavior: allow-discrete. No JavaScript. The HTML file must be self-contained with inline style. No external resources.`,
  },
  {
    id: "07-scroll-progress",
    title: "Scroll-driven progress bar and sticky chapter tracker",
    expectedFeature: "scroll-driven-animations",
    expectedKeywords: [
      "animation-timeline",
      "scroll()",
      "view()",
      "animation-range",
    ],
    prompt: `Build a self-contained HTML page with a long article divided into five named chapters, each at least 400px tall with placeholder text. At the top of the viewport, a thin horizontal progress bar must fill from 0% to 100% as the user scrolls the full page — driven by a scroll() timeline with no JavaScript. In a sticky sidebar on the right, each chapter has a dot indicator that animates from grey to vivid blue as the chapter scrolls into view — driven by a view() timeline on each chapter section with animation-range: entry 0% entry 100%. The sidebar must use position: sticky so it stays in view while the chapter is on screen. No JavaScript scroll listeners or requestAnimationFrame. The HTML file must be self-contained with inline style. No external resources.`,
  },
  {
    id: "08-scoped-rules",
    title: "@scope isolation with lower boundary across card grid",
    expectedFeature: "scope",
    expectedKeywords: [
      "@scope",
      "to (",
      ":scope",
      "container-type",
    ],
    prompt: `Build a self-contained HTML page with a grid of three cards. The global stylesheet sets p { color: crimson; } and h2 { font-size: 2rem; }. Inside each card, use an @scope block (from .card to .card-footer) so that paragraphs inside the card body are styled black and headings are 1rem — without adding any extra classes to the p or h2 elements. The lower boundary (to .card-footer) must cause the global crimson rule to re-apply to any p inside .card-footer even though it sits inside .card. Demonstrate the boundary is working by placing a visible paragraph in .card-footer that must render crimson. Each card is also a container (container-type: inline-size) and the @scope block must include at least one @container rule inside it that changes the heading colour when the card is wider than 300px. No JavaScript, no inline styles on the paragraphs. The HTML file must be self-contained with inline style. No external resources.`,
  },
  {
    id: "09-balanced-headline",
    title: "Magazine hero with balance, pretty, and line-clamp by container",
    expectedFeature: "text-wrap-balance",
    expectedKeywords: [
      "text-wrap: balance",
      "text-wrap: pretty",
      "-webkit-line-clamp",
      "container-type",
    ],
    prompt: `Build a self-contained HTML page with a magazine-style hero section that adapts across three container widths. The outer container uses container-type: inline-size. At narrow widths (below 480px), the H1 headline must use text-wrap: balance so lines are roughly equal length. At medium widths (480px to 800px), switch the subheading to text-wrap: pretty to eliminate orphan words at the end of paragraphs. At all widths, the body description must be clamped to 4 lines using -webkit-line-clamp: 4 with a "Read more" label visible below. Use @container queries (not @media) to switch between these behaviours. The H1 must be at least 14 words long so balancing is visible. No JavaScript, no manual br tags. The HTML file must be self-contained with inline style. No external resources.`,
  },
  {
    id: "10-typed-animated-prop",
    title: "Tab indicator via anchor positioning, @property, and view-transitions",
    expectedFeature: "registered-custom-properties",
    expectedKeywords: [
      "@property",
      "anchor-name",
      "position-anchor",
      "startViewTransition",
    ],
    prompt: `Build a self-contained HTML page with a tab bar containing five tabs (Home, Explore, Library, Settings, Profile). An active indicator bar must sit below the currently active tab and smoothly slide to the new tab when clicked. Implement this using CSS anchor positioning: give each tab an anchor-name and position the indicator element with position-anchor pointing to the active tab, using position-area: bottom to align it. Register a typed @property named --indicator-x of type length with initial-value: 0px so the browser can interpolate it; use this property to drive the indicator position via translate. Wrap each tab click in document.startViewTransition so the indicator swap uses a view-transition instead of a hard cut; give the indicator a view-transition-name. The result must animate fluidly between tabs. Minimal JavaScript is allowed only for the click handler and startViewTransition call. No external resources. The HTML file must be self-contained with inline style.`,
  },
];
