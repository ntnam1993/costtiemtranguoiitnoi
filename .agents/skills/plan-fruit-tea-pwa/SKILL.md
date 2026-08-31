---
name: plan-fruit-tea-pwa
description: Create an implementation-ready plan for this repository's installable, offline-capable fruit-tea menu, recipe, and cost-calculation PWA. Use when planning or revising the frontend-only GitHub Pages application; do not use it to invent recipe data, implement the app, or deploy it.
---

# Plan Fruit Tea PWA

Create a plan that another coding agent can execute without rediscovering the
product boundary or guessing business data. This skill plans the application;
it does not implement or deploy it unless the user separately requests that
work.

## Source boundary

1. Read the repository `AGENTS.md`.
2. Read [references/product-brief.md](references/product-brief.md).
3. Extract and inspect both Word documents and the image under `docs/`. Treat
   the original documents as the recipe authority and the reference as routing
   context, not a replacement for the originals.
4. Record unclear units, incomplete prices, conflicting quantities, OCR
   uncertainty, and phrases such as “tỉ lệ thông thường” as decisions or data
   gaps. Never silently normalize or invent them.

When document tooling is unavailable, use a read-only fallback such as macOS
`textutil` or OOXML extraction and state the limitation in the plan evidence.

## Plan workflow

### 1. Establish the contract

State the desired outcome, constraints, non-goals, and observable acceptance
criteria. Preserve these fixed constraints:

- static client-side PWA, mobile-first and installable;
- no backend, database, authentication, or paid service;
- deployable to a GitHub Pages project site;
- Vietnamese recipe and menu content comes from `docs/`;
- no fabricated purchase prices, yields, or missing recipe quantities.

Ask only about a material product decision that the repository cannot answer.
Otherwise expose the decision in the plan with an explicit assumption or
blocked data task.

### 2. Inventory the product data

Map every menu item to its per-cup recipe and, where present, its preparation
recipe, ingredients, yields, storage guidance, and source location. Separate:

- raw purchasable ingredients;
- prepared components such as fruit base, syrup, jam, and topping;
- shared cup inputs such as brewed tea, ice, cup, lid, straw, and garnish;
- menu products and their per-cup quantities.

Do not collapse similarly named products or assume that a menu item and a
prepared component are the same entity. Put unresolved source mappings in the
plan's decision log.

### 3. Specify the two cost calculators

The plan must define both calculators and their shared unit model.

**Prepared fruit-tea cost** calculates one selected preparation batch and its
usable unit cost from ingredient purchase price, purchase quantity, recipe
quantity, and batch yield. It must exclude brewed tea, ice, cup, lid, straw,
and other per-cup service items. Show the exclusion list in the interface.

**Per-cup cost** calculates one selected menu item from its allocated prepared
components plus the separately entered per-cup ingredients and service items.
Show an itemized breakdown, included/excluded state, and total.

Use dimension-safe units (`g`/`kg`, `ml`/`l`, item, portion). The plan must
define conversion, validation, zero or missing-value behavior, yield loss, and
VND rounding. A baseline formula is:

```text
ingredient cost = purchase price × recipe quantity / purchase quantity
batch cost = sum(ingredient cost)
prepared unit cost = batch cost / usable batch yield
cup component cost = prepared unit cost × cup quantity
cup cost = sum(component and per-cup service-item costs)
```

Do not treat a missing value as zero without visibly marking the estimate
incomplete.

### 4. Define the static application

Cover at least these user surfaces:

- searchable/filterable menu;
- product detail with ingredients, quantities, preparation, storage notes, and
  source traceability;
- prepared fruit-tea cost calculator;
- per-cup cost calculator with itemized result;
- client-side settings for editable prices and cost assumptions.

Keep canonical recipes in versioned static data bundled with the application.
If editable prices or preferences need persistence, plan browser storage as
local device state, not as a database, and describe reset behavior.

The PWA and GitHub Pages section must address the web app manifest, installable
icons, service worker/offline cache, update behavior, HTTPS, repository subpath
base URLs, asset paths, and route reload behavior. Avoid server-dependent
routing and runtime APIs.

### 5. Produce an executable plan

Write the plan under the repository-configured `plans/` location and naming
convention. Include:

- outcome, constraints, non-goals, and acceptance criteria;
- evidence-backed source inventory and traceability strategy;
- information architecture and responsive screen behavior;
- static data schema and example entity relationships;
- exact cost formulas, units, inclusion rules, and incomplete-data states;
- PWA/offline and GitHub Pages design;
- implementation phases with owning files and dependencies;
- focused automated checks and manual QA scenarios;
- migration/content-entry work, risks, decisions, and rollback notes.

Do not create production code as part of this planning invocation.

## Acceptance gate for the plan

Before finishing, verify that the plan lets an implementer prove all of the
following:

- all documented menu products are represented or explicitly flagged;
- recipe details can be traced to the original source files;
- the two calculators cannot accidentally mix their cost boundaries;
- invalid or missing price, quantity, unit, and yield data is visible;
- calculations are deterministic and testable with hand-worked examples;
- the installed app opens after the first visit while offline;
- mobile layouts and calculator controls work at narrow viewports;
- the production build works from a GitHub Pages repository subpath;
- no backend or database is required at runtime.

Stop with the implementation-ready plan and a concise list of unresolved user
decisions. Do not claim source values were verified unless they were actually
read from the original artifacts.
