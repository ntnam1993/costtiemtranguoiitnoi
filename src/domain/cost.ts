import type { PriceEntry, Unit } from "./models";

type UnitFamily = "mass" | "volume" | "discrete";

const unitFamily = (unit: Unit): UnitFamily => {
  if (unit === "g" || unit === "kg") return "mass";
  if (unit === "ml" || unit === "l") return "volume";
  return "discrete";
};

const baseFactor = (unit: Unit): number => {
  if (unit === "kg" || unit === "l") return 1000;
  return 1;
};

export const compatibleUnits = (unit: Unit): readonly Unit[] => {
  if (unitFamily(unit) === "mass") return ["g", "kg"];
  if (unitFamily(unit) === "volume") return ["ml", "l"];
  return [unit];
};

export const convertQuantity = (quantity: number, fromUnit: Unit, toUnit: Unit): number | null => {
  if (unitFamily(fromUnit) !== unitFamily(toUnit)) return null;
  if (unitFamily(fromUnit) === "discrete" && fromUnit !== toUnit) return null;
  return (quantity * baseFactor(fromUnit)) / baseFactor(toUnit);
};

export const calculateLineCost = (
  recipeQuantity: number,
  recipeUnit: Unit,
  entry: PriceEntry | undefined,
): number | null => {
  if (
    entry === undefined ||
    entry.price === null ||
    entry.packQuantity === null ||
    entry.price < 0 ||
    entry.packQuantity <= 0
  ) {
    return null;
  }
  const converted = convertQuantity(recipeQuantity, recipeUnit, entry.packUnit);
  return converted === null ? null : (entry.price * converted) / entry.packQuantity;
};

export const calculateBatchIngredientCost = (entry: PriceEntry | undefined): number | null => {
  if (
    entry === undefined ||
    entry.price === null ||
    entry.packQuantity === null ||
    entry.price < 0 ||
    entry.packQuantity <= 0
  ) {
    return null;
  }
  return entry.price;
};

export const calculateLiterBottleCost = (
  bottlePrice: number | null,
  usedMilliliters: number | null,
): number | null => {
  if (bottlePrice === null || usedMilliliters === null || bottlePrice < 0 || usedMilliliters <= 0) {
    return null;
  }
  return (bottlePrice * usedMilliliters) / 1000;
};

export const calculatePerKilogramCost = (entry: PriceEntry | undefined): number | null => {
  if (
    entry === undefined ||
    entry.price === null ||
    entry.packQuantity === null ||
    entry.price < 0 ||
    entry.packQuantity <= 0
  ) {
    return null;
  }
  const kilograms = convertQuantity(entry.packQuantity, entry.packUnit, "kg");
  return kilograms === null ? null : entry.price * kilograms;
};

export const calculateUnitCost = (batchCost: number, yieldQuantity: number): number | null =>
  batchCost >= 0 && yieldQuantity > 0 ? batchCost / yieldQuantity : null;

export const roundVnd = (value: number): number => Math.round(value);

export const formatVnd = (value: number): string =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(roundVnd(value));
