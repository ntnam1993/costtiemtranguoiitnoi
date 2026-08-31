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
const historyEntrySchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  total: z.number(),
  savedAt: z.string(),
  lines: z.array(historyLineSchema),
});
const storedDataSchema = z.object({
  batchPrices: z.record(z.string(), priceEntrySchema),
  cupPrices: z.record(z.string(), priceEntrySchema),
  yields: z.record(z.string(), yieldEntrySchema),
  serviceIncluded: z.record(z.string(), z.boolean()),
  history: z.array(historyEntrySchema).default([]),
});

export type StoredCostData = z.infer<typeof storedDataSchema>;
export type CostHistoryLine = z.infer<typeof historyLineSchema>;
export type CostHistoryEntry = z.infer<typeof historyEntrySchema>;

const emptyData = (): StoredCostData => ({
  batchPrices: {},
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

  const saveHistory = useCallback(
    (productId: string, productName: string, total: number, lines: readonly CostHistoryLine[]) => {
      setData((current) => ({
        ...current,
        history: [
          {
            id: crypto.randomUUID(),
            productId,
            productName,
            total,
            savedAt: new Date().toISOString(),
            lines: [...lines],
          },
          ...current.history,
        ],
      }));
    },
    [],
  );

  const reset = useCallback(() => setData(emptyData()), []);

  return {
    data,
    setBatchPrice,
    setCupPrice,
    setYield,
    setServiceIncluded,
    saveHistory,
    reset,
  };
};
