import React, { useState, useEffect } from "react";
import { ShieldCheck, GitBranch, ChevronRight, ChevronDown } from "lucide-react";
import { fetchAgentIam360Cell, Iam360AgentCellInspection } from "../services/iam360CellsApi";

interface AgentIam360MiniCardProps {
  agentId: string;
  agentSlug: string;
  onOpenFullWorkbench: () => void;
}

export function AgentIam360MiniCard({ agentId, agentSlug, onOpenFullWorkbench }: AgentIam360MiniCardProps) {
  const [data, setData] = useState<Iam360AgentCellInspection | null>(null);
  const [treeExpanded, setTreeExpanded] = useState(false);

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
      <div className="h-24 w-full rounded-xl skeleton-shimmer border border-slate-200/80 dark:border-[#22222e]" />
    );
  }

  const { identity_cell: identity, primary_organization_cell: org } = data;
  const principals = identity.observed_principals || [];
  const a2aAllowed = (identity.a2a_delegation_targets || []).filter((t) => t.allowed);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-slate-400" />
          <span>Phân quyền IAM360</span>
        </span>
        <button
          type="button"
          onClick={onOpenFullWorkbench}
          className="text-[11px] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-0.5 cursor-pointer"
        >
          <span>Chi tiết</span>
          <ChevronRight size={12} />
        </button>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#14141c] border border-slate-200/90 dark:border-[#22222e] space-y-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400">Identity Cell</div>
            <div className="font-mono font-medium text-slate-900 dark:text-white truncate text-[11px] flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${identity.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
              <span>{identity.identity_cell_id}</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200/70 dark:bg-white/5 text-slate-700 dark:text-neutral-300 shrink-0 uppercase">
            {identity.cell_role}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/70 dark:border-[#20202c]">
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400">Organization Cell</div>
            <div className="font-mono font-medium text-slate-800 dark:text-neutral-200 truncate text-[11px]">
              {org.cell_id} ({org.organization.toUpperCase()})
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 shrink-0">
            {identity.enabled_mcp_count}/{identity.mcp_count} MCP • {identity.enabled_tool_count}/{identity.tool_count} Tools
          </span>
        </div>

        <div className="pt-2 border-t border-slate-200/70 dark:border-[#20202c]">
          <button
            type="button"
            onClick={() => setTreeExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <GitBranch size={12} className="text-slate-400" />
              <span>Tóm tắt ({identity.memberships.length} Org • {a2aAllowed.length} A2A • {principals.length} Kênh)</span>
            </span>
            {treeExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>

          {treeExpanded && (
            <div className="mt-2 pl-2.5 border-l border-slate-200 dark:border-[#282838] space-y-1 font-mono text-[10px] text-slate-500 dark:text-neutral-400">
              <div>• Tổ chức: {identity.memberships.map((m) => `${m.cell_id} (${m.role})`).join(", ")}</div>
              <div>
                • Ủy quyền A2A:{" "}
                {a2aAllowed.length > 0
                  ? `${a2aAllowed.slice(0, 3).map((a) => a.target_slug).join(", ")}${a2aAllowed.length > 3 ? "..." : ""}`
                  : "Giới hạn nội bộ"}
              </div>
              <div>• Người dùng: {principals.map((p) => p.user_id).join(", ")}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
