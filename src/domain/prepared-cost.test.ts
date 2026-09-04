import { describe, expect, it } from "vitest";
import type { PreparationRecipe } from "./models";
import { calculatePreparationCost, preparationIngredientUsageKey } from "./prepared-cost";

const recipe: PreparationRecipe = {
  id: "fruit-batch",
  name: "Fruit batch",
  ingredients: [
    {
      id: "smoothie",
      name: "Smoothie",
      quantity: 120,
      unit: "ml",
      pricingMode: "liter-bottle-by-milliliter",
    },
  ],
  notes: [],
  source: { file: "source.docx", section: "Fruit batch" },
};

describe("prepared batch cost", () => {
  it("uses the entered milliliters with a one-liter smoothie price", () => {
    const result = calculatePreparationCost(
      recipe,
      { smoothie: { packQuantity: 1, packUnit: "l", price: 180_000 } },
      { quantity: 1000, unit: "ml" },
      { [preparationIngredientUsageKey(recipe.id, "smoothie")]: 120 },
    );

    expect(result.lineCosts.smoothie).toBe(21_600);
    expect(result.batchCost).toBe(21_600);
    expect(result.missingCount).toBe(0);
  });

  it("does not reinterpret an old non-liter pack price as a one-liter bottle price", () => {
    const result = calculatePreparationCost(
      recipe,
      { smoothie: { packQuantity: 170, packUnit: "ml", price: 19_000 } },
      { quantity: 1000, unit: "ml" },
      { [preparationIngredientUsageKey(recipe.id, "smoothie")]: 120 },
    );

    expect(result.lineCosts.smoothie).toBeNull();
    expect(result.missingCount).toBe(1);
  });
});
