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
      className={"flex items-center gap-2 bg-slate-100/80 dark:bg-[#14141c] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-neutral-300 transition-colors " + className}
    >
      <Search size={13} className="text-slate-400 dark:text-neutral-500 shrink-0" />
      <input
        aria-label={placeholder}
        data-ux-target-min="16"
        type="text"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-0 focus-visible:outline-none w-full font-sans"
      />
      {value && (
        <button
          data-ux-target-min="24"
          type="button"
          onClick={() => onChange("")}
          className="text-slate-400 hover:text-slate-700 dark:text-neutral-500 dark:hover:text-white p-0.5 cursor-pointer focus:outline-none"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
