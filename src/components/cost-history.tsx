import { CaretRight, ClockCounterClockwise, FloppyDisk } from "@phosphor-icons/react";
import { useState } from "react";
import { formatVnd } from "../domain/cost";
import type { CostHistoryEntry } from "../state/use-cost-data";
import { HistoryDetailDialog } from "./history-detail-dialog";
import { HistoryDifference } from "./history-difference";

interface CostHistoryProps {
  readonly kind: "batch" | "cup";
  readonly productName: string;
  readonly entries: readonly CostHistoryEntry[];
  readonly onSave: () => void;
}

const formatHistoryDate = (value: string): string =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const saveButtonLabels = {
  batch: "Lưu cost mẻ hiện tại",
  cup: "Lưu cost hiện tại",
} as const satisfies Record<CostHistoryEntry["kind"], string>;

export const HistoryDisclosure = () => (
  <span className="history-disclosure">
    <span>Xem đầy đủ</span>
    <CaretRight aria-hidden size={14} weight="bold" />
  </span>
);

export const HistoryStatus = ({
  entry,
  difference,
}: {
  readonly entry: CostHistoryEntry;
  readonly difference: number | null;
}) =>
  entry.missingCount > 0 ? (
    <em className="history-completeness--incomplete">Chưa đủ {entry.missingCount} mục</em>
  ) : (
    <HistoryDifference difference={difference} />
  );

export const CostHistory = ({ kind, productName, entries, onSave }: CostHistoryProps) => {
  const [selectedEntry, setSelectedEntry] = useState<CostHistoryEntry | null>(null);

  return (
    <section aria-labelledby="cost-history-heading" className="history-card" aria-live="polite">
      <div className="history-card__heading">
        <div>
          <span className="eyebrow">So sánh theo thời giá</span>
          <h2 id="cost-history-heading">
            {kind === "batch" ? "Lịch sử cost mẻ" : "Lịch sử cost"} · {productName}
          </h2>
        </div>
        <ClockCounterClockwise aria-hidden size={26} />
      </div>
      <button className="save-history-button" type="button" onClick={onSave}>
        <FloppyDisk aria-hidden size={19} />
        {saveButtonLabels[kind]}
      </button>
      {entries.length === 0 ? (
        <p className="history-empty">
          Chưa có lần chốt cost nào. Mỗi lần lưu sẽ giữ ngày giờ và chi tiết thành phần trên thiết
          bị này.
        </p>
      ) : (
        <div className="history-list">
          {entries.slice(0, 8).map((entry, index) => {
            const previous = entries.slice(index + 1).find((item) => item.missingCount === 0);
            const difference =
              entry.missingCount > 0 || previous === undefined
                ? null
                : entry.total - previous.total;
            return (
              <button
                aria-label={`Xem đầy đủ ${kind === "batch" ? "cost mẻ" : "cost một ly"} ${productName}, ${formatVnd(entry.total)} đồng`}
                aria-haspopup="dialog"
                className="history-entry"
                key={entry.id}
                type="button"
                onClick={() => setSelectedEntry(entry)}
              >
                <span>
                  <strong>{formatVnd(entry.total)} đ</strong>
                  <small>{formatHistoryDate(entry.savedAt)}</small>
                </span>
                <span className="history-entry__summary-status">
                  <HistoryStatus difference={difference} entry={entry} />
                  <HistoryDisclosure />
                </span>
              </button>
            );
          })}
        </div>
      )}
      {selectedEntry === null ? null : (
        <HistoryDetailDialog entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
    </section>
  );
};
