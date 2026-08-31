import { ArrowClockwise, CloudSlash, DeviceMobile, Trash } from "@phosphor-icons/react";
import { ScreenHeader } from "../components/screen-header";
import type { StoredCostData } from "../state/use-cost-data";

interface SettingsScreenProps {
  readonly data: StoredCostData;
  readonly onReset: () => void;
}

export const SettingsScreen = ({ data, onReset }: SettingsScreenProps) => {
  const priceCount = Object.keys(data.batchPrices).length + Object.keys(data.cupPrices).length;

  return (
    <main className="screen settings-screen">
      <ScreenHeader
        description="Giá bạn nhập chỉ lưu trên thiết bị này, không gửi lên máy chủ."
        eyebrow="Thiết bị & dữ liệu"
        title="Cài đặt"
      />
      <section className="settings-card settings-card--hero">
        <DeviceMobile aria-hidden size={28} />
        <div>
          <h2>Cài như một ứng dụng</h2>
          <p>Trên iPhone: Chia sẻ → Thêm vào Màn hình chính. App hỗ trợ vùng an toàn của iOS.</p>
        </div>
      </section>
      <section className="settings-card">
        <CloudSlash aria-hidden size={26} />
        <div>
          <h2>Dùng khi mất mạng</h2>
          <p>Sau lần mở đầu tiên, menu, công thức và các màn hình chính được lưu để mở offline.</p>
        </div>
      </section>
      <section className="settings-card">
        <ArrowClockwise aria-hidden size={26} />
        <div>
          <h2>Cập nhật giá theo mùa</h2>
          <p>
            Đang lưu {priceCount} mục giá và {data.history.length} lần chốt cost trên máy. Nhập lại
            bất kỳ lúc nào khi giá trái cây đổi.
          </p>
        </div>
      </section>
      <section className="reset-card">
        <div>
          <h2>Xóa dữ liệu đã lưu</h2>
          <p>
            Công thức gốc vẫn giữ nguyên. Hành động này xóa giá, sản lượng, lựa chọn và toàn bộ lịch
            sử cost trên máy.
          </p>
        </div>
        <button className="danger-button" type="button" onClick={onReset}>
          <Trash aria-hidden size={19} /> Xóa giá và lịch sử
        </button>
      </section>
      <p className="version-note">costtiemtranguoiitnoi · dữ liệu công thức 2026</p>
    </main>
  );
};
