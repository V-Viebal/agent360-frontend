import React, { useState, useEffect } from "react";
import { CreditCard, Zap, TrendingUp, DollarSign, RefreshCw, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface TopupPackage {
  id: string;
  name: string;
  fiat_price: number;
  token_yield: number;
}

interface WalletData {
  tenant_id: string;
  balance_tokens: number;
  daily_burn: number;
  runway_days: number;
  status: "green" | "yellow" | "red";
  packages: TopupPackage[];
}

export function AdminBillingsPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [topupLoadingId, setTopupLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadWallet() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/billing/wallet", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const d = await res.json();
        setWallet(d);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Check if returning from PayOS: ?status=TOPUP_PAID&orderCode=...
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const orderCode = params.get("orderCode");

    if (status === "TOPUP_PAID" && orderCode) {
      setFeedback(`Đang xác nhận đơn hàng PayOS #${orderCode}...`);
      fetch(`/api/v1/billing/sync-order?orderCode=${orderCode}`, { method: "POST" })
        .then(() => {
          setFeedback(`Giao dịch #${orderCode} đã thanh toán thành công! Tokens đã được nạp vào ví.`);
          loadWallet();
        })
        .catch(() => loadWallet());
    } else {
      loadWallet();
    }
  }, []);

  async function handleBuyTopup(pkg: TopupPackage) {
    setTopupLoadingId(pkg.id);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/billing/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ packageId: pkg.id }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url; // Redirect directly to PayOS VietQR gateway
        }
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Không thể tạo thanh toán: ${err.message || res.statusText}`);
      }
    } catch (err: any) {
      alert(`Lỗi kết nối PayOS: ${err.message}`);
    } finally {
      setTopupLoadingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Ví Token PAYG & Nạp Tiền</h1>
          <p className="text-xs text-neutral-400">
            Quản lý số dư token suy luận, tốc độ tiêu hao theo ngày và cổng nạp tiền PayOS (VietQR) tự động.
          </p>
        </div>
        <button
          onClick={loadWallet}
          className="p-2 rounded-xl border border-[#262634] bg-[#161620] hover:bg-[#20202c] text-neutral-300 transition-colors cursor-pointer flex items-center gap-2 text-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Làm mới ví</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Token Wallet Card (App360 Exact UI & Behavior) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161a26] to-[#12141c] border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 font-semibold mb-1">
              Ví Token Compute (PAYG)
            </div>
            <div className="text-4xl font-extrabold text-white flex items-baseline gap-2">
              <span>{wallet ? Number(wallet.balance_tokens).toLocaleString() : "..."}</span>
              <span className="text-base font-semibold text-[#ff7a00]">Tokens</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-neutral-400">⚡ Dự báo Runway:</span>
              <strong
                className={
                  wallet?.status === "green"
                    ? "text-emerald-400"
                    : wallet?.status === "yellow"
                    ? "text-amber-400"
                    : "text-rose-400"
                }
              >
                {wallet?.runway_days === 999 ? "Không giới hạn (∞)" : `${wallet?.runway_days} ngày`}
              </strong>
              <span className="text-neutral-500 text-[11px]">
                (Tiêu hao: ~{wallet ? wallet.daily_burn.toLocaleString() : "25,000"} Tokens/ngày)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {wallet?.packages?.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handleBuyTopup(pkg)}
                disabled={topupLoadingId === pkg.id}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#ff7a00] to-[#ff9433] hover:brightness-110 text-black text-xs font-bold transition-all shadow-lg shadow-[#ff7a00]/20 flex flex-col items-center justify-center cursor-pointer disabled:opacity-50"
              >
                <span>+{Number(pkg.token_yield).toLocaleString()} Tokens</span>
                <span className="text-[10px] opacity-80">{Number(pkg.fiat_price).toLocaleString()}đ</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Package Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {wallet?.packages?.map((pkg) => (
          <div
            key={pkg.id}
            className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c] hover:border-[#ff7a00]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-300">{pkg.name}</span>
                <Zap size={16} className="text-[#ff7a00]" />
              </div>
              <div className="text-2xl font-extrabold text-white mb-1">
                {Number(pkg.fiat_price).toLocaleString()} <span className="text-sm font-normal text-neutral-400">VND</span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-4">
                Cung cấp ngay {Number(pkg.token_yield).toLocaleString()} tokens suy luận cho toàn bộ Agent trong Workspace.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-300 mb-6">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                  <span>Kích hoạt qua VietQR PayOS tức thì</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                  <span>Không hết hạn ngày sử dụng</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                  <span>Hỗ trợ mọi model (Claude 3.7, GPT-4o, Qwen)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleBuyTopup(pkg)}
              disabled={topupLoadingId === pkg.id}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#ff7a00] hover:text-black text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{topupLoadingId === pkg.id ? "Đang mở PayOS..." : "Nạp ngay qua PayOS"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Gateway Information */}
      <div className="p-5 rounded-2xl bg-[#14141a] border border-[#22222c] flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Cổng thanh toán tự động PayOS được bảo vệ bằng mã hóa HMAC SHA-256</span>
        </div>
        <span className="font-mono text-[11px] text-neutral-500">Merchant: Agent360</span>
      </div>
    </div>
  );
}
