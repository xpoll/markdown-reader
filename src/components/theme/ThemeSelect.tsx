import type { ThemePreference } from "@/lib/theme/types";
import "./theme-select.css";

interface ThemeSelectProps {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
}

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "跟随系统" },
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
  { value: "sepia", label: "护眼纸" },
  { value: "forest", label: "护眼绿" },
];

export function ThemeSelect({ value, onChange }: ThemeSelectProps) {
  return (
    <label className="theme-select">
      <span className="theme-select__label">主题</span>
      <select
        className="theme-select__control"
        value={value}
        onChange={(event) => onChange(event.target.value as ThemePreference)}
        title="外观主题"
        aria-label="外观主题"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
