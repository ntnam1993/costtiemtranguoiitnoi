export const units = [
  "g",
  "kg",
  "ml",
  "l",
  "trái",
  "miếng",
  "lát",
  "vá",
  "hạt",
  "tép",
  "phần",
  "bộ",
] as const;

export type Unit = (typeof units)[number];
export type LineKind = "prepared" | "ingredient" | "tea" | "service";

export const isUnit = (value: string): value is Unit => units.some((unit) => unit === value);

export interface SourceReference {
  readonly file: string;
  readonly section: string;
}

export interface RecipeLine {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly unit: Unit;
  readonly kind: LineKind;
  readonly preparationId?: string;
  readonly optional?: boolean;
}

export interface MenuProduct {
  readonly id: string;
  readonly number: number;
  readonly name: string;
  readonly accent: string;
  readonly lines: readonly RecipeLine[];
  readonly method: string;
  readonly topping: string;
  readonly source: SourceReference;
}

export interface PreparationIngredient {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly unit: Unit;
}

export interface PreparationRecipe {
  readonly id: string;
  readonly name: string;
  readonly ingredients: readonly PreparationIngredient[];
  readonly suggestedYield?: { readonly quantity: number; readonly unit: Unit };
  readonly notes: readonly string[];
  readonly source: SourceReference;
}

export interface PriceEntry {
  readonly packQuantity: number | null;
  readonly packUnit: Unit;
  readonly price: number | null;
}

export interface ComponentRate {
  readonly costPerUnit: number;
  readonly unit: Unit;
}
