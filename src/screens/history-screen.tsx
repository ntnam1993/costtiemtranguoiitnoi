import { ClockCounterClockwise, Receipt } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { HistoryDifference } from "../components/history-difference";
import { ScreenHeader } from "../components/screen-header";
import { formatVnd } from "../domain/cost";
import type { CostHistoryEntry } from "../state/use-cost-data";

interface HistoryScreenProps {
  readonly history: readonly CostHistoryEntry[];
  readonly onOpenCalculator: () => void;
}

const formatHistoryDate = (value: string): string =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const buildDifferences = (
  entries: readonly CostHistoryEntry[],
): ReadonlyMap<string, number | null> => {
  const previousByProduct = new Map<string, number>();
  const differences = new Map<string, number | null>();
  for (const entry of [...entries].reverse()) {
    const previous = previousByProduct.get(entry.productId);
    differences.set(entry.id, previous === undefined ? null : entry.total - previous);
    previousByProduct.set(entry.productId, entry.total);
  }
  return differences;
};

export const HistoryScreen = ({ history, onOpenCalculator }: HistoryScreenProps) => {
  const [productFilter, setProductFilter] = useState("all");
  const products = useMemo(
    () =>
      [...new Map(history.map((entry) => [entry.productId, entry.productName])).entries()].sort(
        (left, right) => left[1].localeCompare(right[1], "vi"),
      ),
    [history],
  );
  const differences = useMemo(() => buildDifferences(history), [history]);
  const visibleEntries =
    productFilter === "all"
      ? history
      : history.filter((entry) => entry.productId === productFilter);

  return (
    <main className="screen history-screen">
      <ScreenHeader
        description="Xem lại cost đã chốt theo ngày và biết mức tăng giảm so với lần trước của từng món."
        eyebrow="Theo dõi thời giá"
        title="Lịch sử cost"
      />
      <section aria-label="Tổng quan lịch sử" className="history-overview">
        <div>
          <span>Lần đã lưu</span>
          <strong>{history.length}</strong>
        </div>
        <div>
          <span>Món đã theo dõi</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>Mới nhất</span>
          <strong>{history[0] === undefined ? "—" : formatVnd(history[0].total)}</strong>
        </div>
      </section>
      {history.length === 0 ? (
        <section className="empty-state history-empty-state">
          <ClockCounterClockwise aria-hidden size={36} />
          <h2>Chưa có lịch sử cost</h2>
          <p>Tính đủ giá một ly và bấm “Lưu cost hiện tại” để bắt đầu theo dõi.</p>
          <button className="primary-button" type="button" onClick={onOpenCalculator}>
            <Receipt aria-hidden size={19} /> Tính cost một ly
          </button>
        </section>
      ) : (
        <>
          <label className="select-card history-filter">
            <span>Lọc theo món</span>
            <select
              aria-label="Lọc lịch sử theo món"
              value={productFilter}
              onChange={(event) => setProductFilter(event.currentTarget.value)}
            >
              <option value="all">Tất cả món</option>
              {products.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <div className="section-row">
            <div>
              <h2>Các lần chốt cost</h2>
              <span>{visibleEntries.length} kết quả · mới nhất trước</span>
            </div>
          </div>
          <section aria-label="Các lần chốt cost" className="history-timeline">
            {visibleEntries.map((entry) => (
              <details className="history-log-entry" key={entry.id}>
                <summary>
                  <div className="history-log-entry__identity">
                    <strong>{entry.productName}</strong>
                    <small>{formatHistoryDate(entry.savedAt)}</small>
                  </div>
                  <div className="history-log-entry__cost">
                    <strong>{formatVnd(entry.total)} đ</strong>
                    <HistoryDifference difference={differences.get(entry.id) ?? null} />
                  </div>
                </summary>
                <div className="history-breakdown">
                  {entry.lines.map((line) => (
                    <span key={line.name}>
                      {line.name} <strong>{formatVnd(line.cost)} đ</strong>
                    </span>
                  ))}
                </div>
              </details>
            ))}
          </section>
        </>
      )}
    </main>
  );
};
