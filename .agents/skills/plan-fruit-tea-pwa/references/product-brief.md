# Fruit Tea PWA Product Brief

## Purpose

Plan a Vietnamese, mobile-first PWA that presents the fruit-tea menu and
preparation guidance and provides two distinct cost calculators. The app is a
static frontend intended for free GitHub Pages hosting.

## Authoritative local sources

- `docs/CACH PHA CHE TRA (1).docx`: the owning menu inventory and per-cup
  preparation instructions. Read its full `MENU` section rather than copying a
  maintained product count or list into the plan.
- `docs/U UOP NGUYEN LIEU TRA TRAI CAY - THANH VIET (1).docx`: ingredient
  preparation, maceration/cooking instructions, ratios, storage guidance, and
  some yields for fruit bases, jams, syrups, and toppings. The body contains
  additions beyond its opening contents list, so read the full document.
- `docs/43fb4af4-fdd1-4c77-b4da-5c4edccccb83.jpeg`: a partial cost-note
  screenshot with ingredient names, quantities, totals, and a partial cup
  breakdown. Column meaning and completeness are not self-evident; use it to
  discover questions, not as verified price data.

The original files override this summary. Preserve Vietnamese display names
from the sources while assigning stable, accent-free IDs in application data.

## Required user outcomes

1. Browse and search the menu on a phone.
2. Open a product to see its per-cup recipe and linked preparation details.
3. Calculate the ingredient cost of a selected prepared fruit-tea component or
   batch while explicitly excluding brewed tea, ice, cup, lid, straw, and
   equivalent per-cup service inputs.
4. Calculate the complete cost of one selected cup with an itemized breakdown.
5. Install the site as an app and use already visited core content offline.

## Data distinctions

Model these separately even when the documents use overlapping names:

- `ingredient`: purchasable item, purchase pack, unit, and editable price;
- `prepared-component`: fruit base, jam, syrup, or topping made from ingredients;
- `preparation-recipe`: quantities, steps, usable yield, storage, and source;
- `menu-product`: customer-facing drink;
- `cup-recipe`: prepared components, tea, fruit, garnish, packaging, and their
  per-cup quantities;
- `cost-assumption`: yield loss, optional inclusion, rounding, or local price.

Every source-derived record needs traceability to a filename and a stable
section or product label. Do not hard-code a value from OCR without review.

## Known source gaps to expose

- Purchase prices and package sizes are not comprehensively documented.
- Some instructions use ambiguous or customary quantities, for example a
  “normal” salt ratio.
- The source alternates among mass, volume, fruit counts, ladles, pieces, and
  portions; not every conversion can be inferred safely.
- Some preparation recipes provide approximate output or servings while
  others do not provide usable yield.
- Similar names and combined menu rows require explicit mapping between menu
  drinks and prepared components.
- The image is cropped and its table headings are incomplete.

Plans must represent these as editable inputs, incomplete estimates, or user
decisions. They must not convert the gaps into silent zeroes or guessed data.

## Technical boundary

- Static assets and client-side computation only.
- No backend, database, login, cloud sync, or paid runtime service.
- Canonical menu and recipe data is version controlled with the frontend.
- User-entered prices may remain on the device using browser storage if the
  accepted plan includes persistence.
- The production build must support a GitHub Pages repository subpath and HTTPS.
- Offline behavior must cache the app shell and canonical recipe data after a
  successful first load, with a visible update strategy for new deployments.

## Minimum manual QA scenarios

- Find a documented menu item, open it, and trace its displayed quantities to
  the corresponding Word source.
- Enter simple hand-computable purchase and recipe quantities; confirm the
  prepared batch total and unit cost.
- Confirm cup/ice/tea/service inputs do not appear in the prepared-batch total.
- Select a cup recipe, add base and service prices, and confirm every included
  line contributes exactly once to the cup total.
- Clear a required price or yield and confirm the result is marked incomplete.
- Install from a supported mobile browser, relaunch from the home screen, then
  reload a previously visited core screen offline.
- Open the deployed project-site URL and refresh a navigated screen without a
  server-side 404 or broken asset URL.
