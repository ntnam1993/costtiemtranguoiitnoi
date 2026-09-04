import { CheckCircle, Info, WarningCircle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { BatchIngredientRow } from "../components/batch-ingredient-row";
import { NumberField } from "../components/number-field";
import { ScreenHeader } from "../components/screen-header";
import { preparations } from "../data/preparations";
import { formatVnd } from "../domain/cost";
import { isUnit, type PriceEntry, type Unit } from "../domain/models";
import { calculatePreparationCost } from "../domain/prepared-cost";
import type { StoredCostData } from "../state/use-cost-data";

const yieldUnits: readonly Unit[] = ["g", "kg", "ml", "l", "phần"];

interface BatchCostScreenProps {
  readonly data: StoredCostData;
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
  readonly onPriceChange: (key: string, entry: PriceEntry) => void;
  readonly onUsageMillilitersChange: (key: string, milliliters: number | null) => void;
  readonly onYieldChange: (key: string, quantity: number | null, unit: Unit) => void;
}

export const BatchCostScreen = ({
  data,
  selectedId,
  onSelect,
  onPriceChange,
  onUsageMillilitersChange,
  onYieldChange,
}: BatchCostScreenProps) => {
  const [showNotes, setShowNotes] = useState(false);
  const selected = preparations.find((item) => item.id === selectedId) ?? preparations[0];
  const recipe = selected ?? preparations[0];
  const yieldEntry = recipe === undefined ? undefined : data.yields[recipe.id];
  const result = useMemo(
    () =>
      recipe === undefined
        ? null
        : calculatePreparationCost(
            recipe,
            data.batchPrices,
            yieldEntry,
            data.batchUsageMilliliters,
          ),
    [data.batchPrices, data.batchUsageMilliliters, recipe, yieldEntry],
  );

  if (recipe === undefined || result === null) return null;
  const hardFruitItems = recipe.ingredients.filter(
    (item) => item.batchGroup === "tropical-hard-fruit",
  );
  const standaloneItems = recipe.ingredients.filter((item) => item.batchGroup === undefined);

  return (
    <main className="screen calculator-screen">
      <ScreenHeader
        description="Nhập lượng thực dùng và giá theo cách mua của từng nguyên liệu."
        eyebrow="Màn hình 1"
        title="Cost mẻ nguyên liệu"
      />
      <label className="select-card">
        <span>Chọn mẻ cần tính</span>
        <select value={recipe.id} onChange={(event) => onSelect(event.currentTarget.value)}>
          {preparations.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <div className="notice-card">
        <Info aria-hidden size={22} />
        <p>
          Chỉ tính nguyên liệu của mẻ. <strong>Không gồm trà, đá, ly, nắp, ống hút</strong> và chi
          phí phục vụ theo ly.
        </p>
      </div>
      <div className="section-row section-row--stack-mobile">
        <div>
          <h2>Chi phí nguyên liệu của mẻ</h2>
          <span>{recipe.ingredients.length} nguyên liệu trong công thức</span>
        </div>
        <button
          className="text-button"
          type="button"
          onClick={() => setShowNotes((value) => !value)}
        >
          {showNotes ? "Ẩn lưu ý" : "Xem lưu ý"}
        </button>
      </div>
      {showNotes ? (
        <div className="notes-card">
          {recipe.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
          <small>
            Nguồn: {recipe.source.file} · mục “{recipe.source.section}”
          </small>
        </div>
      ) : null}
      <div className="price-list">
        {hardFruitItems.length > 0 ? (
          <section
            aria-labelledby="hard-fruit-group-title"
            className="ingredient-group"
            role="group"
          >
            <div className="ingredient-group__heading">
              <h3 id="hard-fruit-group-title">Trái cây cứng hỗn hợp</h3>
              <span>{hardFruitItems.length} loại · nhập chi phí riêng</span>
            </div>
            <div className="ingredient-group__items">
              {hardFruitItems.map((item) => (
                <BatchIngredientRow
                  compact
                  data={data}
                  item={item}
                  key={item.id}
                  lineCost={result.lineCosts[item.id] ?? null}
                  recipeId={recipe.id}
                  onPriceChange={onPriceChange}
                  onUsageMillilitersChange={onUsageMillilitersChange}
                />
              ))}
            </div>
          </section>
        ) : null}
        {standaloneItems.map((item) => (
          <BatchIngredientRow
            data={data}
            item={item}
            key={item.id}
            lineCost={result.lineCosts[item.id] ?? null}
            recipeId={recipe.id}
            onPriceChange={onPriceChange}
            onUsageMillilitersChange={onUsageMillilitersChange}
          />
        ))}
      </div>
      <section className="yield-card">
        <div>
          <h2>Thành phẩm dùng được</h2>
          <p>Cân hoặc đong lượng thực tế để hệ thống phân bổ cost mẻ sang từng ly.</p>
        </div>
        <div className="quantity-combo quantity-combo--yield">
          <NumberField
            invalid={
              yieldEntry?.quantity !== undefined &&
              yieldEntry.quantity !== null &&
              yieldEntry.quantity <= 0
            }
            label="Sản lượng thành phẩm"
            placeholder="Nhập sản lượng"
            value={yieldEntry?.quantity ?? null}
            onChange={(quantity) => onYieldChange(recipe.id, quantity, yieldEntry?.unit ?? "g")}
          />
          <select
            aria-label="Đơn vị thành phẩm"
            value={yieldEntry?.unit ?? "g"}
            onChange={(event) => {
              const unit = event.currentTarget.value;
              if (isUnit(unit)) onYieldChange(recipe.id, yieldEntry?.quantity ?? null, unit);
            }}
          >
            {yieldUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section className="result-card" aria-live="polite">
        <div className="result-card__status">
          {result.unitCost === null ? (
            <WarningCircle aria-hidden size={22} />
          ) : (
            <CheckCircle aria-hidden size={22} />
          )}
          <span>
            {result.unitCost === null ? `Còn ${result.missingCount} mục cần nhập` : "Đã đủ dữ liệu"}
          </span>
        </div>
        <div className="result-card__line">
          <span>Tổng cost mẻ</span>
          <strong>{formatVnd(result.batchCost)} đ</strong>
        </div>
      </section>
    </main>
  );
};
