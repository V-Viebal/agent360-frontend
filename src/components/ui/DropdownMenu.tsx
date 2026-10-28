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
  anchorPosition?: { x: number; y: number } | null;
  placement?: "bottom" | "top";
}

/**
 * Standard Skyer Dropdown Container (Single Source of Truth for Menu Aesthetics)
 * Guarantees 100% solid, non-translucent card surface matching DESIGN.md and CustomSelect
 * Renders via React Portal to document.body with consistent ultra-high z-index (z-[999999])
 * preventing stacking context collisions, overflow clipping or bleed-through across the whole app.
 */
export function DropdownMenu({
  isOpen,
  onClose,
  children,
  align = "right",
  className = "",
  width = "w-56",
  anchorRef,
  anchorPosition,
  placement = "bottom",
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = () => {
    const menuEl = menuRef.current;
    const menuWidth = menuEl ? menuEl.offsetWidth : (parseInt(width.replace(/[^0-9]/g, ""), 10) * 4 || 240);
    const menuHeight = menuEl ? menuEl.offsetHeight : 220;

    if (anchorPosition) {
      let top = anchorPosition.y + 4;
      let left = anchorPosition.x;

      if (left + menuWidth > window.innerWidth - 8) {
        left = Math.max(8, anchorPosition.x - menuWidth);
      }
      if (top + menuHeight > window.innerHeight - 8) {
        top = Math.max(8, anchorPosition.y - menuHeight - 4);
      }
      if (top < 8) top = 8;
      if (left < 8) left = 8;

      setCoords({
        top: top + window.scrollY,
        left: left + window.scrollX,
      });
      return;
    }

    // 1. Determine target anchor element (either provided anchorRef or parent of container)
    const targetElement = anchorRef?.current || containerRef.current?.parentElement;
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();

    let top = placement === "top" ? rect.top - menuHeight - 6 : rect.bottom + 6;
    let left = align === "left" ? rect.left : rect.right - menuWidth;

    // Viewport bounds correction to prevent clipping off screen
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - menuWidth - 8);
    }
    // Flip to top if bottom overflows viewport
    if (placement === "bottom" && top + menuHeight > window.innerHeight - 8) {
      const flippedTop = rect.top - menuHeight - 6;
      if (flippedTop >= 8) {
        top = flippedTop;
      }
    }
    if (top < 8) top = 8;

    setCoords({
      top: top + window.scrollY,
      left: left + window.scrollX,
    });
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      // Second pass once dimensions are fully rendered in DOM
      const timer = requestAnimationFrame(() => {
        updatePosition();
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [isOpen, align, placement, anchorPosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const targetElement = anchorRef?.current || containerRef.current?.parentElement;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        (!targetElement || !targetElement.contains(target))
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

  if (!isOpen) {
    return <div ref={containerRef} className="hidden" aria-hidden="true" />;
  }

  const content = (
    <div
      ref={menuRef}
      role="menu"
      onClick={(e) => e.stopPropagation()}
      style={
        coords
          ? {
              position: "fixed",
              top: `${coords.top - window.scrollY}px`,
              left: `${coords.left - window.scrollX}px`,
              zIndex: 999999,
            }
          : {
              zIndex: 999999,
            }
      }
      className={`${
        coords
          ? ""
          : `absolute ${align === "left" ? "left-0" : "right-0"} ${
              placement === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
            }`
      } ${width} rounded-xl bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#2c2c3e] p-1.5 shadow-2xl text-xs font-sans space-y-0.5 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5 dark:ring-white/10 select-none ${className}`}
    >
      {children}
    </div>
  );

  return (
    <>
      <div ref={containerRef} className="hidden" aria-hidden="true" />
      {typeof document !== "undefined" ? createPortal(content, document.body) : content}
    </>
  );
}

export function DropdownMenuItem({
  icon,
  label,
  badge,
  badgeColor = "text-[var(--agent-light)] dark:text-[var(--agent-dark)]",

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
          : "text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08]"
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
    <div className="border-t border-slate-100 dark:border-white/[0.08] my-1 pt-1 first:border-0 first:pt-0 first:my-0">
      {label && (
        <div className="px-2.5 py-0.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

export interface DropdownSubMenuProps {
  icon?: React.ReactNode;
  label: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}

export function DropdownSubMenu({
  icon,
  label,
  badge,
  badgeColor = "text-[var(--agent-light)] dark:text-[var(--agent-dark)]",

  children,
}: DropdownSubMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);
  const [subCoords, setSubCoords] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const subWidth = subMenuRef.current ? subMenuRef.current.offsetWidth : 192;
      let left = rect.left - subWidth - 4;
      if (left < 8) {
        left = rect.right + 4;
      }
      setSubCoords({
        top: Math.max(8, rect.top),
        left: Math.max(8, left),
      });
    }
  }, [isOpen]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={triggerRef}
        role="menuitem"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2.5 cursor-pointer transition-colors font-medium text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08]"
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="truncate">{label}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {badge && (
            <span className={`text-[10px] font-mono ${badgeColor}`}>
              {badge}
            </span>
          )}
          <span className="text-neutral-400 text-[10px]">▸</span>
        </div>
      </button>

      {isOpen && (
        <div
          ref={subMenuRef}
          style={
            subCoords
              ? {
                  position: "fixed",
                  top: `${subCoords.top}px`,
                  left: `${subCoords.left}px`,
                  zIndex: 9999999,
                }
              : {
                  zIndex: 9999999,
                }
          }
          className="w-48 rounded-xl bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#2c2c3e] p-1.5 shadow-2xl text-xs font-sans space-y-0.5 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5 dark:ring-white/10 select-none pointer-events-auto"
        >
          {children}
        </div>
      )}
    </div>
  );
}
