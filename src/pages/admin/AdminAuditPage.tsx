import React, { useState, useEffect } from "react";
import { Shield, RefreshCw, Clock, User, Activity, AlertCircle, FileText, CheckCircle2, Search } from "lucide-react";
import { DataTable, Column } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Modal } from "../../components/ui/Modal";

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
  const [inspectLog, setInspectLog] = useState<AuditLog | null>(null);

  async function loadAuditLogs() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/admin/audit/logs", {
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
      header: "Timestamp",
      accessorKey: "createdAt",
      sortable: true,
      className: "w-44",
      cell: (log) => (
        <span className="font-mono text-[11px] text-slate-500 dark:text-neutral-400 whitespace-nowrap">
          {new Date(log.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Action",
      accessorKey: "action",
      sortable: true,
      cell: (log) => {
        const isDelete = log.action.includes("DELETE") || log.action.includes("REMOVE");
        const isAssign = log.action.includes("ASSIGN") || log.action.includes("CREATE");
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
      header: "Target Resource",
      accessorKey: "targetResource",
      sortable: true,
      cell: (log) => (
        <span className="font-mono text-[11px] text-slate-800 dark:text-neutral-200">
          {log.targetResource}
        </span>
      ),
    },
    {
      header: "Actor",
      accessorKey: "actorExternalId",
      sortable: true,
      cell: (log) => (
        <span className="text-[11px] text-slate-600 dark:text-neutral-400">
          {log.actorExternalId || (log.actorId ? `User #${log.actorId}` : "System")}
        </span>
      ),
    },
    {
      header: "Details",
      sortable: false,
      cell: (log) => (
        <button
          type="button"
          onClick={() => setInspectLog(log)}
          className="text-[11px] text-[#ff7a00] hover:underline font-mono truncate max-w-xs block cursor-pointer"
        >
          {JSON.stringify(log.details)}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            Security Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Immutable log of administrative operations, role promotions, and agent assignment mutations.
          </p>
        </div>
        <button
          onClick={loadAuditLogs}
          className="p-2 rounded-xl border border-slate-200 dark:border-[#262634] bg-white dark:bg-[#161620] hover:bg-slate-100 dark:hover:bg-[#20202c] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-2 text-xs self-start sm:self-auto shadow-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#14141a] border border-slate-200 dark:border-[#22222c] shadow-xs">
        <DataTable
          data={logs}
          columns={columns}
          isLoading={loading}
          searchPlaceholder="Search by action, resource, actor..."
          emptyTitle="No audit logs recorded yet"
          emptyDescription="Administrative mutations will automatically appear in this immutable trail."
          pageSize={10}
        />
      </div>

      {/* Audit Detail Modal */}
      {inspectLog && (
        <Modal
          isOpen={Boolean(inspectLog)}
          onClose={() => setInspectLog(null)}
          title={`Audit Record #${inspectLog.id}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181822] border border-slate-200 dark:border-[#262634]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">ACTION</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono mt-0.5">{inspectLog.action}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181822] border border-slate-200 dark:border-[#262634]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">TARGET</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono mt-0.5">{inspectLog.targetResource}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181822] border border-slate-200 dark:border-[#262634]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">ACTOR</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{inspectLog.actorExternalId || `User #${inspectLog.actorId}`}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181822] border border-slate-200 dark:border-[#262634]">
                <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">TIMESTAMP</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono mt-0.5">{new Date(inspectLog.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300">Payload Details (JSON)</span>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
                {JSON.stringify(inspectLog.details, null, 2)}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
