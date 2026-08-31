import { ClockCounterClockwise, FloppyDisk, TrendDown, TrendUp } from "@phosphor-icons/react";
import { formatVnd } from "../domain/cost";
import type { CostHistoryEntry } from "../state/use-cost-data";

interface CostHistoryProps {
  readonly productName: string;
  readonly entries: readonly CostHistoryEntry[];
  readonly canSave: boolean;
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

export const CostHistory = ({ productName, entries, canSave, onSave }: CostHistoryProps) => (
  <section aria-labelledby="cost-history-heading" className="history-card" aria-live="polite">
    <div className="history-card__heading">
      <div>
        <span className="eyebrow">So sánh theo thời giá</span>
        <h2 id="cost-history-heading">Lịch sử cost · {productName}</h2>
      </div>
      <ClockCounterClockwise aria-hidden size={26} />
    </div>
    <button className="save-history-button" disabled={!canSave} type="button" onClick={onSave}>
      <FloppyDisk aria-hidden size={19} />
      {canSave ? "Lưu cost hiện tại" : "Nhập đủ giá để lưu"}
    </button>
    {entries.length === 0 ? (
      <p className="history-empty">
        Chưa có lần chốt cost nào. Mỗi lần lưu sẽ giữ ngày giờ và chi tiết thành phần trên thiết bị
        này.
      </p>
    ) : (
      <div className="history-list">
        {entries.slice(0, 8).map((entry, index) => {
          const previous = entries[index + 1];
          const difference = previous === undefined ? null : entry.total - previous.total;
          return (
            <details className="history-entry" key={entry.id}>
              <summary>
                <span>
                  <strong>{formatVnd(entry.total)} đ</strong>
                  <small>{formatHistoryDate(entry.savedAt)}</small>
                </span>
                {difference === null ? (
                  <em>Lần đầu</em>
                ) : difference < 0 ? (
                  <em className="history-difference history-difference--down">
                    <TrendDown aria-hidden size={16} /> Giảm {formatVnd(Math.abs(difference))} đ
                  </em>
                ) : difference > 0 ? (
                  <em className="history-difference history-difference--up">
                    <TrendUp aria-hidden size={16} /> Tăng {formatVnd(difference)} đ
                  </em>
                ) : (
                  <em>Không đổi</em>
                )}
              </summary>
              <div className="history-breakdown">
                {entry.lines.map((item) => (
                  <span key={item.name}>
                    {item.name} <strong>{formatVnd(item.cost)} đ</strong>
                  </span>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    )}
  </section>
);
