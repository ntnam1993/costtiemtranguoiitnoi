import { CookingPot, GearSix, ListMagnifyingGlass, Receipt } from "@phosphor-icons/react";
import { useState } from "react";
import { BatchCostScreen } from "./screens/batch-cost-screen";
import { CupCostScreen } from "./screens/cup-cost-screen";
import { MenuScreen } from "./screens/menu-screen";
import { SettingsScreen } from "./screens/settings-screen";
import { useCostData } from "./state/use-cost-data";

type Tab = "menu" | "batch" | "cup" | "settings";

const navItems = [
  { id: "menu", label: "Thực đơn", icon: ListMagnifyingGlass },
  { id: "batch", label: "Mẻ nguyên liệu", icon: CookingPot },
  { id: "cup", label: "Một ly", icon: Receipt },
  { id: "settings", label: "Cài đặt", icon: GearSix },
] satisfies readonly { readonly id: Tab; readonly label: string; readonly icon: typeof GearSix }[];

export const App = () => {
  const [tab, setTab] = useState<Tab>("menu");
  const [batchId, setBatchId] = useState("nhiet-doi");
  const [productId, setProductId] = useState("nhiet-doi");
  const costData = useCostData();

  const calculateProduct = (id: string) => {
    setProductId(id);
    setTab("cup");
  };

  const resetData = () => {
    if (window.confirm("Xóa toàn bộ giá, sản lượng và lịch sử cost trên thiết bị này?")) {
      costData.reset();
    }
  };

  return (
    <div className="app-shell">
      <div className="brand-bar">
        <img className="brand-mark" src="./pwa-192x192.png" alt="Logo Tiệm Trà Người Ít Nói" />
        <div>
          <strong>costtiemtranguoiitnoi</strong>
          <span>Giá đúng mùa, cost đúng món</span>
        </div>
      </div>
      {tab === "menu" ? <MenuScreen onCalculate={calculateProduct} /> : null}
      {tab === "batch" ? (
        <BatchCostScreen
          data={costData.data}
          selectedId={batchId}
          onPriceChange={costData.setBatchPrice}
          onSelect={setBatchId}
          onYieldChange={costData.setYield}
        />
      ) : null}
      {tab === "cup" ? (
        <CupCostScreen
          data={costData.data}
          selectedId={productId}
          onIncludedChange={costData.setServiceIncluded}
          onPriceChange={costData.setCupPrice}
          onSaveHistory={costData.saveHistory}
          onSelect={setProductId}
        />
      ) : null}
      {tab === "settings" ? <SettingsScreen data={costData.data} onReset={resetData} /> : null}
      <nav aria-label="Điều hướng chính" className="bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.id === tab;
          return (
            <button
              aria-current={active ? "page" : undefined}
              className={active ? "bottom-nav__item bottom-nav__item--active" : "bottom-nav__item"}
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
            >
              <Icon aria-hidden size={23} weight={active ? "fill" : "regular"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
