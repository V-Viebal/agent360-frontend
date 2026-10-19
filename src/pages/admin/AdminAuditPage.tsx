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
  ExternalLink
} from "lucide-react";
import { EnterpriseDataTable, Column } from "../../components/ui/EnterpriseDataTable";
import { SlideOverDrawer } from "../../components/ui/SlideOverDrawer";

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
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  async function loadAuditLogs() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
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

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const columns: Column<AuditLog>[] = [
    {
      header: "Thời Gian",
      accessorKey: "createdAt",
      sortable: true,
      width: "18%",
      cell: (log) => (
        <span className="font-mono text-[11px] text-neutral-400 whitespace-nowrap">
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
                : "bg-[#ff7a00]/15 text-[#ff7a00] border-[#ff7a00]/25"
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
        <span className="font-mono text-[11px] text-white truncate block">
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
        <span className="text-[11px] text-neutral-300 font-mono truncate block">
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
          className="text-[11px] text-[#ff7a00] hover:underline font-mono truncate max-w-[140px] inline-block cursor-pointer"
        >
          {typeof log.details === "object" ? JSON.stringify(log.details) : String(log.details)}
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 space-y-3">
      {/* Header Tier */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>Security Audit Trail & Sổ Cái An Ninh</span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {logs.length} Bản ghi
            </span>
          </h1>
          <p className="text-[11px] text-neutral-400">
            Sổ cái bất biến ghi nhận mọi đột biến quyền hạn, cấp vai trò, gán Agent và thao tác quản trị Root.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAuditLogs}
            className="p-1.5 rounded-xl border border-[#262634] bg-[#161620] hover:bg-[#20202c] text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
            title="Tải lại logs"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline text-[11px]">Tải lại</span>
          </button>
        </div>
      </div>

      {/* Main Full-Height Power Table */}
      <EnterpriseDataTable
        data={logs}
        columns={columns}
        isLoading={loading}
        tableKey="admin_audit"
        searchPlaceholder="Tìm kiếm theo hành động, tài nguyên, người thực hiện..."
        emptyTitle="Chưa có bản ghi Audit nào"
        emptyDescription="Mọi đột biến dữ liệu sẽ được tự động lưu vết tại đây."
        defaultPageSize={25}
        exportFileName="agent360-security-audit-logs"
        onRowClick={(log) => setSelectedLog(log)}
        selectedItemId={selectedLog?.id}
      />

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
              <div className="p-3 rounded-xl bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-neutral-400">ACTION</div>
                <div className="font-bold text-[#ff7a00] mt-0.5">{selectedLog.action}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-neutral-400">TARGET</div>
                <div className="font-bold text-white mt-0.5 truncate">{selectedLog.targetResource}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-neutral-400">ACTOR</div>
                <div className="font-bold text-white mt-0.5 truncate">{selectedLog.actorExternalId || `User #${selectedLog.actorId}`}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#181824] border border-[#262636]">
                <div className="text-[10px] text-neutral-400">IP ADDRESS</div>
                <div className="font-bold text-emerald-400 mt-0.5">{selectedLog.ipAddress || "Internal Gateway"}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-neutral-300 font-mono">Payload Details (JSON Raw)</span>
              <pre className="p-4 rounded-xl bg-[#0e0e14] text-neutral-200 font-mono text-[11px] overflow-x-auto border border-[#242434] select-all">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </SlideOverDrawer>
    </div>
  );
}
