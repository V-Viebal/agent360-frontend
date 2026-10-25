import React, { useState, useEffect } from "react";
import { ShieldCheck, Building2, GitBranch, ChevronRight, ChevronDown, CheckCircle2, Lock } from "lucide-react";
import { fetchAgentIam360Cell, Iam360AgentCellInspection } from "../services/iam360CellsApi";

interface AgentIam360MiniCardProps {
  agentId: string;
  agentSlug: string;
  onOpenFullWorkbench: () => void;
}

export function AgentIam360MiniCard({ agentId, agentSlug, onOpenFullWorkbench }: AgentIam360MiniCardProps) {
  const [data, setData] = useState<Iam360AgentCellInspection | null>(null);
  const [treeExpanded, setTreeExpanded] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchAgentIam360Cell(agentSlug || agentId, false).then((res) => {
      if (mounted) setData(res);
    });
    return () => {
      mounted = false;
    };
  }, [agentId, agentSlug]);

  if (!data) {
    return (
      <div className="h-28 w-full rounded-2xl skeleton-shimmer border border-slate-200/80 dark:border-[#22222e]" />
    );
  }

  const { identity_cell: identity, primary_organization_cell: org } = data;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-[#f8a87c]" />
          <span>IAM360 Identity & Org Cell</span>
        </span>
        <button
          type="button"
          onClick={onOpenFullWorkbench}
          className="text-[11px] font-mono text-[#e0682b] dark:text-[#f8a87c] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>Quản lý & Cây quyền</span>
          <ChevronRight size={12} />
        </button>
      </div>

      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#14141c] border border-slate-200/90 dark:border-[#22222e] space-y-2.5 text-xs">
        {/* Personal Identity Cell Pill */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-neutral-400">Personal Identity Cell (1:1)</div>
            <div className="font-mono font-semibold text-slate-900 dark:text-white truncate text-[11px]">
              {identity.identity_cell_id}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#86efac] border border-emerald-500/30 shrink-0">
            {identity.assurance}
          </span>
        </div>

        {/* Organization Cell & Role */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/70 dark:border-[#20202c]">
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-neutral-400">Organization Cell (Tenant)</div>
            <div className="font-mono font-semibold text-[#e0682b] dark:text-[#f8a87c] truncate text-[11px]">
              {org.cell_id} • {org.organization.toUpperCase()}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30 uppercase shrink-0">
            {identity.cell_role === "owner" ? "👑 Owner" : identity.cell_role === "manager" ? "◆ Manager" : "● Employee"}
          </span>
        </div>

        {/* Collapsible Mini Permission Tree */}
        <div className="pt-2 border-t border-slate-200/70 dark:border-[#20202c]">
          <button
            type="button"
            onClick={() => setTreeExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] font-mono text-slate-700 dark:text-neutral-300 hover:text-[#f8a87c] cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <GitBranch size={12} className="text-purple-400" />
              <span>Cây phân quyền ({identity.memberships.length} Org • {identity.enabled_mcp_count} MCP • {identity.enabled_tool_count} Tools)</span>
            </span>
            {treeExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>

          {treeExpanded && (
            <div className="mt-2 pl-2.5 border-l border-dashed border-slate-300 dark:border-[#2c2c3c] space-y-1.5 font-mono text-[10px]">
              {/* Node 1: Identity -> Org Memberships */}
              <div className="space-y-1">
                <div className="text-slate-800 dark:text-neutral-200 font-semibold flex items-center gap-1">
                  <Building2 size={11} className="text-[#f8a87c]" />
                  <span>Tổ chức ({identity.memberships.length} Cells):</span>
                </div>
                <div className="pl-3 flex flex-wrap gap-1">
                  {identity.memberships.map((m) => (
                    <span
                      key={m.cell_id}
                      className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1b1b26] border border-slate-200 dark:border-[#282838] text-slate-700 dark:text-neutral-300"
                    >
                      {m.cell_id} ({m.role})
                    </span>
                  ))}
                </div>
              </div>

              {/* Node 2: Capabilities */}
              <div className="space-y-1">
                <div className="text-slate-800 dark:text-neutral-200 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                  <span>Quyền thực thi (Cerbos ABAC):</span>
                </div>
                <div className="pl-3 text-neutral-500 dark:text-neutral-400">
                  {identity.mcp_clients.slice(0, 3).map((m) => m.key).join(", ")}
                  {identity.mcp_clients.length > 3 ? ` +${identity.mcp_clients.length - 3} MCP` : ""} • {identity.enabled_tool_count} Builtin Tools
                </div>
              </div>

              {/* Node 3: Baseline Guardrail */}
              <div className="flex items-center gap-1 text-rose-500 dark:text-[#fda4af]">
                <Lock size={11} />
                <span className="truncate">Baseline: Isolated {identity.workspace_dir}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
