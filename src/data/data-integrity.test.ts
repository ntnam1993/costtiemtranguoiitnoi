import { describe, expect, it } from "vitest";
import { menuProducts } from "./menu-products";
import { preparations } from "./preparations";

describe("canonical recipe data", () => {
  it("contains every numbered menu item exactly once", () => {
    expect(menuProducts).toHaveLength(27);
    expect(new Set(menuProducts.map((item) => item.id)).size).toBe(27);
    expect(menuProducts.map((item) => item.number)).toEqual(
      Array.from({ length: 27 }, (_, index) => index + 1),
    );
  });

  it("keeps all quantities positive and traceable to the owning document", () => {
    for (const product of menuProducts) {
      expect(product.lines.length).toBeGreaterThan(0);
      expect(product.source.file).toBe("CACH PHA CHE TRA (1).docx");
      for (const item of product.lines) expect(item.quantity).toBeGreaterThan(0);
    }
    for (const recipe of preparations) {
      expect(recipe.ingredients.length).toBeGreaterThan(0);
      expect(recipe.source.file).toBe("U UOP NGUYEN LIEU TRA TRAI CAY - THANH VIET (1).docx");
      for (const item of recipe.ingredients) expect(item.quantity).toBeGreaterThan(0);
    }
  });

  it("links cup components only to existing preparation recipes", () => {
    const preparationIds = new Set(preparations.map((item) => item.id));
    for (const product of menuProducts) {
      for (const item of product.lines) {
        if (item.preparationId !== undefined)
          expect(preparationIds.has(item.preparationId)).toBe(true);
      }
    }
  });
});
