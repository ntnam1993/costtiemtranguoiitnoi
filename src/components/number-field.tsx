import type { ChangeEvent } from "react";

interface NumberFieldProps {
  readonly label: string;
  readonly value: number | null;
  readonly suffix?: string;
  readonly placeholder?: string;
  readonly invalid?: boolean;
  readonly onChange: (value: number | null) => void;
}

export const NumberField = ({
  label,
  value,
  suffix,
  placeholder = "Nhập số",
  invalid = false,
  onChange,
}: NumberFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.currentTarget.value;
    onChange(raw === "" ? null : Number(raw));
  };

  return (
    <label className={`number-field${invalid ? " number-field--invalid" : ""}`}>
      <span className="sr-only">{label}</span>
      <input
        aria-invalid={invalid}
        inputMode="decimal"
        min="0"
        placeholder={placeholder}
        step="any"
        type="number"
        value={value ?? ""}
        onChange={handleChange}
      />
      {suffix === undefined ? null : <span>{suffix}</span>}
    </label>
  );
};
