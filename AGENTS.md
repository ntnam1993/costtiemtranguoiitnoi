# Calculation Cost Workspace Instructions

## Scope and authority

- This repository is for a Vietnamese fruit-tea menu, recipe, and cost PWA.
- Read the original files under `docs/` before planning or changing recipe data.
- `docs/CACH PHA CHE TRA (1).docx` owns the menu and per-cup preparation
  guidance. `docs/U UOP NGUYEN LIEU TRA TRAI CAY - THANH VIET (1).docx` owns
  ingredient preparation, ratios, and storage guidance. The JPEG is partial
  supporting evidence, not a complete price table.
- Do not invent missing prices, yields, units, mappings, or recipe quantities.
  Record ambiguities for user review and keep source traceability in derived
  data.

## Product boundary

- Build a mobile-first, installable PWA that can run as a static GitHub Pages
  project site.
- Do not add a backend, database, authentication system, paid service, or
  server-only runtime dependency.
- Keep canonical menu and recipe content in version-controlled static data.
  Browser storage may hold device-local editable prices or preferences, but it
  is not canonical recipe authority.
- Account for the GitHub Pages repository subpath in build, manifest, service
  worker, asset, and routing decisions.

## Cost boundaries

- Keep prepared fruit-tea cost separate from per-cup cost.
- Prepared fruit-tea cost includes the ingredients used to make a selected
  fruit base, jam, syrup, or topping and excludes brewed tea, ice, cup, lid,
  straw, and equivalent per-cup service items.
- Per-cup cost allocates the selected prepared components and separately adds
  the cup recipe's tea, fruit, garnish, packaging, ice, topping, or other
  included inputs. The UI must show an itemized breakdown and explicit
  inclusion state.
- Convert only compatible units and make missing prices, quantities, or yields
  visibly incomplete instead of silently treating them as zero.

## Planning and delivery

- Use `.agents/skills/plan-fruit-tea-pwa/` for application planning and the
  `fruit_tea_pwa_planner` custom agent when available.
- Store implementation plans under `plans/{date}-{issue}-{slug}/` and reports
  under `plans/reports/`.
- A planning request does not authorize application implementation or deploy.
- For implementation, verify focused cost math first, then the production
  build, installability, offline behavior, mobile interaction, and the deployed
  GitHub Pages subpath on the real user surface.
