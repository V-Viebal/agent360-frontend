import React from "react";
import { playMicroClick } from "../../services/notificationService";

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className = "",
}: ToggleSwitchProps) {
  const isSm = size === "sm";

  const handleToggle = () => {
    if (disabled) return;
    playMicroClick();
    onChange(!checked);
  };

  return (
    <div
      onClick={handleToggle}
      className={`flex items-center justify-between gap-3 cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {(label || description) && (
        <div className="flex flex-col min-w-0 pr-2">
          {label && <span className="text-xs font-medium text-slate-800 dark:text-neutral-200 truncate">{label}</span>}
          {description && <span className="text-[10px] text-slate-500 dark:text-neutral-400 font-normal truncate">{description}</span>}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        data-ux-target-min="24"
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f8a87c] focus-visible:ring-opacity-75 ${
          isSm ? "h-4 w-7" : "h-5 w-9"
        } ${checked ? "bg-[#f8a87c]" : "bg-neutral-300 dark:bg-[#282836]"}`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            isSm ? "h-3 w-3" : "h-4 w-4"
          } ${
            checked
              ? isSm
                ? "translate-x-3"
                : "translate-x-4"
              : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
