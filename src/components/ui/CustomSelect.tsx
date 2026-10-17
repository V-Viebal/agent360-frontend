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
      {/* Trigger Button with Tooltip */}
      <div className="relative group/select-trigger inline-block max-w-full">
        <button aria-label={selectedOption ? `${selectedOption.label}${selectedOption.description ? ` — ${selectedOption.description}` : ""}` : placeholder} data-ux-target-min="24"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title={selectedOption ? `${selectedOption.label}${selectedOption.description ? ` — ${selectedOption.description}` : ""}` : placeholder}
          className={`flex items-center justify-between gap-1.5 bg-[#181820] hover:bg-[#20202a] text-neutral-200 border border-[#2a2a38] hover:border-[#3a3a4c] rounded-xl px-2.5 py-1.5 text-xs font-mono transition-all cursor-pointer shadow-sm min-w-0 max-w-full ${triggerClassName}`}
        >
          <span className="truncate text-[#ff7a00] font-medium min-w-0 flex-1 text-left">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={13}
            className={`text-neutral-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Floating Custom Tooltip on Hover with Top Z-Index */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] z-[100] hidden group-hover/select-trigger:block whitespace-nowrap rounded-lg bg-[#0e1017] border border-white/15 px-2.5 py-1.5 text-[11px] font-sans text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-[#ff7a00]">{selectedOption ? selectedOption.label : placeholder}</span>
            {selectedOption?.badge && (
              <span className="text-[9px] font-mono text-neutral-400 bg-white/10 px-1 py-0.2 rounded">
                {selectedOption.badge}
              </span>
            )}
          </div>
          {selectedOption?.description && (
            <div className="text-[10px] text-neutral-400 font-normal">
              {selectedOption.description}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-[#0e1017]" />
        </div>
      </div>

      {/* Dropdown Menu Always On Top */}
      {isOpen && (
        <div className="absolute right-0 z-[100] mt-1.5 w-52 rounded-xl bg-[#14141c] border border-[#262634] p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
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
