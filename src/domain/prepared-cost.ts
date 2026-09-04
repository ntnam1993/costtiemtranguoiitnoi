import { calculateLineCost, calculateLiterBottleCost, calculateUnitCost } from "./cost";
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
    const entry = prices[item.id];
    const isOneLiterBottle = entry?.packQuantity === 1 && entry.packUnit === "l";
    const value =
      item.pricingMode === "liter-bottle-by-milliliter"
        ? calculateLiterBottleCost(
            isOneLiterBottle ? entry.price : null,
            usageMilliliters[preparationIngredientUsageKey(recipe.id, item.id)] ?? null,
          )
        : calculateLineCost(item.quantity, item.unit, entry);
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
