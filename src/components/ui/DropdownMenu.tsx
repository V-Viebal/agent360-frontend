import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface DropdownMenuItemProps {
  icon?: React.ReactNode;
  label: string;
  badge?: string;
  badgeColor?: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: "default" | "danger" | "warning";
  disabled?: boolean;
}

export interface DropdownMenuSectionProps {
  label?: string;
  children: React.ReactNode;
}

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  width?: string;
  anchorRef?: React.RefObject<HTMLElement | null>;
  placement?: "bottom" | "top";
}

/**
 * Standard Skyer Dropdown Container (Single Source of Truth for Menu Aesthetics)
 * Guarantees 100% solid, non-translucent card surface matching DESIGN.md and CustomSelect
 */
export function DropdownMenu({
  isOpen,
  onClose,
  children,
  align = "right",
  className = "",
  width = "w-56",
  anchorRef,
  placement = "bottom",
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = () => {
    if (!anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const menuEl = menuRef.current;
    const menuWidth = menuEl ? menuEl.offsetWidth : 240;
    const menuHeight = menuEl ? menuEl.offsetHeight : 220;

    let top = placement === "top" ? rect.top - menuHeight - 6 : rect.bottom + 6;
    let left = align === "left" ? rect.left : rect.right - menuWidth;

    // Viewport bounds correction
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - menuWidth - 8);
    }
    if (top < 8) top = 8;

    setCoords({
      top: top + window.scrollY,
      left: left + window.scrollX,
    });
  };

  useLayoutEffect(() => {
    if (isOpen && anchorRef?.current) {
      updatePosition();
    }
  }, [isOpen, align, placement]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        (!anchorRef?.current || !anchorRef.current.contains(target))
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleScrollOrResize = (e: Event) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
      onClose();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const content = (
    <div
      ref={menuRef}
      role="menu"
      onClick={(e) => e.stopPropagation()}
      style={
        coords
          ? {
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 99999,
            }
          : undefined
      }
      className={`${
        coords
          ? ""
          : `absolute ${align === "left" ? "left-0" : "right-0"} ${
              placement === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
            } z-[100]`
      } ${width} rounded-xl bg-white dark:bg-[#14141c] border border-slate-200 dark:border-[#262634] p-1.5 shadow-lg backdrop-blur-xl text-xs font-sans space-y-0.5 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5 dark:ring-white/10 select-none ${className}`}
    >
      {children}
    </div>
  );

  return anchorRef ? createPortal(content, document.body) : content;
}

export function DropdownMenuItem({
  icon,
  label,
  badge,
  badgeColor = "text-[#ff7a00]",
  onClick,
  variant = "default",
  disabled = false,
}: DropdownMenuItemProps) {
  const isDanger = variant === "danger";

  return (
    <button
      role="menuitem"
      type="button"
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return;
        onClick(e);
      }}
      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2.5 cursor-pointer transition-colors font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed ${
        isDanger
          ? "text-red-500 hover:text-red-400 hover:bg-red-500/10"
          : "text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#20202c]"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 truncate">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{label}</span>
      </div>

      {badge && (
        <span className={`text-[10px] font-mono shrink-0 ml-1.5 ${badgeColor}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

export function DropdownMenuSection({ label, children }: DropdownMenuSectionProps) {
  return (
    <div className="border-t border-neutral-100 dark:border-[#222230] my-1 pt-1 first:border-0 first:pt-0 first:my-0">
      {label && (
        <div className="px-2.5 py-0.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
