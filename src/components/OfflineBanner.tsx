import React, { useState, useEffect } from "react";
import { WifiOff, RefreshCw, AlertTriangle } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnecting(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsReconnecting(true);
    try {
      // Attempt an idempotent HEAD fetch with cache-busting
      const res = await fetch(`/?_health=${Date.now()}`, { method: "HEAD", cache: "no-store" });
      if (res.ok || res.status < 500) {
        setIsOnline(true);
      }
    } catch {
      // Still offline
    } finally {
      setTimeout(() => {
        setIsReconnecting(false);
      }, 800);
    }
  };

  if (isOnline) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 inset-x-0 z-[200] bg-rose-600/95 dark:bg-rose-950/95 text-white border-b border-rose-500/40 backdrop-blur-md px-4 py-2.5 shadow-2xl transition-all duration-300 animate-in slide-in-from-top flex items-center justify-between gap-3 text-xs sm:text-sm font-sans"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="flex h-7 w-7 rounded-full bg-rose-500/30 border border-rose-400/40 items-center justify-center shrink-0 animate-pulse text-white">
          <WifiOff size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold tracking-tight text-white flex items-center gap-1.5 flex-wrap">
            <span>{t("offline.title") || "Mất kết nối Internet (Offline Mode)"}</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/30 border border-white/20">
              {t("offline.badge") || "Đang giữ phiên làm việc"}
            </span>
          </p>
          <p className="text-[11px] sm:text-xs text-rose-100/90 truncate">
            {t("offline.desc") || "Không thể đồng bộ trạng thái A2A và gửi lệnh thời gian thực. Dữ liệu tin nhắn đã được lưu cục bộ."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleRetry}
          disabled={isReconnecting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/20 text-white font-mono text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={12} className={isReconnecting ? "animate-spin" : ""} />
          <span>{isReconnecting ? (t("offline.retrying") || "Đang thử lại...") : (t("offline.retry") || "Thử lại")}</span>
        </button>
      </div>
    </div>
  );
}
