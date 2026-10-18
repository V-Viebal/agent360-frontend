import React, { useState, useEffect } from "react";
import { 
  CreditCard, Zap, TrendingUp, DollarSign, RefreshCw, CheckCircle, 
  ArrowRight, ShieldCheck, TestTube, History, ArrowDownRight, ArrowUpRight, 
  Download, Users, AlertTriangle, Gift, Sliders
} from "lucide-react";

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

interface LedgerTransaction {
  id: number;
  tenantId: string;
  amount: number;
  balanceAfter: number;
  type: string;
  referenceId: string | null;
  description: string;
  createdAt: string;
}

interface TenantWalletItem {
  tenant_id: string;
  balance_tokens: number;
  status: string;
  updated_at: string;
  email: string;
  display_name: string;
  runway_days: number;
}

export function AdminBillingsPage() {
  const [activeTab, setActiveTab] = useState<"wallet" | "directory">("wallet");
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [tenantWallets, setTenantWallets] = useState<TenantWalletItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingDirectory, setLoadingDirectory] = useState(false);
  const [topupLoadingId, setTopupLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // Adjustment modal state
  const [adjustTarget, setAdjustTarget] = useState<TenantWalletItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(100000);
  const [adjustReason, setAdjustReason] = useState<string>("Admin Bonus Grant");
  const [adjusting, setAdjusting] = useState<boolean>(false);

  const [mockMode, setMockMode] = useState<boolean>(() => {
    return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  });

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

  async function loadTransactions() {
    setLoadingHistory(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/billing/wallet/transactions", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const d = await res.json();
        setTransactions(d);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  }

  async function loadTenantWallets() {
    setLoadingDirectory(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/admin/billings/wallets", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const d = await res.json();
        setTenantWallets(d);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDirectory(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const orderCode = params.get("orderCode");

    if (status === "TOPUP_PAID" && orderCode) {
      setFeedback(`Đang tự động xác nhận đơn hàng #${orderCode}...`);
      fetch(`/api/v1/billing/sync-order?orderCode=${orderCode}`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          setFeedback(`Giao dịch #${orderCode} đã hoàn tất! Tokens (+${data.tokensCredited ? Number(data.tokensCredited).toLocaleString() : ""}) đã nạp vào ví.`);
          loadWallet();
          loadTransactions();
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(() => {
          loadWallet();
          loadTransactions();
        });
    } else {
      loadWallet();
      loadTransactions();
    }
  }, []);

  useEffect(() => {
    if (activeTab === "directory") {
      loadTenantWallets();
    }
  }, [activeTab]);

  async function handleBuyTopup(pkg: TopupPackage, forceMock: boolean = false) {
    setTopupLoadingId(pkg.id);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/billing/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ 
          packageId: pkg.id,
          mock: forceMock || mockMode 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
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

  // Export CSV Ledger Report
  function exportLedgerCSV() {
    if (!transactions.length) return;
    const headers = ["ID", "Tenant ID", "Amount", "Balance After", "Type", "Reference", "Description", "Created At"];
    const rows = transactions.map(t => [
      t.id,
      `"${t.tenantId}"`,
      t.amount,
      t.balanceAfter,
      `"${t.type}"`,
      `"${t.referenceId || ''}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.createdAt}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agent360-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Handle Admin Bonus / Adjustment
  async function handleConfirmAdjust(e: React.FormEvent) {
    e.preventDefault();
    if (!adjustTarget) return;
    setAdjusting(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/admin/billings/wallets/adjust", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tenantId: adjustTarget.tenant_id,
          amount: adjustAmount,
          description: adjustReason
        }),
      });
      if (res.ok) {
        setFeedback(`Đã cập nhật số dư cho ${adjustTarget.email || adjustTarget.tenant_id}: ${adjustAmount > 0 ? "+" : ""}${adjustAmount.toLocaleString()} Tokens.`);
        setAdjustTarget(null);
        loadTenantWallets();
        if (adjustTarget.tenant_id === wallet?.tenant_id) {
          loadWallet();
          loadTransactions();
        }
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Lỗi cập nhật: ${err.message || res.statusText}`);
      }
    } catch (e: any) {
      alert(`Lỗi: ${e.message}`);
    } finally {
      setAdjusting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Ví Token PAYG & Thanh Toán</h1>
          <p className="text-xs text-neutral-400">
            Quản trị token suy luận, tốc độ tiêu hao theo ngày, cổng nạp tiền PayOS và đối soát sổ cái kế toán toàn hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center bg-[#161620] p-1 rounded-xl border border-[#262634]">
            <button
              onClick={() => setActiveTab("wallet")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "wallet" ? "bg-[#ff7a00] text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              Ví Của Tôi
            </button>
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "directory" ? "bg-[#ff7a00] text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Users size={13} />
              <span>Toàn Bộ Ví (Admin)</span>
            </button>
          </div>

          {/* Dev Mock Toggle */}
          <button
            onClick={() => setMockMode(!mockMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mockMode
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
                : "bg-[#161620] border-[#262634] text-neutral-400 hover:text-neutral-200"
            }`}
            title="Bật/Tắt chế độ giả lập thanh toán local không qua ngân hàng thật"
          >
            <TestTube size={13} />
            <span>Dev Mock: {mockMode ? "BẬT" : "TẮT"}</span>
          </button>

          <button
            onClick={() => {
              loadWallet();
              loadTransactions();
              if (activeTab === "directory") loadTenantWallets();
            }}
            className="p-2 rounded-xl border border-[#262634] bg-[#161620] hover:bg-[#20202c] text-neutral-300 transition-colors cursor-pointer flex items-center gap-2 text-xs"
          >
            <RefreshCw size={14} className={loading || loadingHistory || loadingDirectory ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400/60 hover:text-emerald-400 text-xs cursor-pointer">Đóng</button>
        </div>
      )}

      {/* Low Balance Warning Banner */}
      {wallet && wallet.balance_tokens <= 25000 && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={18} className="text-rose-400 shrink-0" />
            <span>
              <strong>Cảnh báo số dư thấp:</strong> Ví của bạn chỉ còn {Number(wallet.balance_tokens).toLocaleString()} tokens. Các yêu cầu gọi AI Agent có thể bị dừng khi số dư cạn kiệt. Vui lòng nạp thêm gói bên dưới.
            </span>
          </div>
          <button
            onClick={() => wallet.packages?.[0] && handleBuyTopup(wallet.packages[0])}
            className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shrink-0 cursor-pointer"
          >
            Nạp Gói Ngay
          </button>
        </div>
      )}

      {mockMode && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2.5">
          <TestTube size={16} className="text-amber-400 shrink-0" />
          <span>
            <strong>Chế độ Giả lập Thanh toán (Local Simulation) đang kích hoạt:</strong> Khi nhấn Nạp tiền, hệ thống sẽ mô phỏng phản hồi từ PayOS và hoàn tất nạp token ngay lập tức mà không cần chuyển khoản tiền thật.
          </span>
        </div>
      )}

      {/* TAB 1: User's Wallet & Packages */}
      {activeTab === "wallet" && (
        <>
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
                  <span>{topupLoadingId === pkg.id ? "Đang xử lý..." : mockMode ? "Nạp Test Giả lập (Mock)" : "Nạp ngay qua PayOS"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Sổ cái Ledger Transactions (App360 Parity Component) */}
          <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#ff7a00]/10 border border-[#ff7a00]/30 flex items-center justify-center text-[#ff7a00]">
                  <History size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Lịch sử Biến động Ví (Ledger Transactions)</h2>
                  <p className="text-[11px] text-neutral-400">Ghi nhận chi tiết từng lần nạp Topup PayOS và tiêu hao token suy luận theo thời gian thực.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportLedgerCSV}
                  disabled={!transactions.length}
                  className="px-3 py-1.5 rounded-lg border border-[#262634] bg-[#1a1a24] hover:bg-[#242432] text-neutral-300 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  title="Tải về file CSV để kế toán đối soát hoá đơn"
                >
                  <Download size={13} />
                  <span>Xuất CSV Đối Soát</span>
                </button>
                <button
                  onClick={loadTransactions}
                  className="px-3 py-1.5 rounded-lg border border-[#262634] bg-[#1a1a24] hover:bg-[#242432] text-neutral-300 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={12} className={loadingHistory ? "animate-spin" : ""} />
                  <span>Tải lại</span>
                </button>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-[#262634] rounded-xl text-neutral-500 text-xs">
                Chưa có giao dịch biến động nào trong ví. Hãy thử bấm nạp gói phía trên.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#262634] text-neutral-400 text-[11px] font-mono">
                      <th className="py-2.5 px-3">Thời gian</th>
                      <th className="py-2.5 px-3">Loại giao dịch</th>
                      <th className="py-2.5 px-3">Mô tả</th>
                      <th className="py-2.5 px-3">Mã đơn (Ref)</th>
                      <th className="py-2.5 px-3 text-right">Biến động</th>
                      <th className="py-2.5 px-3 text-right">Số dư sau GD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e28]">
                    {transactions.map((tx) => {
                      const isCredit = tx.amount > 0;
                      return (
                        <tr key={tx.id} className="hover:bg-[#1a1a24]/50 transition-colors">
                          <td className="py-3 px-3 text-neutral-400 font-mono text-[11px]">
                            {new Date(tx.createdAt).toLocaleString("vi-VN")}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                              isCredit ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}>
                              {isCredit ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-neutral-200">{tx.description}</td>
                          <td className="py-3 px-3 font-mono text-neutral-400 text-[11px]">{tx.referenceId || "—"}</td>
                          <td className={`py-3 px-3 text-right font-mono font-bold ${isCredit ? "text-emerald-400" : "text-rose-400"}`}>
                            {isCredit ? "+" : ""}{Number(tx.amount).toLocaleString()} Tokens
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-white font-semibold">
                            {Number(tx.balanceAfter).toLocaleString()} Tokens
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: Super Admin Wallets Directory */}
      {activeTab === "directory" && (
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#ff7a00]/10 border border-[#ff7a00]/30 flex items-center justify-center text-[#ff7a00]">
                <Users size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Quản Lý Toàn Bộ Ví Thành Viên & Workspace</h2>
                <p className="text-[11px] text-neutral-400">Danh mục ví của tất cả tài khoản trong hệ thống, cho phép cấp bonus token hoặc điều chỉnh số dư thủ công.</p>
              </div>
            </div>
            <button
              onClick={loadTenantWallets}
              className="px-3 py-1.5 rounded-lg border border-[#262634] bg-[#1a1a24] hover:bg-[#242432] text-neutral-300 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={12} className={loadingDirectory ? "animate-spin" : ""} />
              <span>Tải lại danh sách</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#262634] text-neutral-400 text-[11px] font-mono">
                  <th className="py-2.5 px-3">Tài khoản / Tenant</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3 text-right">Số dư Token</th>
                  <th className="py-2.5 px-3 text-right">Dự báo Runway</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e28]">
                {tenantWallets.map((w) => (
                  <tr key={w.tenant_id} className="hover:bg-[#1a1a24]/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{w.display_name}</div>
                      <div className="font-mono text-[10px] text-neutral-500">{w.tenant_id}</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-300 font-mono text-[11px]">{w.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#ff7a00]">
                      {Number(w.balance_tokens).toLocaleString()} Tokens
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-300">
                      {w.runway_days} ngày
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setAdjustTarget(w)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#ff7a00] hover:text-black text-neutral-200 text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Gift size={12} />
                        <span>Tặng / Trừ</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Adjustment Modal */}
      {adjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#161620] border border-[#262634] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262634] pb-3">
              <div className="flex items-center gap-2">
                <Gift size={18} className="text-[#ff7a00]" />
                <h3 className="text-sm font-bold text-white">Điều Chỉnh Số Dư Ví Token</h3>
              </div>
              <button onClick={() => setAdjustTarget(null)} className="text-neutral-400 hover:text-white cursor-pointer text-xs">Đóng</button>
            </div>

            <form onSubmit={handleConfirmAdjust} className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Tài khoản thụ hưởng</label>
                <div className="p-2.5 bg-[#0e0e14] rounded-xl border border-[#22222e] font-mono text-neutral-300">
                  {adjustTarget.display_name} ({adjustTarget.email})
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Số lượng Tokens (+ hoặc -)</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  placeholder="100000"
                  className="w-full p-2.5 bg-[#0e0e14] rounded-xl border border-[#22222e] text-white focus:outline-none focus:border-[#ff7a00]"
                  required
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">Nhập số dương để tặng bonus, nhập số âm để trừ phạt.</span>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Lý do điều chỉnh (ghi vào Sổ cái)</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Khuyến mãi thành viên mới / Bồi hoàn"
                  className="w-full p-2.5 bg-[#0e0e14] rounded-xl border border-[#22222e] text-white focus:outline-none focus:border-[#ff7a00]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustTarget(null)}
                  className="px-3.5 py-2 rounded-xl text-neutral-400 hover:text-white cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{adjusting ? "Đang xử lý..." : "Xác nhận điều chỉnh"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
