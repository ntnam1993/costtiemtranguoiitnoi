import { compatibleUnits, formatVnd } from "../domain/cost";
import type { PreparationIngredient, PriceEntry } from "../domain/models";
import { isUnit } from "../domain/models";
import { preparationIngredientUsageKey } from "../domain/prepared-cost";
import type { StoredCostData } from "../state/use-cost-data";
import { NumberField } from "./number-field";

interface BatchIngredientRowProps {
  readonly compact?: boolean;
  readonly data: StoredCostData;
  readonly item: PreparationIngredient;
  readonly lineCost: number | null;
  readonly recipeId: string;
  readonly onPriceChange: (key: string, entry: PriceEntry) => void;
  readonly onUsageMillilitersChange: (key: string, milliliters: number | null) => void;
}

export const BatchIngredientRow = ({
  compact = false,
  data,
  item,
  lineCost,
  recipeId,
  onPriceChange,
  onUsageMillilitersChange,
}: BatchIngredientRowProps) => {
  const isLiterBottle = item.pricingMode === "liter-bottle-by-milliliter";
  const isPerKilogram = item.pricingMode === "per-kilogram";
  const entryKey = preparationIngredientUsageKey(recipeId, item.id);
  const storedEntry =
    data.batchPrices[entryKey] ?? (isLiterBottle ? data.batchPrices[item.id] : undefined);
  const hasOneLiterPrice = storedEntry?.packQuantity === 1 && storedEntry.packUnit === "l";
  const entry: PriceEntry = isLiterBottle
    ? hasOneLiterPrice
      ? storedEntry
      : { packQuantity: 1, packUnit: "l", price: null }
    : (storedEntry ?? {
        packQuantity: null,
        packUnit: item.unit,
        price: null,
      });
  const usageMilliliters = data.batchUsageMilliliters[entryKey] ?? null;
  const batchUnits = item.batchUnits ?? compatibleUnits(item.unit);

  return (
    <article className={compact ? "price-row price-row--compact" : "price-row"}>
      <div className="price-row__heading">
        <div>
          <strong>{item.name}</strong>
          {compact ? null : (
            <span>
              {isLiterBottle
                ? "Chai 1 lít · hệ thống tự tính theo số ml dùng"
                : isPerKilogram
                  ? "Đơn giá theo kg · hệ thống tính theo lượng dùng"
                  : "Nhập lượng đã dùng thực tế cho mẻ"}
            </span>
          )}
        </div>
        <span className={lineCost === null ? "line-total line-total--missing" : "line-total"}>
          {lineCost === null ? "Chưa đủ dữ liệu" : `${formatVnd(lineCost)} đ`}
        </span>
      </div>
      <div className="price-row__inputs">
        {isLiterBottle ? (
          <>
            <div>
              <span className="field-label">Giá mua (chai 1 lít)</span>
              <NumberField
                label={`Giá mua chai 1 lít ${item.name}`}
                placeholder="0"
                suffix="đ"
                value={entry.price}
                onChange={(price) =>
                  onPriceChange(entryKey, { packQuantity: 1, packUnit: "l", price })
                }
              />
            </div>
            <div>
              <span className="field-label">Lượng dùng cho mẻ</span>
              <NumberField
                invalid={usageMilliliters !== null && usageMilliliters <= 0}
                label={`Lượng dùng cho mẻ ${item.name}`}
                placeholder="0"
                suffix="ml"
                value={usageMilliliters}
                onChange={(milliliters) => onUsageMillilitersChange(entryKey, milliliters)}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="field-label">{compact ? "Lượng" : "Lượng dùng cho mẻ"}</span>
              <div className="quantity-combo">
                <NumberField
                  invalid={entry.packQuantity !== null && entry.packQuantity <= 0}
                  label={`Lượng dùng cho mẻ ${item.name}`}
                  placeholder="VD: 1"
                  value={entry.packQuantity}
                  onChange={(packQuantity) => onPriceChange(entryKey, { ...entry, packQuantity })}
                />
                <select
                  aria-label={`Đơn vị dùng ${item.name}`}
                  value={entry.packUnit}
                  onChange={(event) => {
                    const unit = event.currentTarget.value;
                    if (isUnit(unit)) onPriceChange(entryKey, { ...entry, packUnit: unit });
                  }}
                >
                  {batchUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <span className="field-label">
                {isPerKilogram ? "Giá mua / kg" : compact ? "Tổng tiền" : "Tổng tiền cho mẻ"}
              </span>
              <NumberField
                label={`${isPerKilogram ? "Giá mua / kg" : "Tổng tiền cho mẻ"} ${item.name}`}
                placeholder="0"
                suffix="đ"
                value={entry.price}
                onChange={(price) => onPriceChange(entryKey, { ...entry, price })}
              />
            </div>
          </>
        )}
      </div>
    </article>
  );
};
