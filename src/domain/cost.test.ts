import { describe, expect, it } from "vitest";
import {
  calculateBatchIngredientCost,
  calculateLineCost,
  calculateLiterBottleCost,
  calculatePerKilogramCost,
  calculateUnitCost,
  convertQuantity,
  roundVnd,
} from "./cost";

describe("cost calculation", () => {
  it("converts mass and volume only within their dimensions", () => {
    expect(convertQuantity(500, "g", "kg")).toBe(0.5);
    expect(convertQuantity(1.5, "l", "ml")).toBe(1500);
    expect(convertQuantity(2, "trái", "g")).toBeNull();
  });

  it("calculates a recipe contribution from a purchase pack", () => {
    expect(calculateLineCost(500, "g", { packQuantity: 1, packUnit: "kg", price: 30_000 })).toBe(
      15_000,
    );
  });

  it("uses the full entered cost for an ingredient consumed by the batch", () => {
    expect(
      calculateBatchIngredientCost({
        packQuantity: 6.7,
        packUnit: "kg",
        price: 220_000,
      }),
    ).toBe(220_000);
    expect(
      calculateBatchIngredientCost({ packQuantity: 0, packUnit: "kg", price: 220_000 }),
    ).toBeNull();
    expect(calculateBatchIngredientCost({ packQuantity: 250, packUnit: "ml", price: 30_000 })).toBe(
      30_000,
    );
  });

  it("calculates smoothie cost from a one-liter bottle and milliliters used", () => {
    expect(calculateLiterBottleCost(180_000, 120)).toBe(21_600);
    expect(calculateLiterBottleCost(null, 120)).toBeNull();
    expect(calculateLiterBottleCost(180_000, 0)).toBeNull();
  });

  it("calculates sugar cost from the price per kilogram and actual quantity used", () => {
    expect(calculatePerKilogramCost({ packQuantity: 3.3, packUnit: "kg", price: 106_000 })).toBe(
      349_800,
    );
    expect(calculatePerKilogramCost({ packQuantity: 500, packUnit: "g", price: 20_000 })).toBe(
      10_000,
    );
    expect(
      calculatePerKilogramCost({ packQuantity: 500, packUnit: "ml", price: 20_000 }),
    ).toBeNull();
  });

  it("keeps missing and invalid values incomplete", () => {
    expect(calculateLineCost(100, "g", undefined)).toBeNull();
    expect(
      calculateLineCost(100, "g", { packQuantity: 0, packUnit: "g", price: 10_000 }),
    ).toBeNull();
    expect(calculateUnitCost(120_000, 0)).toBeNull();
  });

  it("returns a deterministic unit cost and VND rounding", () => {
    expect(calculateUnitCost(75_000, 1500)).toBe(50);
    expect(roundVnd(1234.6)).toBe(1235);
  });
});
