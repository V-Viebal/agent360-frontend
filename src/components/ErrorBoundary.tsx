import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Agent360 ErrorBoundary] Uncaught runtime error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/app";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0c0c0e] text-slate-900 dark:text-white flex items-center justify-center p-4 font-sans select-none">
          <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-[#22222e] shadow-xl dark:shadow-2xl flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400 mb-4">
              <AlertTriangle size={28} />
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
              Đã xảy ra lỗi giao diện
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4 leading-relaxed">
              Trang vừa gặp sự cố hiển thị. Bạn có thể làm mới trang hoặc quay lại không gian làm việc chính.
            </p>
            {this.state.error?.message && (
              <div className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-[11px] font-mono text-slate-700 dark:text-neutral-300 text-left mb-6 overflow-x-auto max-h-28 scrollbar-thin">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 rounded-xl bg-[#f8a87c] hover:bg-[#ff8a1a] text-neutral-950 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw size={13} />
                <span>Làm mới</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-800 dark:text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-neutral-700"
              >
                <Home size={13} />
                <span>Về /app</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
