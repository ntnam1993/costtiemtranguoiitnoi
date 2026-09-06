import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import type { PriceEntry, Unit } from "../domain/models";

const storageKey = "costtiemtranguoiitnoi:cost-data:v1";
const unitSchema = z.enum([
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
]);
const priceEntrySchema = z.object({
  packQuantity: z.number().nullable(),
  packUnit: unitSchema,
  price: z.number().nullable(),
});
const yieldEntrySchema = z.object({ quantity: z.number().nullable(), unit: unitSchema });
const historyLineSchema = z.object({ name: z.string(), cost: z.number() });
const historyDraftFields = {
  productId: z.string(),
  productName: z.string(),
  total: z.number(),
  lines: z.array(historyLineSchema),
  missingCount: z.number().int().nonnegative().default(0),
} as const;
const cupHistoryDraftSchema = z.object({
  ...historyDraftFields,
  kind: z.literal("cup"),
});
const batchHistoryDraftSchema = z.object({
  ...historyDraftFields,
  kind: z.literal("batch"),
  yieldQuantity: z.number().positive().nullable(),
  yieldUnit: unitSchema,
  unitCost: z.number().nonnegative().nullable(),
});
const historyDraftSchema = z.union([cupHistoryDraftSchema, batchHistoryDraftSchema]);
const historyEntrySchema = z.union([
  batchHistoryDraftSchema.extend({ id: z.string(), savedAt: z.string() }),
  z.object({
    ...historyDraftFields,
    id: z.string(),
    kind: z.literal("cup").default("cup"),
    savedAt: z.string(),
  }),
]);
const storedDataSchema = z.object({
  batchPrices: z.record(z.string(), priceEntrySchema),
  batchUsageMilliliters: z.record(z.string(), z.number().nullable()).default({}),
  cupPrices: z.record(z.string(), priceEntrySchema),
  yields: z.record(z.string(), yieldEntrySchema),
  serviceIncluded: z.record(z.string(), z.boolean()),
  history: z.array(historyEntrySchema).default([]),
});

export type StoredCostData = z.infer<typeof storedDataSchema>;
export type CostHistoryLine = z.infer<typeof historyLineSchema>;
export type CostHistoryDraft = z.infer<typeof historyDraftSchema>;
export type CostHistoryEntry = z.infer<typeof historyEntrySchema>;

const emptyData = (): StoredCostData => ({
  batchPrices: {},
  batchUsageMilliliters: {},
  cupPrices: {},
  yields: {},
  serviceIncluded: {},
  history: [],
});

const readStoredData = (): StoredCostData => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw === null) return emptyData();
    const parsed: unknown = JSON.parse(raw);
    const result = storedDataSchema.safeParse(parsed);
    return result.success ? result.data : emptyData();
  } catch {
    return emptyData();
  }
};

export const useCostData = () => {
  const [data, setData] = useState<StoredCostData>(readStoredData);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  const setBatchPrice = useCallback((key: string, entry: PriceEntry) => {
    setData((current) => ({
      ...current,
      batchPrices: { ...current.batchPrices, [key]: entry },
    }));
  }, []);

  const setCupPrice = useCallback((key: string, entry: PriceEntry) => {
    setData((current) => ({
      ...current,
      cupPrices: { ...current.cupPrices, [key]: entry },
    }));
  }, []);

  const setBatchUsageMilliliters = useCallback((key: string, milliliters: number | null) => {
    setData((current) => ({
      ...current,
      batchUsageMilliliters: { ...current.batchUsageMilliliters, [key]: milliliters },
    }));
  }, []);

  const setYield = useCallback((key: string, quantity: number | null, unit: Unit) => {
    setData((current) => ({
      ...current,
      yields: { ...current.yields, [key]: { quantity, unit } },
    }));
  }, []);

  const setServiceIncluded = useCallback((key: string, included: boolean) => {
    setData((current) => ({
      ...current,
      serviceIncluded: { ...current.serviceIncluded, [key]: included },
    }));
  }, []);

  const saveHistory = useCallback((entry: CostHistoryDraft) => {
    setData((current) => ({
      ...current,
      history: [
        {
          ...entry,
          id: crypto.randomUUID(),
          savedAt: new Date().toISOString(),
        },
        ...current.history,
      ],
    }));
  }, []);

  const reset = useCallback(() => setData(emptyData()), []);

  return {
    data,
    setBatchPrice,
    setBatchUsageMilliliters,
    setCupPrice,
    setYield,
    setServiceIncluded,
    saveHistory,
    reset,
  };
};
