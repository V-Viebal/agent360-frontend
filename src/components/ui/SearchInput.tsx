import React from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  autoFocus = false,
}: SearchInputProps) {
  return (
    <div
      className={`flex items-center gap-2 bg-[#14141c] border border-[#22222e] focus-within:border-neutral-500 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 transition-colors ${className}`}
    >
      <Search size={13} className="text-neutral-500 shrink-0" />
      <input aria-label={placeholder} data-ux-target-min="16"
        type="text"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none text-xs text-white placeholder:text-neutral-500 focus:outline-none w-full font-sans"
      />
      {value && (
        <button data-ux-target-min="24"
          type="button"
          onClick={() => onChange("")}
          className="text-neutral-500 hover:text-white p-0.5 cursor-pointer"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
