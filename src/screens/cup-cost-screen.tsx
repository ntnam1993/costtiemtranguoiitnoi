import {
  CheckCircle,
  LinkSimple,
  ToggleLeft,
  ToggleRight,
  WarningCircle,
} from "@phosphor-icons/react";
import { useMemo } from "react";
import { CostHistory } from "../components/cost-history";
import { NumberField } from "../components/number-field";
import { ScreenHeader } from "../components/screen-header";
import { menuProducts } from "../data/menu-products";
import { preparations } from "../data/preparations";
import { calculateLineCost, formatVnd } from "../domain/cost";
import type { PriceEntry, RecipeLine } from "../domain/models";
import { calculatePreparationCost } from "../domain/prepared-cost";
import type { CostHistoryDraft, StoredCostData } from "../state/use-cost-data";

const serviceLines: readonly RecipeLine[] = [
  { id: "da", name: "Đá", quantity: 1, unit: "phần", kind: "service" },
  { id: "ly-nap", name: "Ly + nắp", quantity: 1, unit: "bộ", kind: "service" },
  { id: "ong-hut", name: "Ống hút", quantity: 1, unit: "phần", kind: "service" },
];

interface CupCostScreenProps {
  readonly data: StoredCostData;
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
  readonly onPriceChange: (key: string, entry: PriceEntry) => void;
  readonly onIncludedChange: (key: string, included: boolean) => void;
  readonly onSaveHistory: (entry: CostHistoryDraft) => void;
}

const linePriceKey = (productId: string, item: RecipeLine): string =>
  `${productId}:${item.name}:${item.unit}`;

const includeKey = (productId: string, item: RecipeLine): string =>
  `${productId}:${item.id}:included`;

export const CupCostScreen = ({
  data,
  selectedId,
  onSelect,
  onPriceChange,
  onIncludedChange,
  onSaveHistory,
}: CupCostScreenProps) => {
  const selected = menuProducts.find((item) => item.id === selectedId) ?? menuProducts[0];
  const product = selected ?? menuProducts[0];
  const preparedRates = useMemo(() => {
    const rates = new Map<string, { costPerUnit: number; unit: string }>();
    for (const recipe of preparations) {
      const result = calculatePreparationCost(
        recipe,
        data.batchPrices,
        data.yields[recipe.id],
        data.batchUsageMilliliters,
      );
      if (result.unitCost !== null) {
        rates.set(recipe.id, { costPerUnit: result.unitCost, unit: result.yieldUnit });
      }
    }
    return rates;
  }, [data.batchPrices, data.batchUsageMilliliters, data.yields]);

  if (product === undefined) return null;

  const allLines = [...product.lines, ...serviceLines];
  const computed = allLines.map((item) => {
    const key = includeKey(product.id, item);
    const defaultIncluded = item.optional !== true;
    const included = data.serviceIncluded[key] ?? defaultIncluded;
    const linked =
      item.preparationId === undefined ? undefined : preparedRates.get(item.preparationId);
    const linkedCost =
      linked !== undefined && linked.unit === item.unit ? linked.costPerUnit * item.quantity : null;
    const priceKey = linePriceKey(product.id, item);
    const directEntry = data.cupPrices[priceKey];
    const directCost = calculateLineCost(item.quantity, item.unit, directEntry);
    return {
      item,
      included,
      linkedCost,
      cost: included ? (linkedCost ?? directCost) : 0,
      priceKey,
      directEntry,
      includeKey: key,
    };
  });
  const missingCount = computed.filter((entry) => entry.included && entry.cost === null).length;
  const total = computed.reduce((sum, entry) => sum + (entry.cost ?? 0), 0);
  const history = data.history.filter(
    (entry) => entry.kind === "cup" && entry.productId === product.id,
  );
  const saveCurrentCost = () => {
    onSaveHistory({
      kind: "cup",
      productId: product.id,
      productName: product.name,
      total,
      missingCount,
      lines: computed
        .filter((entry) => entry.included && entry.cost !== null)
        .map((entry) => ({ name: entry.item.name, cost: entry.cost ?? 0 })),
    });
  };

  return (
    <main className="screen calculator-screen">
      <ScreenHeader
        description="Cốt đã tính từ mẻ sẽ tự liên kết; các thành phần còn lại nhập đơn giá hiện tại."
        eyebrow="Màn hình 2"
        title="Cost một ly hoàn chỉnh"
      />
      <label className="select-card">
        <span>Chọn món cần tính</span>
        <select value={product.id} onChange={(event) => onSelect(event.currentTarget.value)}>
          {menuProducts.map((item) => (
            <option key={item.id} value={item.id}>
              {String(item.number).padStart(2, "0")}. {item.name}
            </option>
          ))}
        </select>
      </label>
      <div className="cup-summary-strip">
        <div>
          <span>Thành phần công thức</span>
          <strong>{product.lines.length}</strong>
        </div>
        <div>
          <span>Giá liên kết từ mẻ</span>
          <strong>{computed.filter((entry) => entry.linkedCost !== null).length}</strong>
        </div>
        <div>
          <span>Đang tính</span>
          <strong>{computed.filter((entry) => entry.included).length}</strong>
        </div>
      </div>
      <div className="section-row">
        <div>
          <h2>Chi tiết từng thành phần</h2>
          <span>Bật/tắt chi phí theo cách bán thực tế</span>
        </div>
      </div>
      <div className="cup-cost-list">
        {computed.map(
          ({ item, included, linkedCost, cost, priceKey, directEntry, includeKey: key }) => (
            <article
              className={`cup-cost-row${included ? "" : " cup-cost-row--excluded"}`}
              key={`${item.kind}-${item.id}`}
            >
              <div className="cup-cost-row__top">
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.quantity} {item.unit}
                    {item.kind === "service" ? " · dịch vụ" : ""}
                  </span>
                </div>
                <button
                  aria-pressed={included}
                  className="toggle-button"
                  type="button"
                  onClick={() => onIncludedChange(key, !included)}
                >
                  {included ? (
                    <ToggleRight aria-hidden size={30} weight="fill" />
                  ) : (
                    <ToggleLeft aria-hidden size={30} />
                  )}
                  <span className="sr-only">
                    {included ? "Đang tính" : "Đang bỏ"} {item.name}
                  </span>
                </button>
              </div>
              {included ? (
                <div className="cup-cost-row__bottom">
                  {linkedCost === null ? (
                    <div className="unit-price-input">
                      <span className="field-label">Đơn giá / {item.unit}</span>
                      <NumberField
                        label={`Đơn giá ${item.name}`}
                        placeholder="0"
                        suffix="đ"
                        value={directEntry?.price ?? null}
                        onChange={(price) =>
                          onPriceChange(priceKey, {
                            packQuantity: 1,
                            packUnit: item.unit,
                            price,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <span className="linked-badge">
                      <LinkSimple aria-hidden size={16} /> Từ mẻ nguyên liệu
                    </span>
                  )}
                  <strong className={cost === null ? "line-total--missing" : ""}>
                    {cost === null ? "Chưa có giá" : `${formatVnd(cost)} đ`}
                  </strong>
                </div>
              ) : (
                <span className="excluded-label">Không tính vào tổng</span>
              )}
            </article>
          ),
        )}
      </div>
      <p className="source-note source-note--card">
        Nguồn định lượng: {product.source.file} · mục “{product.source.section}”. Đá và bao bì là
        chi phí bổ sung theo ly, do người dùng tự nhập.
      </p>
      <CostHistory
        entries={history}
        kind="cup"
        productName={product.name}
        onSave={saveCurrentCost}
      />
      <section className="result-card" aria-live="polite">
        <div className="result-card__status">
          {missingCount > 0 ? (
            <WarningCircle aria-hidden size={22} />
          ) : (
            <CheckCircle aria-hidden size={22} />
          )}
          <span>
            {missingCount > 0 ? `Còn ${missingCount} mục chưa có giá` : "Đã đủ giá đang chọn"}
          </span>
        </div>
        <div className="result-card__line result-card__line--primary">
          <span>Tổng cost 1 ly</span>
          <strong>{missingCount > 0 ? `${formatVnd(total)} đ*` : `${formatVnd(total)} đ`}</strong>
        </div>
        {missingCount > 0 ? (
          <small>* Tổng tạm tính, chưa bao gồm các mục còn thiếu giá.</small>
        ) : null}
      </section>
    </main>
  );
};
