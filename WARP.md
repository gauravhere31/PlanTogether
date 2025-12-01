# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repository is a static marketing prototype for the "Plan Together" group-travel product. It is a multi-page site built from hand-authored HTML, CSS, and vanilla JavaScript—there is no build system, package manager, or test framework configured.

Top-level layout:
- `pages/` contains standalone HTML pages (home, product, features, AI, safety, marketplace, budgeting, map, about, contact, thank-you).
- `js/` contains page-level interaction scripts written as small, self-contained IIFEs.
- `css/` contains global layout/typography styles and reusable component styles.
- `assets/` contains images and other static assets referenced from the pages and CSS.

## Running and developing the site

There is currently no build, lint, or test tooling defined in this repo. All pages are loaded directly in the browser via static files.

To work on the site locally, use any static HTTP server from the repository root and open the pages under `pages/` in your browser, for example:

```bash path=null start=null
python -m http.server 8000
# then visit http://localhost:8000/pages/index.html in a browser
```

or, with Node.js installed:

```bash path=null start=null
npx serve .
# then visit http://localhost:3000/pages/index.html (or the port reported by serve)
```

Because there is no automated test suite, changes should be validated by manually exercising the relevant pages in a browser (including navigation, forms, and interactive widgets described below).

## Front-end architecture

### Page shell and navigation

- Every page in `pages/` follows the same high-level structure:
  - `html[data-page="..."]` attribute indicating the logical page type (e.g. `home`, `budgeting`, `map`).
  - A shared `div.app-shell` wrapper containing:
    - `header.navbar` with brand, navigation links, and a small status pill.
    - `main` content built from `section.section.page-shell` blocks.
    - `footer.footer` with contextual copy and cross-links.
- Navigation between sections of the product is done via standard anchor tags pointing at other HTML files in `pages/` (no client-side routing or framework).
- All JavaScript is loaded via `<script defer src="../js/*.js"></script>` tags in the individual HTML pages—there is no bundling step, module loader, or transpilation.

### JavaScript structure

All scripts in `js/` follow the same pattern:
- Wrapped in an IIFE that runs on `DOMContentLoaded` (or immediately if the DOM is already ready).
- Guarded by simple DOM checks (usually a `data-page` or feature root element) so that each script is effectively page-scoped even though all code runs in the global browser context.

Key scripts:

#### `js/app.js` – global UI behaviors

- Defines shared behavior that can appear on multiple pages:
  - **Section reveal on scroll**: Uses `IntersectionObserver` (when available and not disabled by `prefers-reduced-motion`) to add an `is-visible` class to elements with `.reveal-on-scroll` as they enter the viewport.
  - **Smooth in-page anchor scrolling**: Intercepts anchor clicks on `a[href^="#"]` and scrolls to the target element with smooth scrolling (unless reduced motion is requested).
  - **CTA hooks**: Buttons with `data-action="start-planning"` log a console event and scroll into the `[data-section='product-demo']` area when present.
  - **Forms**:
    - Newsletter sign-up forms are identified by `data-form="newsletter"`; submissions are prevented from reloading the page, logged to the console, and acknowledged with an alert stub.
    - Contact forms are identified by `data-form="contact"`; on submit they prevent default behavior, log a stub, and redirect to `thankyou.html`.
- This script is included on most or all pages to provide cross-cutting behaviors that rely on CSS classes and `data-*` attributes rather than hard-coded page IDs.

#### `js/budget.js` – budgeting & bill-split module

- Only activates on pages with `document.querySelector("[data-page='budgeting']")` (i.e. `pages/budgeting.html`).
- Treats the budgeting layout as a self-contained feature rooted at `[data-budget='root']`.
- Core behavior:
  - Parses numeric inputs tagged with `data-budget='expense'` to compute a `total` trip budget.
  - Reads the number of travellers from `data-budget='people'` and derives a per-person split.
  - Writes the formatted totals into elements with `data-budget='total'` and `data-budget='per-person'`.
  - Listens to `input` events bubbling from the budgeting root and recalculates whenever relevant inputs change.
- This file is a good template for future calculator- or dashboard-style modules: it uses `data-*` attributes to keep structure and behavior loosely coupled.

#### `js/map.js` – route planning module

- Only activates on pages with `document.querySelector("[data-page='map']")` (i.e. `pages/map.html`).
- Maintains an in-memory `state` object representing a simple list of route stops, each with:
  - A label (e.g. `A`, `B`, `C`),
  - A `name`,
  - `etaMinutes`,
  - `distanceKm`.
- Core responsibilities:
  - **Rendering the route list** into `[data-map='route-list']`, building `.map-route-list__item` elements that show label, name, distance, and time, and mark the active item with `is-active`.
  - **Summary metrics**: Computes total distance and time from the last stop and writes them into `[data-map='summary-distance']` and `[data-map='summary-time']`.
  - **Interactions**:
    - Clicking a `.map-route-list__item` updates `state.activeIndex` and re-renders the list.
    - Clicking the `[data-map='add-stop']` button reads `[data-map='add-stop-input']`, appends a new stop with incremented label and derived distance/time, clears the input, updates the active index, and refreshes the list and summary.
- The layout and copy in `pages/map.html` are designed as placeholders for eventual integration with a real map SDK and safety overlays; the current implementation is fully client-side and uses only DOM APIs.

### CSS and component system

- `css/global.css` defines the global design system: typography, layout primitives (`.app-shell`, `.page-shell`, `.section`), and shared utility classes.
- `css/components.css` defines UI components that appear across pages:
  - Navigation (`.navbar`, `.navbar__link`, `.navbar__pill`).
  - Hero layout and cards (`.hero`, `.hero-card`, `.stat-row`, `.badge`, `.pill`).
  - Form elements (`.form-field`, `.input`, `.select`, `.btn`, etc.).
  - Content containers (`.surface-card`, `.grid`, `.carousel-row`, `.budget-shell`, `.map-shell`, etc.).
- JavaScript generally references components by these classes (for styling) and `data-*` attributes (for behavior), so when adding new UI you should:
  - Prefer to reuse existing component classes to maintain visual consistency.
  - Add new `data-*` attributes for behavioral hooks rather than overloading class names.

## Working with and extending this prototype

When adding new functionality or pages:
- Follow the existing HTML patterns:
  - Add a meaningful `data-page` value on the root `<html>` tag for any new page type.
  - Use `div.app-shell` with the established header / main / footer structure.
- Mirror the JavaScript structure:
  - Create a new file in `js/` wrapped in an IIFE.
  - Gate execution with a `data-page` or feature-root check so the script is effectively isolated to the page(s) that include it.
  - Use `data-*` attributes on your HTML as stable hooks for JS instead of relying solely on class names.
- Keep behavior small and composable—`app.js` contains shared cross-page behaviors; feature-specific logic should live in its own file, like `budget.js` and `map.js`.
