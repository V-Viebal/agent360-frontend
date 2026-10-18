import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  content: React.ReactNode;
  shortcut?: string;
  placement?: "top" | "bottom" | "left" | "right";
  children: React.ReactElement;
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  shortcut,
  placement = "top",
  children,
  delay = 180,
  className = "",
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
    const ttWidth = tooltipEl ? tooltipEl.offsetWidth : 120;
    const ttHeight = tooltipEl ? tooltipEl.offsetHeight : 28;

    let top = 0;
    let left = 0;

    switch (placement) {
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
            }}
            className={`whitespace-nowrap rounded-lg bg-slate-900/95 dark:bg-[#101016]/95 border border-slate-700/60 dark:border-white/15 px-2.5 py-1 text-[11px] font-sans text-slate-100 dark:text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 flex items-center gap-1.5 select-none ${className}`}
          >
            <span>{content}</span>
            {shortcut && (
              <kbd className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/10 text-white/70">
                {shortcut}
              </kbd>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
