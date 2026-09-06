import { ArrowRight, CookingPot, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScreenHeader } from "../components/screen-header";
import { menuProducts } from "../data/menu-products";
import type { MenuProduct } from "../domain/models";

const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

interface RecipeDialogProps {
  readonly product: MenuProduct;
  readonly onClose: () => void;
  readonly onCalculateBatch: (batchId: string) => void;
  readonly onCalculateCup: () => void;
}

const RecipeDialog = ({
  product,
  onClose,
  onCalculateBatch,
  onCalculateCup,
}: RecipeDialogProps) => {
  const closeButton = useRef<HTMLButtonElement>(null);
  const primaryPreparationId = product.lines.find(
    (item) => item.preparationId !== undefined,
  )?.preparationId;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop">
      <section
        aria-labelledby="recipe-dialog-title"
        aria-modal="true"
        className="recipe-dialog"
        role="dialog"
      >
        <div className="dialog-handle" />
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">Công thức #{String(product.number).padStart(2, "0")}</span>
            <h2 id="recipe-dialog-title">{product.name}</h2>
          </div>
          <button
            ref={closeButton}
            aria-label="Đóng chi tiết"
            className="icon-button"
            type="button"
            onClick={onClose}
          >
            <X aria-hidden size={22} weight="regular" />
          </button>
        </div>
        <div className="recipe-lines">
          {product.lines.map((item) => (
            <div className="recipe-line" key={item.id}>
              <span>{item.name}</span>
              <strong>
                {item.quantity} {item.unit}
              </strong>
            </div>
          ))}
        </div>
        <div className="detail-block">
          <h3>Cách pha</h3>
          <p>{product.method}</p>
        </div>
        <div className="detail-block detail-block--tint">
          <h3>Topping</h3>
          <p>{product.topping}</p>
        </div>
        <p className="source-note">
          Nguồn: {product.source.file} · mục “{product.source.section}”
        </p>
        <div className="recipe-dialog__actions">
          <button className="primary-button" type="button" onClick={onCalculateCup}>
            Tính cost một ly <ArrowRight aria-hidden size={20} />
          </button>
          {primaryPreparationId === undefined ? null : (
            <button
              className="text-button recipe-dialog__batch-button"
              type="button"
              onClick={() => onCalculateBatch(primaryPreparationId)}
            >
              <CookingPot aria-hidden size={20} /> Tính cost mẻ nguyên liệu
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

interface MenuScreenProps {
  readonly onCalculateBatch: (batchId: string) => void;
  readonly onCalculateCup: (productId: string) => void;
}

export const MenuScreen = ({ onCalculateBatch, onCalculateCup }: MenuScreenProps) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MenuProduct | null>(null);
  const filtered = useMemo(() => {
    const normalized = normalize(query.trim());
    return normalized === ""
      ? menuProducts
      : menuProducts.filter((item) => normalize(item.name).includes(normalized));
  }, [query]);

  return (
    <main className="screen menu-screen">
      <ScreenHeader
        description="27 công thức từ tài liệu pha chế, sẵn sàng để tra nhanh tại quầy."
        eyebrow="Sổ công thức"
        title="Thực đơn trà trái cây"
      />
      <label className="search-field">
        <MagnifyingGlass aria-hidden size={21} />
        <span className="sr-only">Tìm món</span>
        <input
          placeholder="Tìm món trà trái cây…"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </label>
      <div className="section-row">
        <h2>{query === "" ? "Tất cả món" : "Kết quả"}</h2>
        <span>{filtered.length} món</span>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <h2>Không tìm thấy món</h2>
          <p>Thử tên khác như “mãng cầu”, “dâu tằm” hoặc “atiso”.</p>
        </div>
      ) : (
        <div className="menu-grid">
          {filtered.map((item) => (
            <button
              className="menu-card"
              key={item.id}
              style={{ borderLeftColor: item.accent }}
              type="button"
              onClick={() => setSelected(item)}
            >
              <span className="menu-number">{String(item.number).padStart(2, "0")}</span>
              <span className="fruit-mark" style={{ backgroundColor: item.accent }} aria-hidden />
              <span className="menu-copy">
                <strong>{item.name}</strong>
                <small>{item.lines.length} thành phần</small>
              </span>
              <ArrowRight aria-hidden size={19} />
            </button>
          ))}
        </div>
      )}
      {selected === null ? null : (
        <RecipeDialog
          product={selected}
          onClose={() => setSelected(null)}
          onCalculateBatch={onCalculateBatch}
          onCalculateCup={() => onCalculateCup(selected.id)}
        />
      )}
    </main>
  );
};
