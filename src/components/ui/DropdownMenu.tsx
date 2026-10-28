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
  title?: string;
}

/**
 * Standard Skyer Dropdown Container (Single Source of Truth for Menu Aesthetics)
 * Guarantees 100% solid, non-translucent card surface matching DESIGN.md and CustomSelect
 * Renders via React Portal to document.body with consistent ultra-high z-index (z-[999999])
 * preventing stacking context collisions, overflow clipping or bleed-through across the whole app.
 *
 * Enhancement 1: Responsive Mobile Bottom Sheet
 * On mobile viewports (< 768px), seamlessly transitions into an iOS/Android bottom sheet
 * with dark backdrop overlay, drag-down handle, and safe-area inset adaptation.
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
  title,
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Swipe-to-dismiss states on mobile
  const [dragY, setDragY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updatePosition = () => {
    if (isMobile) return;

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

    // Determine target anchor element (either provided anchorRef or parent of container)
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
    if (isOpen && !isMobile) {
      updatePosition();
      const timer = requestAnimationFrame(() => {
        updatePosition();
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [isOpen, align, placement, anchorPosition, isMobile]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (isMobile) return; // Mobile backdrop handles tap-to-close
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
      if (isMobile) return;
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
  }, [isOpen, onClose, anchorRef, isMobile]);

  if (!isOpen) {
    return <div ref={containerRef} className="hidden" aria-hidden="true" />;
  }

  // Mobile Bottom Sheet Mode
  if (isMobile) {
    const mobileContent = (
      <div
        className="fixed inset-0 z-[999999] flex flex-col justify-end select-none animate-in fade-in duration-200"
        onClick={onClose}
      >
        {/* Dark Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Bottom Sheet Card */}
        <div
          ref={menuRef}
          role="menu"
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
            transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`relative z-10 w-full max-h-[85dvh] flex flex-col rounded-t-3xl bg-white dark:bg-[#15151f] border-t border-slate-200 dark:border-white/[0.08] shadow-[0_-12px_40px_rgba(0,0,0,0.35)] p-3 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] animate-in slide-in-from-bottom duration-200 overflow-hidden text-left ${className}`}
        >
          {/* Swipe-down Drag Handle */}
          <div
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                touchStartYRef.current = e.touches[0].clientY;
                setIsDragging(true);
              }
            }}
            onTouchMove={(e) => {
              if (touchStartYRef.current !== null && e.touches.length === 1) {
                const deltaY = e.touches[0].clientY - touchStartYRef.current;
                if (deltaY > 0) {
                  setDragY(deltaY);
                }
              }
            }}
            onTouchEnd={(e) => {
              if (touchStartYRef.current !== null && e.changedTouches.length === 1) {
                const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
                if (deltaY > 60) {
                  if (typeof window !== "undefined" && "vibrate" in navigator) {
                    try { navigator.vibrate(6); } catch {}
                  }
                  onClose();
                }
              }
              setDragY(0);
              setIsDragging(false);
              touchStartYRef.current = null;
            }}
            onTouchCancel={() => {
              setDragY(0);
              setIsDragging(false);
              touchStartYRef.current = null;
            }}
            className="flex flex-col items-center justify-center pt-0.5 pb-2 cursor-grab active:cursor-grabbing shrink-0 touch-none select-none"
            aria-label="Kéo để đóng"
          >
            <div className="w-10 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full hover:bg-[var(--agent-primary)] transition-colors" />
            {title && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-neutral-400 mt-1.5 truncate max-w-[85%]">
                {title}
              </span>
            )}
          </div>

          {/* Sheet Scrollable Body */}
          <div className="overflow-y-auto max-h-[72dvh] space-y-0.5 text-xs font-sans overscroll-contain">
            {children}
          </div>
        </div>
      </div>
    );

    return (
      <>
        <div ref={containerRef} className="hidden" aria-hidden="true" />
        {typeof document !== "undefined" ? createPortal(mobileContent, document.body) : mobileContent}
      </>
    );
  }

  // Desktop Floating Popover Mode
  const desktopContent = (
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
      {typeof document !== "undefined" ? createPortal(desktopContent, document.body) : desktopContent}
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
