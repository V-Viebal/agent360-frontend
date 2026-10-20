import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  content: React.ReactNode;
  shortcut?: string;
  placement?: "top" | "bottom" | "left" | "right";
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
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;
    const ttWidth = tooltipEl ? tooltipEl.offsetWidth : 160;
    const ttHeight = tooltipEl ? tooltipEl.offsetHeight : 30;

    let actualPlacement = placement;
    // Auto-flip: If placement is top but element is too close to top edge, flip to bottom
    if (actualPlacement === "top" && rect.top - ttHeight - 8 < 0) {
      actualPlacement = "bottom";
    } else if (actualPlacement === "bottom" && rect.bottom + ttHeight + 8 > window.innerHeight) {
      actualPlacement = "top";
    }

    let top = 0;
    let left = 0;

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
        left = rect.left - ttWidth - 6;
        break;
      case "right":
        top = rect.top + rect.height / 2 - ttHeight / 2;
        left = rect.right + 6;
        break;
    }

    // Boundary corrections
    if (left < 8) left = 8;
    if (left + ttWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - ttWidth - 8);
    }
    if (top < 8) top = 8;

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
            className={`whitespace-nowrap text-nowrap [text-wrap:nowrap] rounded-lg bg-white/95 dark:bg-[#101016]/95 border border-slate-200 dark:border-white/15 px-3.5 py-1.5 text-[11px] font-sans text-slate-800 dark:text-white shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 flex items-center justify-center gap-2 select-none w-max min-w-[130px] sm:min-w-[150px] max-w-sm ${className}`}
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
