# Design System: costtiemtranguoiitnoi

## Direction

The interface combines a clear operational calculator with the warmth of a Vietnamese fruit-tea counter. It uses the direct list structure of the first generated concept and the restrained “ingredient ledger” rhythm of the second. The supplied JPEG informs content grouping only, not visual styling.

## Tokens

- Canvas: `#f7f3e8` warm cream.
- Surface: `#fffdf8`; muted surface: `#eef4e9`.
- Primary: `#143f2b`; action: `#26734a`; light leaf: `#dcebd5`.
- Fruit accent: `#ad3f27`; mango accent: `#d9a632`.
- Text: `#173027`; secondary: `#607068`; border: `#dfe4d8`.
- Typography: Manrope with system sans fallback; tabular numerals for money.
- Spacing: 4, 8, 12, 16, 20, 24, 32 px.
- Radius: 12 px controls, 16 px rows, 22 px feature cards.
- Shadow: two low-opacity layers; no ornamental gradient or glass effect.

## Components and behavior

- App shell: centered mobile column up to 720 px, fixed header context and fixed safe-area bottom navigation.
- Menu card: fruit-colored marker, item number, name, short recipe metadata, clear disclosure action.
- Recipe detail: bottom sheet on mobile, centered dialog on wider screens; source file and section always visible.
- Price row: editable actual batch usage and its matching VND price, with specialized inputs for sugar by kilogram and bottled smoothie by milliliter.
- Ingredient group: related inputs may sit inside one muted parent surface; compact child rows retain 44 px controls and calculated contributions while removing repeated helper copy.
- Result card: dark green sticky summary with complete/incomplete label and missing-field count.
- Inputs: numeric keyboard hints, explicit units outside inputs, 44 px minimum height, visible focus rings.
- Missing data: coral outline and plain Vietnamese explanation; no missing field is treated as zero.
- Cost history: a dedicated all-product screen with per-product filtering, timestamp, expandable breakdown, and explicit increase/decrease against the immediately previous saved total for the same product.
- Navigation: five text-plus-line-icon tabs labeled `Thực đơn`, `Mẻ nguyên liệu`, `Một ly`, `Lịch sử`, `Cài đặt`.

## Responsive rules

- 393 px: single column, bottom sheets, sticky result above navigation, no horizontal scrolling.
- 768 px: wider rows and two-column menu grid while preserving touch sizing.
- 1280 px: app stays centered with a restrained two-column content area; calculators do not stretch into a dense desktop table.

## Accessibility

Semantic headings and labels, keyboard-operable dialogs/toggles, `aria-live` totals, 4.5:1 body-text contrast, reduced-motion support, and no color-only status messaging.
