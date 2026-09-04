import {
  calculateBatchIngredientCost,
  calculateLiterBottleCost,
  calculatePerKilogramCost,
  calculateUnitCost,
} from "./cost";
import type { PreparationRecipe, PriceEntry, Unit } from "./models";

export interface YieldEntry {
  readonly quantity: number | null;
  readonly unit: Unit;
}

export interface PreparationCostResult {
  readonly lineCosts: Readonly<Record<string, number | null>>;
  readonly batchCost: number;
  readonly missingCount: number;
  readonly unitCost: number | null;
  readonly yieldUnit: Unit;
}

export const preparationIngredientUsageKey = (recipeId: string, ingredientId: string): string =>
  `${recipeId}:${ingredientId}`;

export const calculatePreparationCost = (
  recipe: PreparationRecipe,
  prices: Readonly<Record<string, PriceEntry>>,
  yieldEntry: YieldEntry | undefined,
  usageMilliliters: Readonly<Record<string, number | null>> = {},
): PreparationCostResult => {
  const lineCosts: Record<string, number | null> = {};
  let batchCost = 0;
  let missingCount = 0;
  for (const item of recipe.ingredients) {
    const entryKey = preparationIngredientUsageKey(recipe.id, item.id);
    const entry =
      prices[entryKey] ??
      (item.pricingMode === "liter-bottle-by-milliliter" ? prices[item.id] : undefined);
    const isOneLiterBottle = entry?.packQuantity === 1 && entry.packUnit === "l";
    const pricingMode = item.pricingMode;
    const value = (() => {
      switch (pricingMode) {
        case "liter-bottle-by-milliliter":
          return calculateLiterBottleCost(
            isOneLiterBottle ? entry.price : null,
            usageMilliliters[entryKey] ?? null,
          );
        case "per-kilogram":
          return calculatePerKilogramCost(entry);
        case undefined:
          return calculateBatchIngredientCost(entry);
        default: {
          const unreachable: never = pricingMode;
          return unreachable;
        }
      }
    })();
    lineCosts[item.id] = value;
    if (value === null) missingCount += 1;
    else batchCost += value;
  }
  const yieldQuantity = yieldEntry?.quantity ?? null;
  const unitCost =
    missingCount === 0 && yieldQuantity !== null
      ? calculateUnitCost(batchCost, yieldQuantity)
      : null;
  return {
    lineCosts,
    batchCost,
    missingCount: missingCount + (yieldQuantity === null || yieldQuantity <= 0 ? 1 : 0),
    unitCost,
    yieldUnit: yieldEntry?.unit ?? "g",
  };
};
