import { calculateLineCost, calculateUnitCost } from "./cost";
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

export const calculatePreparationCost = (
  recipe: PreparationRecipe,
  prices: Readonly<Record<string, PriceEntry>>,
  yieldEntry: YieldEntry | undefined,
): PreparationCostResult => {
  const lineCosts: Record<string, number | null> = {};
  let batchCost = 0;
  let missingCount = 0;
  for (const item of recipe.ingredients) {
    const value = calculateLineCost(item.quantity, item.unit, prices[item.id]);
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
