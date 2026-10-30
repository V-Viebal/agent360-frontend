import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  content: React.ReactNode;
  shortcut?: string;
  placement?: "top" | "bottom" | "left" | "right" | "auto-side";
  children: React.ReactElement;
  delay?: number;
  className?: string;
  minWidth?: number | string;
  maxWidth?: number | string;
}

export function Tooltip({
  content,
  shortcut,
  placement = "top",
  children,
  delay = 180,
  className = "",
  minWidth,
  maxWidth,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rawRect = triggerRef.current.getBoundingClientRect();
    const parentEl = triggerRef.current.parentElement;

    // Boundary-aware trigger measurement: if child is an overflowing marquee or inline element
    // wider than its container, clamp effective trigger bounds to the visible container.
    let effLeft = rawRect.left;
    let effWidth = rawRect.width;
    if (parentEl) {
      const parentRect = parentEl.getBoundingClientRect();
      if (rawRect.width > parentRect.width + 10) {
        effLeft = Math.max(rawRect.left, parentRect.left);
        const effRight = Math.min(rawRect.right, parentRect.right);
        effWidth = Math.max(20, effRight - effLeft);
      }
    }

    const rect = {
      top: rawRect.top,
      bottom: rawRect.bottom,
      left: effLeft,
      right: effLeft + effWidth,
      width: effWidth,
      height: rawRect.height,
    };

    const tooltipEl = tooltipRef.current;
    const ttWidth = tooltipEl ? tooltipEl.offsetWidth : 160;
    const ttHeight = tooltipEl ? tooltipEl.offsetHeight : 30;

    let actualPlacement = placement;
    if (actualPlacement === "auto-side") {
      // Place to the open workspace side of the sidebar, never covering list items
      actualPlacement = rect.left > window.innerWidth / 2 ? "left" : "right";
    }

    // Auto-flip vertical placement when out of viewport bounds
    if (actualPlacement === "top" && rect.top - ttHeight - 8 < 0) {
      actualPlacement = "bottom";
    } else if (actualPlacement === "bottom" && rect.bottom + ttHeight + 8 > window.innerHeight) {
      actualPlacement = "top";
    }

    let top = 0;
    let left = 0;

    const sidebarEl = triggerRef.current.closest('aside, [data-type-scope="sidebar"]');
    if (sidebarEl && (actualPlacement === "left" || actualPlacement === "right")) {
      const sRect = sidebarEl.getBoundingClientRect();
      top = rect.top + rect.height / 2 - ttHeight / 2;
      if (actualPlacement === "left") {
        left = sRect.left - ttWidth - 10;
      } else {
        left = sRect.right + 10;
      }
    } else {
      switch (actualPlacement) {
        case "top":
          top = rect.top - ttHeight - 6;
          left = rect.left + rect.width / 2 - ttWidth / 2;
          break;
        case "bottom":
          top = rect.bottom + 6;
          left = rect.left + rect.width / 2 - ttWidth / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2 - ttHeight / 2;
          left = rect.left - ttWidth - 8;
          break;
        case "right":
          top = rect.top + rect.height / 2 - ttHeight / 2;
          left = rect.right + 8;
          break;
      }
    }

    // Boundary corrections: prevent overflowing window edges
    if (top < 10) top = 10;
    if (top + ttHeight > window.innerHeight - 10) {
      top = Math.max(10, window.innerHeight - ttHeight - 10);
    }
    if (left < 10) left = 10;
    if (left + ttWidth > window.innerWidth - 10) {
      left = Math.max(10, window.innerWidth - ttWidth - 10);
    }

    setCoords({
      top: top + window.scrollY,
      left: left + window.scrollX,
    });
  };

  useLayoutEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, placement]);

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  const trigger = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e);
      handleMouseEnter();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e);
      handleMouseLeave();
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e);
      handleMouseEnter();
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e);
      handleMouseLeave();
    },
  });

  return (
    <>
      {trigger}
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: "absolute",
              top: coords ? `${coords.top}px` : "-9999px",
              left: coords ? `${coords.left}px` : "-9999px",
              zIndex: 99999,
              pointerEvents: "none",
              minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
              maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
            }}
            className={`rounded-xl bg-white/95 dark:bg-[#12121a]/95 border border-slate-200 dark:border-white/15 px-2.5 py-1.5 text-[11px] leading-relaxed font-sans text-slate-800 dark:text-neutral-100 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 flex items-center justify-center gap-1.5 select-none w-max min-w-[90px] max-w-[280px] break-words ${className}`}
          >
            <span>{content}</span>
            {shortcut && (
              <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 border border-slate-200 dark:border-transparent">
                {shortcut}
              </kbd>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
