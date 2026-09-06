import { ClockCounterClockwise, CookingPot, Receipt } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { HistoryDisclosure, HistoryStatus } from "../components/cost-history";
import { HistoryDetailDialog } from "../components/history-detail-dialog";
import { ScreenHeader } from "../components/screen-header";
import { formatVnd } from "../domain/cost";
import type { CostHistoryEntry } from "../state/use-cost-data";

interface HistoryScreenProps {
  readonly history: readonly CostHistoryEntry[];
  readonly onOpenBatch: () => void;
  readonly onOpenCup: () => void;
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
    const subjectKey = `${entry.kind}:${entry.productId}`;
    if (entry.missingCount > 0) {
      differences.set(entry.id, null);
      continue;
    }
    const previous = previousByProduct.get(subjectKey);
    differences.set(entry.id, previous === undefined ? null : entry.total - previous);
    previousByProduct.set(subjectKey, entry.total);
  }
  return differences;
};

export const HistoryScreen = ({ history, onOpenBatch, onOpenCup }: HistoryScreenProps) => {
  const [productFilter, setProductFilter] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<CostHistoryEntry | null>(null);
  const products = useMemo(
    () =>
      [
        ...new Map(
          history.map((entry) => [
            `${entry.kind}:${entry.productId}`,
            {
              kind: entry.kind,
              name: entry.productName,
            },
          ]),
        ).entries(),
      ].sort((left, right) => left[1].name.localeCompare(right[1].name, "vi")),
    [history],
  );
  const differences = useMemo(() => buildDifferences(history), [history]);
  const visibleEntries =
    productFilter === "all"
      ? history
      : history.filter((entry) => `${entry.kind}:${entry.productId}` === productFilter);

  return (
    <main className="screen history-screen">
      <ScreenHeader
        description="Xem lại cost mẻ và cost một ly đã chốt, kèm mức tăng giảm so với lần trước."
        eyebrow="Theo dõi thời giá"
        title="Lịch sử cost"
      />
      <section aria-label="Tổng quan lịch sử" className="history-overview">
        <div>
          <span>Lần đã lưu</span>
          <strong>{history.length}</strong>
        </div>
        <div>
          <span>Mục đã theo dõi</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>
            {history[0]?.missingCount !== undefined && history[0].missingCount > 0
              ? "Mới nhất · tạm tính"
              : "Mới nhất"}
          </span>
          <strong>{history[0] === undefined ? "—" : formatVnd(history[0].total)}</strong>
        </div>
      </section>
      {history.length === 0 ? (
        <section className="empty-state history-empty-state">
          <ClockCounterClockwise aria-hidden size={36} />
          <h2>Chưa có lịch sử cost</h2>
          <p>Hoàn tất một mẻ hoặc một ly rồi lưu để bắt đầu theo dõi.</p>
          <div className="history-empty-state__actions">
            <button className="primary-button" type="button" onClick={onOpenBatch}>
              <CookingPot aria-hidden size={19} /> Tính cost mẻ
            </button>
            <button className="text-button" type="button" onClick={onOpenCup}>
              <Receipt aria-hidden size={19} /> Tính cost một ly
            </button>
          </div>
        </section>
      ) : (
        <>
          <label className="select-card history-filter">
            <span>Lọc theo mục</span>
            <select
              aria-label="Lọc lịch sử theo mục"
              value={productFilter}
              onChange={(event) => setProductFilter(event.currentTarget.value)}
            >
              <option value="all">Tất cả mục</option>
              {products.map(([id, product]) => (
                <option key={id} value={id}>
                  {product.kind === "batch" ? "Mẻ" : "Một ly"} · {product.name}
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
              <button
                aria-label={`Xem đầy đủ ${entry.kind === "batch" ? "cost mẻ" : "cost một ly"} ${entry.productName}, ${formatVnd(entry.total)} đồng`}
                aria-haspopup="dialog"
                className="history-log-entry"
                key={entry.id}
                type="button"
                onClick={() => setSelectedEntry(entry)}
              >
                <span className="history-log-entry__identity">
                  <strong>{entry.productName}</strong>
                  <small>
                    {entry.kind === "batch" ? "Mẻ nguyên liệu" : "Một ly"} ·{" "}
                    {formatHistoryDate(entry.savedAt)}
                  </small>
                </span>
                <span className="history-log-entry__cost">
                  <strong>{formatVnd(entry.total)} đ</strong>
                  <HistoryStatus difference={differences.get(entry.id) ?? null} entry={entry} />
                  <HistoryDisclosure />
                </span>
              </button>
            ))}
          </section>
          {selectedEntry === null ? null : (
            <HistoryDetailDialog entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
          )}
        </>
      )}
    </main>
  );
};
