import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  RefreshCw,
  Clock,
  User,
  Activity,
  AlertCircle,
  FileText,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Database,
  Lock,
  Download,
  Search,
  Check,
  ShieldCheck,
  Hash,
  Layers,
  ArrowRight
} from "lucide-react";
import { EnterpriseDataTable, Column } from "../../components/ui/EnterpriseDataTable";
import { SlideOverDrawer } from "../../components/ui/SlideOverDrawer";
import {
  fetchIam360SignedIntents,
  fetchIam360PersistenceStatus,
  Iam360SignedIntentEnvelope,
  Iam360PersistenceStatus
} from "../../services/iam360CellsApi";

interface AuditLog {
  id: number;
  actorId?: number;
  actorExternalId?: string;
  action: string;
  targetResource: string;
  details: any;
  ipAddress?: string;
  createdAt: string;
}

export function AdminAuditPage() {
  const [activeTab, setActiveTab] = useState<"standard" | "signed_intents" | "composio_webhooks">("standard");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // IAM360 Signed Intents State
  const [signedIntents, setSignedIntents] = useState<Iam360SignedIntentEnvelope[]>([]);
  const [persistenceStatus, setPersistenceStatus] = useState<Iam360PersistenceStatus | null>(null);
  const [intentsLoading, setIntentsLoading] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<Iam360SignedIntentEnvelope | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  async function loadAuditLogs() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const res = await fetch("/api/admin/audit/logs", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadSignedIntents() {
    setIntentsLoading(true);
    try {
      const [intentsRes, persistenceRes] = await Promise.all([
        fetchIam360SignedIntents(),
        fetchIam360PersistenceStatus()
      ]);
      setSignedIntents(intentsRes.items || []);
      setPersistenceStatus(persistenceRes);
    } catch (e) {
      console.error("Failed to load IAM360 signed intents", e);
    } finally {
      setIntentsLoading(false);
    }
  }

  useEffect(() => {
    loadAuditLogs();
    loadSignedIntents();
  }, []);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportIntents = (format: "json" | "csv") => {
    if (format === "json") {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(signedIntents, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `iam360-signed-intents-ledger-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = ["Intent ID", "Runtime", "Agent", "Cell ID", "Action Type", "Issued At", "Content Hash", "Sync Status"];
      const csvRows = [headers.join(",")];
      for (const item of signedIntents) {
        csvRows.push([
          `"${item.intent_id}"`,
          `"${item.runtime_id}"`,
          `"${item.agent_id}"`,
          `"${item.cell_id}"`,
          `"${item.type}"`,
          `"${item.issued_at}"`,
          `"${item.signature?.content_hash || ""}"`,
          `"${item.upstream_sync_status}"`
        ].join(","));
      }
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `iam360-signed-intents-ledger-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const columns: Column<AuditLog>[] = [
    {
      header: "Thời Gian",
      accessorKey: "createdAt",
      sortable: true,
      width: "18%",
      cell: (log) => (
        <span className="font-mono text-[11px] text-slate-500 dark:text-neutral-400 whitespace-nowrap">
          {new Date(log.createdAt).toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      header: "Hành Động (Action)",
      accessorKey: "action",
      sortable: true,
      width: "20%",
      cell: (log) => {
        const isDelete = log.action.includes("DELETE") || log.action.includes("REMOVE") || log.action.includes("DEDUCT");
        const isAssign = log.action.includes("ASSIGN") || log.action.includes("CREATE") || log.action.includes("GRANT");
        return (
          <span
            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold border uppercase ${
              isDelete
                ? "bg-rose-500/15 text-rose-400 border-rose-500/25"
                : isAssign
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                : "bg-[#f8a87c]/15 text-[#f8a87c] border-[#f8a87c]/25"
            }`}
          >
            {log.action}
          </span>
        );
      },
    },
    {
      header: "Tài Nguyên Đích",
      accessorKey: "targetResource",
      sortable: true,
      width: "25%",
      cell: (log) => (
        <span className="font-mono text-[11px] text-slate-900 dark:text-white truncate block">
          {log.targetResource}
        </span>
      ),
    },
    {
      header: "Người Thực Hiện (Actor)",
      accessorKey: "actorExternalId",
      sortable: true,
      width: "20%",
      cell: (log) => (
        <span className="text-[11px] text-slate-700 dark:text-neutral-300 font-mono truncate block">
          {log.actorExternalId || (log.actorId ? `User #${log.actorId}` : "Root System")}
        </span>
      ),
    },
    {
      header: "Chi Tiết",
      sortable: false,
      width: "17%",
      className: "text-right",
      cell: (log) => (
        <button
          type="button"
          onClick={() => setSelectedLog(log)}
          className="text-[11px] text-[#f8a87c] hover:underline font-mono truncate max-w-[140px] inline-block cursor-pointer"
        >
          {typeof log.details === "object" ? JSON.stringify(log.details) : String(log.details)}
        </button>
      ),
    },
  ];

  const intentColumns: Column<Iam360SignedIntentEnvelope>[] = [
    {
      header: "Thời Gian Ký",
      accessorKey: "issued_at",
      sortable: true,
      width: "16%",
      cell: (intent) => (
        <span className="font-mono text-[11px] text-slate-500 dark:text-neutral-400 whitespace-nowrap">
          {new Date(intent.issued_at).toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      header: "Intent ID & Cell",
      accessorKey: "intent_id",
      sortable: true,
      width: "22%",
      cell: (intent) => (
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-[11px] font-semibold text-slate-900 dark:text-white truncate">
            {intent.intent_id}
          </span>
          <span className="font-mono text-[10px] text-cyan-500 dark:text-cyan-400">
            {intent.cell_id} ({intent.runtime_id}/{intent.agent_id})
          </span>
        </div>
      ),
    },
    {
      header: "Loại Hành Động",
      accessorKey: "type",
      sortable: true,
      width: "18%",
      cell: (intent) => (
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-[#f8a87c]/15 text-[#f8a87c] border border-[#f8a87c]/25 uppercase">
          {intent.type}
        </span>
      ),
    },
    {
      header: "Content Hash & Chữ Ký",
      accessorKey: "intent_id",
      sortable: false,
      width: "26%",
      cell: (intent) => (
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
          <span className="text-slate-600 dark:text-neutral-300 truncate max-w-[180px]" title={intent.signature.content_hash}>
            {intent.signature.content_hash.slice(0, 18)}...
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyHash(intent.signature.content_hash);
            }}
            className="p-1 hover:bg-slate-200 dark:hover:bg-neutral-800 rounded text-slate-400 hover:text-white"
            title="Copy SHA-256 Hash"
          >
            {copiedHash === intent.signature.content_hash ? <Check size={11} className="text-emerald-400" /> : <Hash size={11} />}
          </button>
        </div>
      ),
    },
    {
      header: "Trạng Thái Lưu Trữ",
      accessorKey: "upstream_sync_status",
      sortable: true,
      width: "18%",
      className: "text-right",
      cell: (intent) => (
        <div className="flex items-center justify-end gap-1.5">
          <span className="px-2 py-0.5 rounded-full font-mono text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
            {intent.upstream_sync_status}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 space-y-3">
      {/* Header Tier */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Security Audit Trail & Sổ Cái An Ninh</span>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#161622] p-0.5 rounded-lg border border-slate-200 dark:border-[#262638] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("standard")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === "standard"
                    ? "bg-white dark:bg-[#202030] text-slate-900 dark:text-white shadow-sm font-semibold"
                    : "text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                Nhật Ký Quản Trị ({logs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("signed_intents")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "signed_intents"
                    ? "bg-white dark:bg-[#202030] text-[#f8a87c] shadow-sm font-semibold"
                    : "text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                <KeyRound size={12} className="text-[#f8a87c]" />
                <span>Sổ Cái IAM360 Signed Intents ({signedIntents.length})</span>
              </button>
            </div>
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
            {activeTab === "standard"
              ? "Sổ cái bất biến ghi nhận mọi đột biến quyền hạn, cấp vai trò, gán Agent và thao tác quản trị Root."
              : "Sổ cái mật mã học Ed25519 & Envelope Intent v1 lưu vết các chỉ thị phân quyền, gắn liền PostgreSQL schema: agent360_iam360."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "signed_intents" && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleExportIntents("csv")}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#262634] bg-slate-50 dark:bg-[#161620] hover:bg-slate-100 dark:hover:bg-[#20202c] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              >
                <Download size={12} />
                <span>Xuất CSV</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportIntents("json")}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#262634] bg-slate-50 dark:bg-[#161620] hover:bg-slate-100 dark:hover:bg-[#20202c] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              >
                <Download size={12} />
                <span>Xuất JSON</span>
              </button>
            </div>
          )}
          <button
            onClick={() => {
              if (activeTab === "standard") loadAuditLogs();
              else loadSignedIntents();
            }}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-[#262634] bg-slate-50 dark:bg-[#161620] hover:bg-slate-100 dark:hover:bg-[#20202c] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
            title="Tải lại"
          >
            <RefreshCw size={13} className={(activeTab === "standard" ? loading : intentsLoading) ? "animate-spin" : ""} />
            <span className="hidden sm:inline text-[11px]">Tải lại</span>
          </button>
        </div>
      </div>

      {/* Persistence Banner for Signed Intents */}
      {activeTab === "signed_intents" && persistenceStatus && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#14141e] border border-slate-200 dark:border-[#242436] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-500">
              <Database size={14} />
              <span className="font-semibold">PostgreSQL: {persistenceStatus.postgresHealthy ? "HEALTHY" : "DOWN"}</span>
              <span className="text-[10px] text-slate-500 dark:text-neutral-400">({persistenceStatus.postgresSchema})</span>
            </div>
            <div className="h-3 w-px bg-slate-300 dark:bg-[#2a2a3e]" />
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Lock size={13} />
              <span>Signing Key:</span>
              <span className="text-slate-700 dark:text-neutral-300">{persistenceStatus.signingKeyId}</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-neutral-400 flex items-center gap-2">
            <span>Storage: {persistenceStatus.stateFilePath}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {persistenceStatus.postgresSignedIntentsCount} Đã Ký
            </span>
          </div>
        </div>
      )}

      {/* Main Full-Height Power Table */}
      {activeTab === "standard" ? (
        <EnterpriseDataTable
          data={logs}
          columns={columns}
          isLoading={loading}
          tableKey="admin_audit"
          searchPlaceholder="Tìm kiếm theo hành động, tài nguyên, người thực hiện..."
          emptyTitle="Chưa có bản ghi Audit nào"
          emptyDescription="Mọi đột biến dữ liệu sẽ được tự động lưu vết tại đây."
          defaultPageSize={25}
          exportFileName="skyer-security-audit-logs"
          onRowClick={(log) => setSelectedLog(log)}
          selectedItemId={selectedLog?.id}
        />
      ) : (
        <EnterpriseDataTable
          data={signedIntents}
          columns={intentColumns}
          isLoading={intentsLoading}
          tableKey="admin_iam360_signed_intents"
          searchPlaceholder="Tìm kiếm theo Intent ID, Cell, Agent, Type hoặc Content Hash..."
          emptyTitle="Chưa có Signed Intent nào trong sổ cái"
          emptyDescription="Mọi phân quyền IAM360 được ký Ed25519 sẽ tự động ghi sổ tại đây."
          defaultPageSize={25}
          exportFileName="iam360-signed-intents-ledger"
          onRowClick={(intent) => setSelectedIntent(intent)}
          selectedItemId={selectedIntent?.intent_id}
        />
      )}

      {/* Slide-over Audit Log Detail Drawer */}
      <SlideOverDrawer
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        title={`Audit Record #${selectedLog?.id}`}
        subtitle={`Thời gian: ${selectedLog ? new Date(selectedLog.createdAt).toLocaleString("vi-VN") : ""}`}
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">ACTION</div>
                <div className="font-bold text-[#f8a87c] mt-0.5">{selectedLog.action}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">TARGET</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">{selectedLog.targetResource}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">ACTOR</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">{selectedLog.actorExternalId || `User #${selectedLog.actorId}`}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">IP ADDRESS</div>
                <div className="font-bold text-emerald-400 mt-0.5">{selectedLog.ipAddress || "Internal Gateway"}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300 font-mono">Payload Details (JSON Raw)</span>
              <pre className="p-4 rounded-xl bg-slate-100/70 dark:bg-[#0e0e14] text-slate-800 dark:text-neutral-200 font-mono text-[11px] overflow-x-auto border border-slate-200 dark:border-[#242434] select-all">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </SlideOverDrawer>

      {/* Slide-over Signed Intent Detail Drawer */}
      <SlideOverDrawer
        isOpen={Boolean(selectedIntent)}
        onClose={() => setSelectedIntent(null)}
        title={`IAM360 Intent Envelope: ${selectedIntent?.intent_id}`}
        subtitle={`Schema: ${selectedIntent?.schema} • Ký lúc: ${selectedIntent ? new Date(selectedIntent.issued_at).toLocaleString("vi-VN") : ""}`}
      >
        {selectedIntent && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">ACTION TYPE</div>
                <div className="font-bold text-[#f8a87c] mt-0.5 uppercase">{selectedIntent.type}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">TARGET CELL</div>
                <div className="font-bold text-cyan-400 mt-0.5">{selectedIntent.cell_id}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">RUNTIME / AGENT</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">{selectedIntent.runtime_id} / {selectedIntent.agent_id}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">EXPIRATION</div>
                <div className="font-bold text-amber-400 mt-0.5 truncate">{new Date(selectedIntent.expires_at).toLocaleTimeString("vi-VN")}</div>
              </div>
            </div>

            {/* Cryptographic Proof Card */}
            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5 text-[11px]">
                  <ShieldCheck size={14} />
                  <span>Xác thực Chữ ký Mật mã (Ed25519-compatible RSA-256)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Key ID: {selectedIntent.signature.key_id}</span>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">SHA-256 CONTENT HASH:</div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-emerald-300 break-all select-all flex items-center justify-between">
                  <span>{selectedIntent.signature.content_hash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(selectedIntent.signature.content_hash)}
                    className="p-1 hover:bg-slate-800 rounded ml-2"
                  >
                    {copiedHash === selectedIntent.signature.content_hash ? <Check size={12} className="text-emerald-400" /> : <Hash size={12} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">DETACHED SIGNATURE (Base64):</div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[9px] text-slate-400 break-all select-all max-h-20 overflow-y-auto">
                  {selectedIntent.signature.value}
                </div>
              </div>
            </div>

            {/* Intent Payload */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300 font-mono">Intent Payload Data</span>
              <pre className="p-4 rounded-xl bg-slate-100/70 dark:bg-[#0e0e14] text-slate-800 dark:text-neutral-200 font-mono text-[11px] overflow-x-auto border border-slate-200 dark:border-[#242434] select-all">
                {JSON.stringify(selectedIntent.payload, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </SlideOverDrawer>
    </div>
  );
}
