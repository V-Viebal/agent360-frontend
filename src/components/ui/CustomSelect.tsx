import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  description?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  triggerClassName = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 bg-[#181820] hover:bg-[#20202a] text-neutral-200 border border-[#2a2a38] hover:border-[#3a3a4c] rounded-xl px-3 py-1.5 text-xs font-mono transition-all cursor-pointer shadow-sm ${triggerClassName}`}
      >
        <span className="truncate text-[#ff7a00] font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={13}
          className={`text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-48 rounded-xl bg-[#14141c] border border-[#262634] p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
          <div className="space-y-0.5 max-h-56 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#222230] text-[#ff7a00] font-semibold"
                      : "text-neutral-300 hover:bg-[#1a1a24] hover:text-white"
                  }`}
                >
                  <div className="flex flex-col truncate">
                    <span className="truncate">{opt.label}</span>
                    {opt.description && (
                      <span className="text-[10px] text-neutral-500 font-normal truncate">
                        {opt.description}
                      </span>
                    )}
                  </div>
                  {opt.badge && (
                    <span className="text-[9px] font-mono text-[#ff7a00] bg-[#ff7a00]/10 px-1.5 py-0.2 rounded ml-1 shrink-0">
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && <Check size={12} className="text-[#ff7a00] ml-1 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
