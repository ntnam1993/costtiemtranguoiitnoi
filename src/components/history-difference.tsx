import { TrendDown, TrendUp } from "@phosphor-icons/react";
import { formatVnd } from "../domain/cost";

interface HistoryDifferenceProps {
  readonly difference: number | null;
}

export const HistoryDifference = ({ difference }: HistoryDifferenceProps) => {
  if (difference === null) return <em>Lần đầu</em>;
  if (difference < 0) {
    return (
      <em className="history-difference history-difference--down">
        <TrendDown aria-hidden size={16} /> Giảm {formatVnd(Math.abs(difference))} đ
      </em>
    );
  }
  if (difference > 0) {
    return (
      <em className="history-difference history-difference--up">
        <TrendUp aria-hidden size={16} /> Tăng {formatVnd(difference)} đ
      </em>
    );
  }
  return <em>Không đổi</em>;
};
