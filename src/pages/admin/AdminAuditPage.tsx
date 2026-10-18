import React, { useState, useEffect } from "react";
import { Shield, RefreshCw, Clock, User, Activity, AlertCircle } from "lucide-react";

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Security Audit Trail</h1>
          <p className="text-xs text-neutral-400">
            Immutable log of administrative operations, role promotions, and agent assignment mutations.
          </p>
        </div>
        <button
          onClick={loadAuditLogs}
          className="p-2 rounded-xl border border-[#262634] bg-[#161620] hover:bg-[#20202c] text-neutral-300 transition-colors cursor-pointer flex items-center gap-2 text-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c]">
        {loading ? (
          <div className="py-12 text-center text-xs text-neutral-500">Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">No administrative mutations recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#22222e] text-[11px] text-neutral-500 uppercase tracking-wider font-mono">
                <tr>
                  <th className="pb-3 pl-2">Timestamp</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Target Resource</th>
                  <th className="pb-3">Actor</th>
                  <th className="pb-3 pr-2">Metadata Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e28]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#181822]/60 transition-colors">
                    <td className="py-3 pl-2 text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 font-semibold text-white">
                      <span className="px-2 py-0.5 rounded-md bg-[#ff7a00]/15 text-[#ff7a00] font-mono text-[10px] border border-[#ff7a00]/25">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-neutral-200 font-mono text-[11px]">
                      {log.targetResource}
                    </td>
                    <td className="py-3 text-neutral-400 text-[11px]">
                      {log.actorExternalId || `User #${log.actorId}`}
                    </td>
                    <td className="py-3 pr-2 text-neutral-400 font-mono text-[10px] max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
