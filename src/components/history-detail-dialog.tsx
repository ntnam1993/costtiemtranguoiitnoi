import { X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { formatVnd } from "../domain/cost";
import type { CostHistoryEntry } from "../state/use-cost-data";

interface HistoryDetailDialogProps {
  readonly entry: CostHistoryEntry;
  readonly onClose: () => void;
}

const formatHistoryDate = (value: string): string =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const formatQuantity = (value: number): string =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 3 }).format(value);

const historyKindLabels = {
  batch: "Mẻ nguyên liệu",
  cup: "Một ly",
} as const satisfies Record<CostHistoryEntry["kind"], string>;

export const HistoryDetailDialog = ({ entry, onClose }: HistoryDetailDialogProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = dialog.current;
    const previouslyFocused = document.activeElement;
    if (element === null) return;

    element.showModal();
    closeButton.current?.focus();
    return () => {
      if (element.open) element.close();
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label={`Chi tiết cost ${entry.productName}`}
      className="history-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="history-dialog__sheet">
        <div className="dialog-handle" aria-hidden />
        <div className="dialog-heading history-dialog__heading">
          <div>
            <span className="eyebrow">Chi tiết lần lưu</span>
            <h2>{entry.productName}</h2>
            <span
              className={
                entry.missingCount > 0
                  ? "history-dialog__status history-dialog__status--incomplete"
                  : "history-dialog__status"
              }
            >
              {entry.missingCount > 0
                ? `Tạm tính · Chưa đủ ${entry.missingCount} mục`
                : "Đã đủ dữ liệu"}
            </span>
          </div>
          <button
            ref={closeButton}
            aria-label="Đóng chi tiết cost"
            className="icon-button"
            type="button"
            onClick={onClose}
          >
            <X aria-hidden size={22} />
          </button>
        </div>

        <div className="history-details">
          <div className="history-details__heading">
            <h3>Thông tin lần lưu</h3>
          </div>
          <dl className="history-details__metadata">
            <div>
              <dt>Loại cost</dt>
              <dd>{historyKindLabels[entry.kind]}</dd>
            </div>
            <div>
              <dt>Thời gian lưu</dt>
              <dd>{formatHistoryDate(entry.savedAt)}</dd>
            </div>
            <div>
              <dt>{entry.missingCount > 0 ? "Tổng tạm tính" : "Tổng cost"}</dt>
              <dd>{formatVnd(entry.total)} đ</dd>
            </div>
            {entry.kind === "batch" ? (
              <>
                <div>
                  <dt>Thành phẩm dùng được</dt>
                  <dd>
                    {entry.yieldQuantity === null
                      ? "Chưa nhập"
                      : `${formatQuantity(entry.yieldQuantity)} ${entry.yieldUnit}`}
                  </dd>
                </div>
                <div>
                  <dt>Cost / {entry.yieldUnit}</dt>
                  <dd>
                    {entry.unitCost === null ? "Chưa tính" : `${formatVnd(entry.unitCost)} đ`}
                  </dd>
                </div>
              </>
            ) : null}
          </dl>

          <div className="history-details__heading history-details__heading--breakdown">
            <h3>Chi tiết chi phí</h3>
            <span>
              {entry.lines.length} thành phần{entry.missingCount > 0 ? " đã có giá" : ""}
            </span>
          </div>
          <div className="history-breakdown">
            {entry.lines.length === 0 ? (
              <p>Chưa có thành phần nào đủ dữ liệu để tính.</p>
            ) : (
              entry.lines.map((item) => (
                <span key={item.name}>
                  {item.name} <strong>{formatVnd(item.cost)} đ</strong>
                </span>
              ))
            )}
          </div>
        </div>
      </section>
    </dialog>
  );
};
