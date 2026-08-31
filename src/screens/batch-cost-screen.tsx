import { CheckCircle, Info, WarningCircle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { NumberField } from "../components/number-field";
import { ScreenHeader } from "../components/screen-header";
import { preparations } from "../data/preparations";
import { compatibleUnits, formatVnd } from "../domain/cost";
import { isUnit, type PriceEntry, type Unit } from "../domain/models";
import { calculatePreparationCost } from "../domain/prepared-cost";
import type { StoredCostData } from "../state/use-cost-data";

const yieldUnits: readonly Unit[] = ["g", "kg", "ml", "l", "phần"];

interface BatchCostScreenProps {
  readonly data: StoredCostData;
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
  readonly onPriceChange: (key: string, entry: PriceEntry) => void;
  readonly onYieldChange: (key: string, quantity: number | null, unit: Unit) => void;
}

export const BatchCostScreen = ({
  data,
  selectedId,
  onSelect,
  onPriceChange,
  onYieldChange,
}: BatchCostScreenProps) => {
  const [showNotes, setShowNotes] = useState(false);
  const selected = preparations.find((item) => item.id === selectedId) ?? preparations[0];
  const recipe = selected ?? preparations[0];
  const yieldEntry = recipe === undefined ? undefined : data.yields[recipe.id];
  const result = useMemo(
    () =>
      recipe === undefined ? null : calculatePreparationCost(recipe, data.batchPrices, yieldEntry),
    [data.batchPrices, recipe, yieldEntry],
  );

  if (recipe === undefined || result === null) return null;

  return (
    <main className="screen calculator-screen">
      <ScreenHeader
        description="Định lượng công thức đã khóa. Bạn chỉ nhập giá mua hiện tại và sản lượng thực tế."
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
          <h2>Giá nguyên liệu hiện tại</h2>
          <span>{recipe.ingredients.length} định lượng từ công thức</span>
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
        {recipe.ingredients.map((item) => {
          const entry = data.batchPrices[item.id] ?? {
            packQuantity: null,
            packUnit: item.unit,
            price: null,
          };
          const lineCost = result.lineCosts[item.id] ?? null;
          return (
            <article className="price-row" key={item.id}>
              <div className="price-row__heading">
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    Cần {item.quantity} {item.unit}
                  </span>
                </div>
                <span
                  className={lineCost === null ? "line-total line-total--missing" : "line-total"}
                >
                  {lineCost === null ? "Chưa đủ giá" : `${formatVnd(lineCost)} đ`}
                </span>
              </div>
              <div className="price-row__inputs">
                <div>
                  <span className="field-label">Quy cách mua</span>
                  <div className="quantity-combo">
                    <NumberField
                      invalid={entry.packQuantity !== null && entry.packQuantity <= 0}
                      label={`Quy cách mua ${item.name}`}
                      placeholder="VD: 1"
                      value={entry.packQuantity}
                      onChange={(packQuantity) =>
                        onPriceChange(item.id, { ...entry, packQuantity })
                      }
                    />
                    <select
                      aria-label={`Đơn vị mua ${item.name}`}
                      value={entry.packUnit}
                      onChange={(event) => {
                        const unit = event.currentTarget.value;
                        if (isUnit(unit)) onPriceChange(item.id, { ...entry, packUnit: unit });
                      }}
                    >
                      {compatibleUnits(item.unit).map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <span className="field-label">Giá mua</span>
                  <NumberField
                    label={`Giá mua ${item.name}`}
                    placeholder="0"
                    suffix="đ"
                    value={entry.price}
                    onChange={(price) => onPriceChange(item.id, { ...entry, price })}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <section className="yield-card">
        <div>
          <h2>Thành phẩm dùng được</h2>
          <p>Cân hoặc đong lượng thực tế sau sơ chế để tính đúng đơn giá.</p>
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
        <div className="result-card__line result-card__line--primary">
          <span>Cost / {result.yieldUnit}</span>
          <strong>{result.unitCost === null ? "—" : `${formatVnd(result.unitCost)} đ`}</strong>
        </div>
      </section>
    </main>
  );
};
