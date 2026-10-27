import React, { useState, useEffect } from "react";
import { 
  CreditCard, Zap, TrendingUp, DollarSign, RefreshCw, CheckCircle, 
  ArrowRight, ShieldCheck, TestTube, History, ArrowDownRight, ArrowUpRight, 
  Download, Users, AlertTriangle, Gift, Sliders, ExternalLink, RefreshCcw
} from "lucide-react";
import { EnterpriseDataTable, Column } from "../../components/ui/EnterpriseDataTable";
import { SlideOverDrawer } from "../../components/ui/SlideOverDrawer";

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

interface PlatformTransactionItem {
  id: number;
  tenant_id: string;
  order_code: number;
  amount: number;
  status: string;
  payment_link_id: string | null;
  checkout_url: string | null;
  package_id: string | null;
  created_at: string;
  completed_at: string | null;
  tenant_email: string;
  tenant_name: string;
  token_yield: number;
  package_name: string;
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
  const [activeTab, setActiveTab] = useState<"transactions" | "wallets" | "my_wallet">("transactions");
  const [transactions, setTransactions] = useState<PlatformTransactionItem[]>([]);
  const [tenantWallets, setTenantWallets] = useState<TenantWalletItem[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);

  const [loading, setLoading] = useState(true);
  const [syncingOrderCode, setSyncingOrderCode] = useState<number | null>(null);
  const [selectedTx, setSelectedTx] = useState<PlatformTransactionItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Adjustment modal state
  const [adjustTarget, setAdjustTarget] = useState<TenantWalletItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(100000);
  const [adjustReason, setAdjustReason] = useState<string>("Admin Bonus Grant");
  const [adjusting, setAdjusting] = useState<boolean>(false);

  const [topupLoadingId, setTopupLoadingId] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState<boolean>(() => {
    return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  });

  async function loadTransactions() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const res = await fetch("/api/admin/billings/transactions", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const d = await res.json();
        setTransactions(Array.isArray(d) ? d : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadTenantWallets() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const res = await fetch("/api/admin/billings/wallets", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const d = await res.json();
        setTenantWallets(Array.isArray(d) ? d : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadMyWallet() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const res = await fetch("/api/billing/wallet", {
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
    if (activeTab === "transactions") loadTransactions();
    else if (activeTab === "wallets") loadTenantWallets();
    else if (activeTab === "my_wallet") loadMyWallet();
  }, [activeTab]);

  async function handleSyncTransaction(orderCode: number, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setSyncingOrderCode(orderCode);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const res = await fetch(`/api/admin/billings/transactions/${orderCode}/sync`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setFeedback(`Đơn hàng #${orderCode} đã đồng bộ thành công! Trạng thái: ${data.status.toUpperCase()}`);
        setTimeout(() => setFeedback(null), 4000);
        await loadTransactions();
        if (selectedTx?.order_code === orderCode) {
          setSelectedTx((prev) => prev ? { ...prev, status: "paid" } : null);
        }
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Không thể đối soát: ${err.message || res.statusText}`);
      }
    } catch (err: any) {
      alert(`Lỗi kết nối PayOS: ${err.message}`);
    } finally {
      setSyncingOrderCode(null);
    }
  }

  async function handleBuyTopup(pkg: TopupPackage, forceMock: boolean = false) {
    setTopupLoadingId(pkg.id);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const res = await fetch("/api/billing/topup", {
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

  async function handleConfirmAdjust(e: React.FormEvent) {
    e.preventDefault();
    if (!adjustTarget) return;
    setAdjusting(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const res = await fetch("/api/admin/billings/wallets/adjust", {
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

  const getInitials = (name?: string, email?: string) => {
    const target = name || email || "User";
    const parts = target.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return target.slice(0, 2).toUpperCase();
  };

  // Transaction columns (App360 Parity)
  const transactionColumns: Column<PlatformTransactionItem>[] = [
    {
      header: "Khách hàng / Tenant",
      accessorKey: "tenant_name",
      sortable: true,
      width: "25%",
      cell: (tx) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-full bg-[#f8a87c]/15 text-[#f8a87c] border border-[#f8a87c]/30 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
            {getInitials(tx.tenant_name, tx.tenant_email)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-white truncate text-xs hover:text-[#f8a87c] transition-colors">
              {tx.tenant_name || "User Skyer"}
            </div>
            <div className={`text-[10px] text-slate-500 dark:text-neutral-400 truncate ${tx.tenant_email ? "" : "font-mono"}`}>{tx.tenant_email || tx.tenant_id}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Mã Đơn (Order Code)",
      accessorKey: "order_code",
      sortable: true,
      width: "18%",
      cell: (tx) => (
        <span className="font-mono text-[11px] text-[#f8a87c] bg-[#f8a87c]/10 px-2 py-0.5 rounded-md border border-[#f8a87c]/20 select-all">
          #{tx.order_code}
        </span>
      ),
    },
    {
      header: "Số Tiền (VND)",
      accessorKey: "amount",
      sortable: true,
      width: "15%",
      cell: (tx) => (
        <span className="font-mono font-bold text-emerald-400 text-xs">
          {Number(tx.amount).toLocaleString("vi-VN")} ₫
        </span>
      ),
    },
    {
      header: "Gói Nạp & Token",
      accessorKey: "package_name",
      sortable: true,
      width: "18%",
      cell: (tx) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white text-xs">{tx.package_name || "Gói nạp"}</div>
          <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">+{Number(tx.token_yield).toLocaleString()} Tokens</div>
        </div>
      ),
    },
    {
      header: "Trạng Thái",
      accessorKey: "status",
      sortable: true,
      width: "14%",
      cell: (tx) => {
        const isPaid = tx.status === "paid" || tx.status === "success";
        const isPending = tx.status === "pending";
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
              isPaid
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                : isPending
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                : "bg-rose-500/15 text-rose-400 border border-rose-500/25"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-400 animate-pulse" : isPending ? "bg-amber-400" : "bg-rose-400"}`} />
            {isPaid ? "Đã nạp" : isPending ? "Chờ TT" : "Đã hủy"}
          </span>
        );
      },
    },
    {
      header: "Thao Tác",
      sortable: false,
      width: "10%",
      className: "text-right",
      cell: (tx) => {
        const isSyncing = syncingOrderCode === tx.order_code;
        return (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            {tx.status === "pending" && (
              <button
                type="button"
                onClick={(e) => handleSyncTransaction(tx.order_code, e)}
                disabled={isSyncing}
                className="px-2 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                title="Kiểm tra trực tiếp với cổng PayOS"
              >
                <RefreshCcw size={11} className={isSyncing ? "animate-spin" : ""} />
                <span>{isSyncing ? "Đang check..." : "Sync PayOS"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedTx(tx)}
              className="p-1 rounded-lg border border-[#2a2a38] bg-slate-100 dark:bg-[#1a1a24] hover:bg-slate-100 dark:hover:bg-[#222230] text-slate-700 dark:text-neutral-300 cursor-pointer"
              title="Xem chi tiết"
            >
              <ExternalLink size={12} />
            </button>
          </div>
        );
      },
    },
  ];

  // Wallets columns
  const walletColumns: Column<TenantWalletItem>[] = [
    {
      header: "Tài Khoản / Tenant",
      accessorKey: "display_name",
      sortable: true,
      width: "30%",
      cell: (w) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
            {getInitials(w.display_name, w.email)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-white truncate text-xs">{w.display_name}</div>
            <div className="text-[10px] text-slate-500 dark:text-neutral-400 truncate">{w.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Tenant ID (Sub)",
      accessorKey: "tenant_id",
      sortable: true,
      width: "25%",
      cell: (w) => <span className="font-mono text-neutral-500 text-[11px] select-all truncate block">{w.tenant_id}</span>,
    },
    {
      header: "Số Dư Tokens",
      accessorKey: "balance_tokens",
      sortable: true,
      width: "20%",
      cell: (w) => (
        <span className="font-mono font-bold text-[#f8a87c] text-xs">
          {Number(w.balance_tokens).toLocaleString()} Tokens
        </span>
      ),
    },
    {
      header: "Dự Báo Runway",
      accessorKey: "runway_days",
      sortable: true,
      width: "15%",
      cell: (w) => (
        <span className="font-mono text-slate-700 dark:text-neutral-300 text-xs">
          ~{w.runway_days} ngày
        </span>
      ),
    },
    {
      header: "Thao Tác",
      sortable: false,
      width: "10%",
      className: "text-right",
      cell: (w) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAdjustTarget(w);
          }}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#f8a87c] hover:text-black text-slate-800 dark:text-neutral-200 text-[10px] font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
        >
          <Gift size={11} />
          <span>Tặng / Trừ</span>
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 space-y-3 font-sans">
      {/* Header Tier */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Quản Trị Thanh Toán & Sổ Cái PAYG</span>
            <span className="text-[11px] font-mono text-[#f8a87c] bg-[#f8a87c]/10 px-2 py-0.5 rounded-full border border-[#f8a87c]/20">
              VietQR PayOS
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400">
            Theo dõi dòng tiền nạp tự động, đối soát tức thì với PayOS và cấp hạn mức token cho từng Workspace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-50 dark:bg-[#161620] p-0.5 rounded-xl border border-slate-200 dark:border-[#262634]">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "transactions" ? "bg-[#f8a87c] text-black shadow-sm" : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white"
              }`}
            >
              Giao Dịch Toàn Sàn
            </button>
            <button
              onClick={() => setActiveTab("wallets")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "wallets" ? "bg-[#f8a87c] text-black shadow-sm" : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white"
              }`}
            >
              Danh Sách Ví
            </button>
            <button
              onClick={() => setActiveTab("my_wallet")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "my_wallet" ? "bg-[#f8a87c] text-black shadow-sm" : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white"
              }`}
            >
              Nạp Thêm Token
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === "transactions") loadTransactions();
              else if (activeTab === "wallets") loadTenantWallets();
              else if (activeTab === "my_wallet") loadMyWallet();
            }}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-[#262634] bg-slate-50 dark:bg-[#161620] hover:bg-slate-100 dark:hover:bg-[#20202c] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
            title="Làm mới"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline text-[11px]">Tải lại</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400/60 hover:text-emerald-400 text-xs cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      {/* TAB 1: Platform Transactions Table (Full-Height Power Table) */}
      {activeTab === "transactions" && (
        <EnterpriseDataTable
          data={transactions}
          columns={transactionColumns}
          isLoading={loading}
          tableKey="admin_billing_transactions"
          searchPlaceholder="Tìm kiếm theo mã đơn, khách hàng, email, trạng thái..."
          emptyTitle="Chưa có giao dịch thanh toán nào"
          emptyDescription="Mọi giao dịch nạp tiền qua cổng PayOS sẽ xuất hiện thời gian thực tại đây."
          defaultPageSize={25}
          exportFileName="agent360-platform-transactions"
          onRowClick={(tx) => setSelectedTx(tx)}
          selectedItemId={selectedTx?.order_code}
        />
      )}

      {/* TAB 2: Wallets Directory (Full-Height Power Table) */}
      {activeTab === "wallets" && (
        <EnterpriseDataTable
          data={tenantWallets}
          columns={walletColumns}
          isLoading={loading}
          tableKey="admin_billing_wallets"
          searchPlaceholder="Tìm kiếm ví theo tên, email, tenant ID..."
          emptyTitle="Chưa có ví nào"
          emptyDescription="Danh sách ví của người dùng sẽ hiển thị tại đây."
          defaultPageSize={25}
          exportFileName="agent360-wallets-directory"
          onRowClick={(w) => setAdjustTarget(w)}
        />
      )}

      {/* TAB 3: My Wallet & Topup Packages */}
      {activeTab === "my_wallet" && (
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Main Wallet Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161a26] to-[#12141c] border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-[11px] font-mono tracking-wider uppercase text-slate-500 dark:text-neutral-400 font-semibold mb-1">
                  Ví Token Compute (PAYG)
                </div>
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-2">
                  <span>{wallet ? Number(wallet.balance_tokens).toLocaleString() : "..."}</span>
                  <span className="text-base font-semibold text-[#f8a87c]">Tokens</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-slate-500 dark:text-neutral-400">⚡ Dự báo Runway:</span>
                  <strong className={wallet?.status === "green" ? "text-emerald-400" : "text-amber-400"}>
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
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#f8a87c] to-[#ff9433] hover:brightness-110 text-black text-xs font-bold transition-all shadow-lg shadow-[#f8a87c]/20 flex flex-col items-center justify-center cursor-pointer disabled:opacity-50"
                  >
                    <span>+{Number(pkg.token_yield).toLocaleString()} Tokens</span>
                    <span className="text-[10px] opacity-80">{Number(pkg.fiat_price).toLocaleString()}đ</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Package Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wallet?.packages?.map((pkg) => (
              <div
                key={pkg.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#14141a] border border-slate-200 dark:border-[#22222c] hover:border-[#f8a87c]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">{pkg.name}</span>
                    <Zap size={16} className="text-[#f8a87c]" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                    {Number(pkg.fiat_price).toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-neutral-400">VND</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mb-4">
                    Nạp ngay {Number(pkg.token_yield).toLocaleString()} tokens suy luận cho Agent fleet.
                  </p>
                </div>

                <button
                  onClick={() => handleBuyTopup(pkg)}
                  disabled={topupLoadingId === pkg.id}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#f8a87c] hover:text-black text-xs font-semibold text-slate-900 dark:text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{topupLoadingId === pkg.id ? "Đang xử lý..." : "Nạp ngay qua PayOS"}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-over Transaction Detail Drawer (App360 admin-billing-detail parity) */}
      <SlideOverDrawer
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        title={`Chi Tiết Đơn Hàng #${selectedTx?.order_code}`}
        subtitle={`Tenant: ${selectedTx?.tenant_email || selectedTx?.tenant_id}`}
        actions={
          selectedTx?.status === "pending" && (
            <button
              onClick={() => handleSyncTransaction(selectedTx.order_code)}
              disabled={syncingOrderCode === selectedTx.order_code}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCcw size={13} className={syncingOrderCode === selectedTx.order_code ? "animate-spin" : ""} />
              <span>Đối soát lại với PayOS</span>
            </button>
          )
        }
      >
        {selectedTx && (
          <div className="space-y-4 font-sans text-xs">
            {/* Status Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#161622] border border-slate-200 dark:border-[#242432] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 uppercase">Trạng Thái Giao Dịch</span>
                <div className="text-base font-bold text-slate-900 dark:text-white uppercase mt-0.5">{selectedTx.status}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 uppercase">Số Tiền Thanh Toán</span>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {Number(selectedTx.amount).toLocaleString("vi-VN")} ₫
                </div>
              </div>
            </div>

            {/* General Info */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636] space-y-2.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-neutral-400">Mã đơn PayOS (Order Code):</span>
                <span className="font-bold text-[#f8a87c] select-all">#{selectedTx.order_code}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-neutral-400">Payment Link ID:</span>
                <span className="text-slate-900 dark:text-white select-all">{selectedTx.payment_link_id || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-neutral-400">Gói đăng ký:</span>
                <span className="text-slate-900 dark:text-white">{selectedTx.package_name || selectedTx.package_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-neutral-400">Số lượng Tokens nạp:</span>
                <span className="text-emerald-400 font-bold">+{Number(selectedTx.token_yield).toLocaleString()} Tokens</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-neutral-400">Thời gian tạo:</span>
                <span className="text-slate-700 dark:text-neutral-300">{new Date(selectedTx.created_at).toLocaleString("vi-VN")}</span>
              </div>
              {selectedTx.completed_at && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Thời gian hoàn tất:</span>
                  <span className="text-emerald-400">{new Date(selectedTx.completed_at).toLocaleString("vi-VN")}</span>
                </div>
              )}
            </div>

            {/* Checkout Link */}
            {selectedTx.checkout_url && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636] flex items-center justify-between">
                <span className="text-slate-500 dark:text-neutral-400">Trang thanh toán PayOS:</span>
                <a
                  href={selectedTx.checkout_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f8a87c] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Mở PayOS VietQR</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        )}
      </SlideOverDrawer>

      {/* Adjust Wallet Modal */}
      {adjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#262634] rounded-2xl p-6 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#262634] pb-3">
              <div className="flex items-center gap-2">
                <Gift size={18} className="text-[#f8a87c]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Điều Chỉnh Số Dư Ví Token</h3>
              </div>
              <button onClick={() => setAdjustTarget(null)} className="text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white cursor-pointer">Đóng</button>
            </div>

            <form onSubmit={handleConfirmAdjust} className="space-y-3.5">
              <div>
                <label className="text-slate-500 dark:text-neutral-400 block mb-1">Tài khoản thụ hưởng</label>
                <div className="p-2.5 bg-slate-100/70 dark:bg-[#0e0e14] rounded-xl border border-slate-200 dark:border-[#22222e] font-mono text-slate-700 dark:text-neutral-300">
                  {adjustTarget.display_name} ({adjustTarget.email})
                </div>
              </div>

              <div>
                <label className="text-slate-500 dark:text-neutral-400 block mb-1">Số lượng Tokens (+ hoặc -)</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  placeholder="100000"
                  className="w-full p-2.5 bg-slate-100/70 dark:bg-[#0e0e14] rounded-xl border border-slate-200 dark:border-[#22222e] text-slate-900 dark:text-white focus:outline-none focus:border-[#f8a87c]"
                  required
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">Nhập số dương để tặng bonus, nhập số âm để trừ phạt.</span>
              </div>

              <div>
                <label className="text-slate-500 dark:text-neutral-400 block mb-1">Lý do điều chỉnh (ghi vào Sổ cái)</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Khuyến mãi thành viên mới / Bồi hoàn"
                  className="w-full p-2.5 bg-slate-100/70 dark:bg-[#0e0e14] rounded-xl border border-slate-200 dark:border-[#22222e] text-slate-900 dark:text-white focus:outline-none focus:border-[#f8a87c]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustTarget(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-4 py-2 rounded-xl bg-[#f8a87c] hover:bg-[#f5935f] text-black font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{adjusting ? "Đang xử lý..." : "Xác nhận điều chỉnh"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
