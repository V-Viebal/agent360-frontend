import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Search } from "lucide-react";
import { playMicroClick } from "../../services/notificationService";

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  description?: string;
}

export interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  iconOnly?: boolean;
  dropdownAlign?: "left" | "right";
  showTooltip?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  "aria-label"?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  triggerClassName = "",
  dropdownClassName = "",
  iconOnly = false,
  dropdownAlign = "right",
  showTooltip = false,
  disabled = false,
  searchable = false,
  "aria-label": ariaLabel,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Calculate dropdown positioning using Floating logic
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = Math.max(rect.width, 240);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Default to open below; if space is tight and space above is larger, flip to open above
    const openAbove = spaceBelow < 260 && spaceAbove > spaceBelow;
    const top = openAbove ? Math.max(8, rect.top - 268) : rect.bottom + 6;

    let left = dropdownAlign === "left" ? rect.left : rect.right - dropdownWidth;
    // Boundary check so it never goes off-screen
    if (left < 8) left = 8;
    if (left + dropdownWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - dropdownWidth - 8);
    }

    setDropdownPosition({
      top: top + window.scrollY,
      left: left + window.scrollX,
      width: dropdownWidth,
    });
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, dropdownAlign]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        playMicroClick();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        playMicroClick();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          playMicroClick();
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        return;
      }

      // Accessibility focus trap in searchable input
      if (e.key === "Tab") {
        if (searchable && searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current.focus();
        } else {
          e.preventDefault();
        }
      }
    };

    const handleWindowBlur = () => {
      setIsOpen(false);
    };

    const handleScrollOrResize = (e: Event) => {
      // If scroll happens outside the dropdown container, dismiss
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, highlightedIndex, options]);

  useEffect(() => {
    if (isOpen) {
      const idx = filteredOptions.findIndex((o) => o.value === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
      if (searchable) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    } else {
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listContainerRef.current) {
      const items = listContainerRef.current.children;
      const target = items[highlightedIndex] as HTMLElement;
      if (target && typeof target.scrollIntoView === "function") {
        target.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  const filteredOptions = searchQuery.trim()
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (o.description && o.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (o.badge && o.badge.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;

  const isFullWidth = className.includes("w-full");

  return (
    <div ref={containerRef} className={`relative ${isFullWidth ? "block w-full" : "inline-block"} text-left select-none ${className}`}>
      {/* Trigger Button with Tooltip */}
      <div className={`relative group/select-trigger ${isFullWidth ? "block w-full" : "inline-block max-w-full"}`}>
        <button
          ref={triggerRef}
          aria-label={ariaLabel || (selectedOption ? `${selectedOption.label}${selectedOption.description ? ` — ${selectedOption.description}` : ""}` : placeholder)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          data-ux-target-min="24"
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          title={selectedOption ? `${selectedOption.label}${selectedOption.description ? ` — ${selectedOption.description}` : ""}` : placeholder}
          className={
            iconOnly
              ? `flex items-center justify-center h-7 w-7 rounded-lg bg-[#161620] hover:bg-[#20202c] border border-[#262634] hover:border-[#ff7a00]/40 text-neutral-400 hover:text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${triggerClassName}`
              : triggerClassName
              ? `flex items-center justify-between gap-1.5 transition-all cursor-pointer min-w-0 max-w-full disabled:opacity-50 disabled:cursor-not-allowed ${triggerClassName}`
              : `flex items-center justify-between gap-1.5 bg-white dark:bg-[#181820] hover:bg-slate-50 dark:hover:bg-[#20202a] text-slate-800 dark:text-neutral-200 border border-slate-200 dark:border-[#2a2a38] hover:border-slate-300 dark:hover:border-[#3a3a4c] rounded-lg px-2 py-1 text-[11px] font-sans transition-all cursor-pointer shadow-xs min-w-0 max-w-full disabled:opacity-50 disabled:cursor-not-allowed`
          }
        >
          {iconOnly ? (
            <ChevronDown
              size={12}
              className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? "rotate-180 text-[#ff7a00]" : "text-neutral-400 hover:text-white"
              }`}
            />
          ) : (
            <>
              <span className="truncate text-inherit font-medium min-w-0 flex-1 text-left group-hover/select-trigger:text-slate-900 dark:group-hover/select-trigger:text-white transition-colors relative">
                <span className="relative pb-0.5 border-b border-transparent group-hover/select-trigger:border-neutral-500/50 transition-colors">
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              </span>
              <ChevronDown
                size={13}
                className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 ${
                  isOpen ? "rotate-180 text-[#ff7a00]" : "text-neutral-400 group-hover/select-trigger:text-neutral-200"
                }`}
              />
            </>
          )}
        </button>

        {/* Floating Tooltip on Hover */}
        {showTooltip && (
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] z-[100] hidden group-hover/select-trigger:block whitespace-nowrap rounded-lg bg-white dark:bg-[#0e1017] border border-slate-200 dark:border-white/15 px-2.5 py-1.5 text-[11px] font-sans text-slate-900 dark:text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
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
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-[#0e1017]" />
          </div>
        )}
      </div>

      {/* Dropdown Menu Portaled to Document Body (Never clipped by overflow-hidden containers) */}
      {isOpen &&
        dropdownPosition &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            aria-label={ariaLabel || placeholder}
            style={{
              position: "absolute",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 99999,
            }}
            className={`rounded-xl bg-white dark:bg-[#14141c] border border-slate-200 dark:border-[#262634] p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 ${dropdownClassName}`}
          >
            {searchable && (
              <div className="p-1 mb-1 border-b border-slate-200 dark:border-[#22222e] flex items-center gap-1.5 px-2 bg-slate-50 dark:bg-[#101016] rounded-lg text-xs font-mono">
                <Search size={12} className="text-neutral-500 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none py-1 text-xs"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div ref={listContainerRef} className="space-y-0.5 max-h-56 overflow-y-auto scrollbar-none">
              {filteredOptions.length === 0 ? (
                <div className="py-3 text-center text-[11px] font-mono text-neutral-500">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isHighlighted = idx === highlightedIndex;
                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        playMicroClick();
                        onChange(opt.value);
                        setIsOpen(false);
                        triggerRef.current?.focus();
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`flex items-center justify-between px-2 py-1 rounded-md text-[11px] cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-amber-500/10 dark:bg-[#222230] text-[#ff7a00] font-semibold"
                          : isHighlighted
                          ? "bg-slate-100 dark:bg-[#1c1c28] text-slate-900 dark:text-white"
                          : "text-slate-800 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-[#1a1a24] hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex flex-col truncate pr-2">
                        <span className="truncate">{opt.label}</span>
                        {opt.description && (
                          <span className="text-[10px] text-slate-500 dark:text-neutral-400 font-normal truncate">
                            {opt.description}
                          </span>
                        )}
                      </div>
                      {opt.badge && (
                        <span className="text-[9px] font-mono font-medium text-[#ea580c] dark:text-[#ff7a00] bg-orange-500/10 dark:bg-[#ff7a00]/10 px-1.5 py-0.2 rounded ml-1 shrink-0 border border-orange-500/20 dark:border-[#ff7a00]/20">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check size={12} className="text-[#ff7a00] ml-1 shrink-0 stroke-[2.5]" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
