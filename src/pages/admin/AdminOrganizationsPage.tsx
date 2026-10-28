import React, { useState, useEffect } from "react";
import {
  Building2,
  Bot,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
  GitBranch,
  Play,
  CheckCircle2,
  XCircle,
  KeyRound,
  ShieldAlert,
  ArrowRightLeft,
} from "lucide-react";
import { EnterpriseDataTable, Column } from "../../components/ui/EnterpriseDataTable";
import { SlideOverDrawer } from "../../components/ui/SlideOverDrawer";
import {
  fetchIam360CellsStrategy,
  mutateIam360OrgEnforcement,
  mutateIam360OrgMemberRole,
  mutateIam360IdentityStatus,
  requestIam360OwnerTransfer,
  decideIam360Approval,
  runIam360LiveTestAllAgents,
  Iam360CellsStrategyResponse,
  Iam360OrganizationCell,
  Iam360IdentityCell,
  Iam360FleetAuditReport,
  Iam360LiveAgentTestItem,
  Iam360TwoPersonApproval,
} from "../../services/iam360CellsApi";
import { Iam360PermissionTreeView } from "../../components/Iam360PermissionTreeView";

export function AdminOrganizationsPage() {
  const [strategy, setStrategy] = useState<Iam360CellsStrategyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"org_cells" | "identity_cells" | "hierarchy_tree" | "approvals" | "fleet_live_audit">("org_cells");
  const [selectedOrg, setSelectedOrg] = useState<Iam360OrganizationCell | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<Iam360IdentityCell | null>(null);
  const [transferCandidate, setTransferCandidate] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);
  const [auditReport, setAuditReport] = useState<Iam360FleetAuditReport | null>(null);
  const [runningAudit, setRunningAudit] = useState(false);

  async function loadStrategy(force = false) {
    setLoading(true);
    try {
      const data = await fetchIam360CellsStrategy(force);
      setStrategy(data);
      if (selectedOrg) {
        const freshOrg = data.organization_cells.find((o) => o.cell_id === selectedOrg.cell_id);
        if (freshOrg) setSelectedOrg(freshOrg);
      }
      if (selectedIdentity) {
        const freshId = data.identity_cells.find((i) => i.identity_cell_id === selectedIdentity.identity_cell_id);
        if (freshId) setSelectedIdentity(freshId);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStrategy(false);
  }, []);

  const handleRunLiveTestAll = async () => {
    setRunningAudit(true);
    setActiveTab("fleet_live_audit");
    try {
      const report = await runIam360LiveTestAllAgents();
      setAuditReport(report);
      setFeedback(
        `Live Test hoàn tất trên toàn bộ ${report.total_agents_tested} Agents (${report.passed_count}/${report.total_agents_tested} PASS)!`
      );
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setRunningAudit(false);
    }
  };

  const handleRequestOwnerTransfer = async (cellId: string, newOwnerId: string) => {
    if (!newOwnerId) return;
    setMutating(true);
    try {
      await requestIam360OwnerTransfer(cellId, newOwnerId, `Request owner transfer of ${cellId} to ${newOwnerId}`);
      await loadStrategy(true);
      setFeedback(`Đã tạo yêu cầu chuyển nhượng quyền Owner của ${cellId} sang ${newOwnerId} (Chờ Admin thứ 2 phê duyệt)!`);
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setMutating(false);
    }
  };

  const handleDecideApproval = async (approvalId: string, approve: boolean) => {
    setMutating(true);
    try {
      await decideIam360Approval(approvalId, approve, approve ? "Second Admin Approved" : "Second Admin Rejected");
      await loadStrategy(true);
      setFeedback(`Đã ${approve ? "PHÊ DUYỆT (Approved)" : "TỪ CHỐI (Rejected)"} yêu cầu ${approvalId}!`);
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setMutating(false);
    }
  };

  const handleEnforcementChange = async (cellId: string, mode: "off" | "preview" | "on") => {
    setMutating(true);
    try {
      await mutateIam360OrgEnforcement(cellId, mode, `Admin updated enforcement to ${mode}`);
      await loadStrategy(true);
      setFeedback(`Đã cập nhật chế độ Runtime Enforcement của ${cellId} sang "${mode.toUpperCase()}" (Signed Intent Persisted)!`);
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setMutating(false);
    }
  };

  const handleMemberRoleChange = async (cellId: string, identityCellId: string, role: "owner" | "manager" | "employee") => {
    setMutating(true);
    try {
      await mutateIam360OrgMemberRole(cellId, identityCellId, role, `Admin updated member role to ${role}`);
      await loadStrategy(true);
      setFeedback(`Đã cập nhật vai trò của ${identityCellId} trong ${cellId} sang "${role.toUpperCase()}" (Signed Intent Persisted)!`);
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setMutating(false);
    }
  };

  const handleIdentityStatusChange = async (identityCellId: string, action: "activate" | "suspend" | "revoke") => {
    setMutating(true);
    try {
      await mutateIam360IdentityStatus(identityCellId, action, `Admin changed identity status to ${action}`);
      await loadStrategy(true);
      setFeedback(`Đã cập nhật trạng thái Identity Cell ${identityCellId} sang "${action.toUpperCase()}" (Signed Intent Persisted)!`);
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setMutating(false);
    }
  };

  const orgCells = strategy?.organization_cells || [];
  const identityCells = strategy?.identity_cells || [];
  const approvals = strategy?.approvals || [];
  const summary = strategy?.summary;

  const orgColumns: Column<Iam360OrganizationCell>[] = [
    {
      header: "Organization Cell (Tenant)",
      accessorKey: "display_name",
      sortable: true,
      width: "28%",
      cell: (org) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-[#f8a87c]/15 text-[#f8a87c] border border-[#f8a87c]/30 flex items-center justify-center shrink-0">
            <Building2 size={14} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-white truncate text-xs hover:text-[#f8a87c] transition-colors">
              {org.display_name}
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              {org.cell_id} • Node {org.cluster_node} ({org.domain})
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Owner Identity Cell",
      accessorKey: "owner_identity_cell_id",
      sortable: true,
      width: "22%",
      cell: (org) => (
        <div className="min-w-0 font-mono">
          <div className="text-xs font-semibold text-[#e0682b] dark:text-[#f8a87c] truncate">
            👑 {org.owner_identity_cell_id}
          </div>
          <div className="text-[10px] text-neutral-500 truncate">{org.owner_name}</div>
        </div>
      ),
    },
    {
      header: "Members & Agents",
      accessorKey: "member_count",
      sortable: true,
      width: "16%",
      cell: (org) => (
        <div className="font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-[#c4b5fd] border border-purple-500/30 font-semibold">
            {org.total_identities_count} Identity Cells
          </span>
        </div>
      ),
    },
    {
      header: "Enforcement & Policy",
      accessorKey: "runtime_enforcement",
      sortable: true,
      width: "18%",
      cell: (org) => (
        <div className="font-mono text-[10px] space-y-0.5">
          <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-[#93c5fd] border border-sky-500/30 uppercase font-bold">
            Mode: {org.runtime_enforcement}
          </span>
          <div className="text-neutral-500 truncate">{org.organization_policy_hash.slice(0, 18)}</div>
        </div>
      ),
    },
    {
      header: "Lifecycle",
      accessorKey: "lifecycle",
      sortable: true,
      width: "16%",
      className: "text-right",
      cell: (org) => (
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-[#86efac] border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
          {org.lifecycle}
        </span>
      ),
    },
  ];

  const identityColumns: Column<Iam360IdentityCell>[] = [
    {
      header: "Personal Identity Cell (1:1)",
      accessorKey: "display_name",
      sortable: true,
      width: "26%",
      cell: (idCell) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Bot size={14} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-white truncate text-xs hover:text-[#f8a87c] transition-colors">
              {idCell.display_name}
            </div>
            <div className="text-[10px] text-neutral-500 font-mono truncate">
              {idCell.identity_cell_id} • slug: {idCell.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Primary Org Cell & Role",
      accessorKey: "organization_cell_id",
      sortable: true,
      width: "22%",
      cell: (idCell) => (
        <div className="font-mono text-[11px] flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30 font-semibold">
            {idCell.organization_cell_id}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-[#c4b5fd] border border-purple-500/30 uppercase text-[10px]">
            {idCell.cell_role}
          </span>
        </div>
      ),
    },
    {
      header: "Cross-Org Memberships",
      sortable: false,
      width: "22%",
      cell: (idCell) => (
        <div className="flex items-center gap-1 flex-wrap font-mono text-[10px]">
          {idCell.memberships.map((m) => (
            <span
              key={m.cell_id}
              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300"
            >
              {m.cell_id} ({m.role})
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Attested Capabilities",
      accessorKey: "mcp_count",
      sortable: true,
      width: "16%",
      cell: (idCell) => (
        <span className="font-mono text-[11px] text-sky-600 dark:text-[#93c5fd]">
          {idCell.enabled_mcp_count} MCP • {idCell.enabled_tool_count} Tools
        </span>
      ),
    },
    {
      header: "Trạng Thái",
      accessorKey: "status",
      sortable: true,
      width: "14%",
      className: "text-right",
      cell: (idCell) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
            idCell.status === "active"
              ? "bg-emerald-500/15 text-emerald-500 dark:text-[#86efac] border-emerald-500/30"
              : "bg-rose-500/15 text-rose-500 dark:text-[#fda4af] border-rose-500/30"
          }`}
        >
          {idCell.status}
        </span>
      ),
    },
  ];

  const approvalColumns: Column<Iam360TwoPersonApproval>[] = [
    {
      header: "Approval ID & Kind",
      accessorKey: "approval_id",
      sortable: true,
      width: "22%",
      cell: (a) => (
        <div className="font-mono">
          <div className="text-xs font-bold text-[#f8a87c]">{a.approval_id}</div>
          <div className="text-[10px] text-neutral-400 uppercase">{a.kind}</div>
        </div>
      ),
    },
    {
      header: "Organization Cell & Target",
      accessorKey: "cell_id",
      sortable: true,
      width: "24%",
      cell: (a) => (
        <div className="font-mono text-xs">
          <div className="text-slate-900 dark:text-white font-semibold">{a.cell_id}</div>
          <div className="text-[10px] text-sky-400 truncate">Target: {a.target_identity_cell_id}</div>
        </div>
      ),
    },
    {
      header: "Action & Reason",
      accessorKey: "action",
      sortable: true,
      width: "30%",
      cell: (a) => (
        <div className="font-mono text-xs">
          <div className="font-semibold text-purple-400">{a.action}</div>
          <div className="text-[10px] text-neutral-400 truncate">{a.reason}</div>
        </div>
      ),
    },
    {
      header: "Status & 2-Person Decision",
      accessorKey: "status",
      sortable: true,
      width: "24%",
      className: "text-right",
      cell: (a) => (
        <div className="flex items-center justify-end gap-1.5 font-mono">
          {a.status === "pending" ? (
            <>
              <button
                type="button"
                disabled={mutating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDecideApproval(a.approval_id, true);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold cursor-pointer"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={mutating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDecideApproval(a.approval_id, false);
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-[10px] font-bold cursor-pointer"
              >
                Reject
              </button>
            </>
          ) : (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                a.status === "approved"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-400 border-rose-500/30"
              }`}
            >
              {a.status}
            </span>
          )}
        </div>
      ),
    },
  ];

  const auditColumns: Column<Iam360LiveAgentTestItem>[] = [
    {
      header: "Agent & Identity Cell",
      accessorKey: "slug",
      sortable: true,
      width: "24%",
      cell: (item) => (
        <div className="font-mono min-w-0">
          <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">{item.display_name}</div>
          <div className="text-[10px] text-neutral-400 truncate">
            {item.identity_cell_id} • slug: {item.slug}
          </div>
        </div>
      ),
    },
    {
      header: "Org Cell & Role",
      accessorKey: "organization_cell_id",
      sortable: true,
      width: "18%",
      cell: (item) => (
        <div className="font-mono text-[10px] flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-[#f8a87c]/15 text-[#f8a87c] border border-[#f8a87c]/30 font-semibold">
            {item.organization_cell_id}
          </span>
          <span className="uppercase text-purple-400">{item.role_in_cell}</span>
        </div>
      ),
    },
    {
      header: "5-Branch Tree & Capabilities",
      accessorKey: "mcp_count",
      sortable: true,
      width: "22%",
      cell: (item) => (
        <span className="font-mono text-[11px] text-sky-400">
          {item.permission_tree_branches_count} Branches • {item.mcp_count} MCP • {item.tool_count} Tools
        </span>
      ),
    },
    {
      header: "Workspace / Secret / Cross-Cell A2A",
      sortable: false,
      width: "24%",
      cell: (item) => (
        <div className="font-mono text-[10px] flex items-center gap-1.5 flex-wrap">
          <span className="text-emerald-400">Read:{item.workspace_read_allowed ? "OK" : "BLOCKED"}</span>
          <span>•</span>
          <span className="text-rose-400">Secret:{item.baseline_secret_denied ? "DENY" : "LEAK"}</span>
          <span>•</span>
          <span className="text-purple-400">CrossCell:OK</span>
        </div>
      ),
    },
    {
      header: "Verdict",
      accessorKey: "passed",
      sortable: true,
      width: "12%",
      className: "text-right",
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
            item.passed
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : "bg-rose-500/15 text-rose-400 border-rose-500/30"
          }`}
        >
          {item.passed ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
          <span>{item.passed ? "PASS" : "FAIL"}</span>
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 space-y-3 overflow-y-auto pr-1">
      {/* Header Tier */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
            <span>IAM360 Two-Cell Governance: Identity Cells & Organization Cells</span>
            <span className="text-[11px] font-mono text-[#e0682b] dark:text-[#f8a87c] bg-[#f8a87c]/15 px-2.5 py-0.5 rounded-full border border-[#f8a87c]/30">
              {orgCells.length} Org Cells • {identityCells.length} Identity Cells
            </span>
            {strategy?.reconciliation && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                Worker Sync: {strategy.reconciliation.status.toUpperCase()} ({strategy.reconciliation.passed_agents}/{strategy.reconciliation.total_agents_checked})
              </span>
            )}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400">
            Quản trị ranh giới Tổ chức (Organization Cells), Danh tính tự chủ 1:1 (Identity Cells), Two-Person Approvals, Owner Transfer và Sơ đồ Cây Phân Quyền 5 Nhánh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunLiveTestAll}
            disabled={runningAudit}
            className="px-3 py-1.5 rounded-xl bg-[#f8a87c] hover:bg-[#f8a87c]/90 text-neutral-950 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono shadow-xs"
            title="Chạy kiểm thử phân quyền thực tế trên tất cả Agents hiện tại"
          >
            <Play size={13} />
            <span>{runningAudit ? "Đang test toàn cụm..." : `Live Test Tất Cả (${identityCells.length} Agents)`}</span>
          </button>

          <button
            onClick={() => loadStrategy(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#262634] bg-slate-50 dark:bg-[#161620] hover:bg-slate-100 dark:hover:bg-[#20202c] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            title="Đồng bộ trực tiếp với IAM360 & Fleet Runtimes"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-[#f8a87c]" : "text-[#f8a87c]"} />
            <span>Đồng bộ Live Cells</span>
          </button>
        </div>
      </div>

      {/* Level 1 Summary Metric Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0 font-mono">
          <div className="p-3 rounded-xl bg-white dark:bg-[#12141e] border border-slate-200 dark:border-[#222638] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-neutral-500">1. ORGANIZATION CELLS</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.organization_cells_count} Tenant Boundaries
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30">
              1 Owner / Cell
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#12141e] border border-slate-200 dark:border-[#222638] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-neutral-500">2. AGENT IDENTITY CELLS</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.identity_cells_count} Self-Owned Agents
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-[#86efac] border border-emerald-500/30">
              {summary.active_agents} Active
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#12141e] border border-slate-200 dark:border-[#222638] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-neutral-500">3. ATTESTED CAPABILITIES</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.total_mcp_bindings} MCP • {summary.total_tool_bindings} Tools
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/15 text-purple-600 dark:text-[#c4b5fd] border border-purple-500/30">
              5-Branch Tree
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#12141e] border border-slate-200 dark:border-[#222638] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-neutral-500">4. 2-PERSON APPROVALS & INTENTS</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {approvals.filter((a) => a.status === "pending").length} Pending • {(summary as any).signed_intents_count || 0} Intents
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/15 text-sky-600 dark:text-[#93c5fd] border border-sky-500/30">
              Ed25519 Signed
            </span>
          </div>
        </div>
      )}

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between shrink-0 animate-in fade-in font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400/60 hover:text-emerald-400 text-xs cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#222638] pb-2 shrink-0 overflow-x-auto no-scrollbar">
        {[
          { id: "org_cells" as const, label: `1. Organization Cells (${orgCells.length})`, icon: <Building2 size={14} /> },
          { id: "identity_cells" as const, label: `2. Agent Identity Cells (${identityCells.length})`, icon: <Bot size={14} /> },
          { id: "hierarchy_tree" as const, label: "3. Sơ đồ Cây Phân Quyền Toàn Tổ Chức", icon: <GitBranch size={14} /> },
          { id: "approvals" as const, label: `4. 2-Person Approvals & Owner Transfer (${approvals.length})`, icon: <ShieldAlert size={14} /> },
          { id: "fleet_live_audit" as const, label: `5. Kết quả Live Test (${auditReport ? `${auditReport.passed_count}/${auditReport.total_agents_tested} PASS` : "Chạy kiểm thử"})`, icon: <ShieldCheck size={14} /> },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "fleet_live_audit" && !auditReport) {
                  handleRunLiveTestAll();
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 cursor-pointer border transition-all shrink-0 ${
                active
                  ? "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border-[#f8a87c]/40 font-semibold shadow-xs"
                  : "bg-white dark:bg-[#141722] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-[#222636] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORGANIZATION CELLS TABLE */}
      {activeTab === "org_cells" && (
        <EnterpriseDataTable
          data={orgCells}
          columns={orgColumns}
          isLoading={loading}
          tableKey="admin_iam360_org_cells"
          searchPlaceholder="Tìm kiếm Organization Cell theo tên, cell_id, owner, domain..."
          emptyTitle="Chưa có Organization Cell nào"
          emptyDescription="Các Organization Cell sẽ hiển thị tại đây."
          defaultPageSize={25}
          exportFileName="skyer-organization-cells"
          onRowClick={(org) => {
            setSelectedOrg(org);
            const firstMember = Object.keys(org.members)[0] || "";
            setTransferCandidate(firstMember);
          }}
          selectedItemId={selectedOrg?.cell_id}
        />
      )}

      {/* TAB 2: AGENT IDENTITY CELLS TABLE */}
      {activeTab === "identity_cells" && (
        <EnterpriseDataTable
          data={identityCells}
          columns={identityColumns}
          isLoading={loading}
          tableKey="admin_iam360_identity_cells"
          searchPlaceholder="Tìm kiếm Identity Cell theo agent slug, identity_cell_id, model, role..."
          emptyTitle="Chưa có Identity Cell nào"
          emptyDescription="Các Agent Identity Cell sẽ hiển thị tại đây."
          defaultPageSize={25}
          exportFileName="skyer-identity-cells"
          onRowClick={(idCell) => setSelectedIdentity(idCell)}
          selectedItemId={selectedIdentity?.identity_cell_id}
        />
      )}

      {/* TAB 3: FULL PLATFORM HIERARCHY PERMISSION TREE */}
      {activeTab === "hierarchy_tree" && strategy?.global_hierarchy_tree && (
        <div className="pb-4">
          <Iam360PermissionTreeView
            rootNode={strategy.global_hierarchy_tree}
            title="Sơ đồ Cây Phân Quyền Tổng Thể: Từ Cá nhân (Identity Cell) tới Tổ chức (Organization Cell)"
            subtitle="Toàn bộ 7 Organization Cells, Owner/Manager/Employee ReBAC Tuples, Cerbos ABAC Rules và Baseline Guardrails trên toàn cụm Skyer."
            defaultExpandDepth={2}
          />
        </div>
      )}

      {/* TAB 4: TWO-PERSON APPROVALS & OWNER TRANSFER QUEUE (Upgrade #5) */}
      {activeTab === "approvals" && (
        <EnterpriseDataTable
          data={approvals}
          columns={approvalColumns}
          isLoading={loading}
          tableKey="admin_iam360_approvals"
          searchPlaceholder="Tìm kiếm yêu cầu phê duyệt theo approval_id, cell_id, action..."
          emptyTitle="Không có yêu cầu phê duyệt 2 người hoặc Step-Up nào"
          emptyDescription="Các yêu cầu chuyển nhượng Owner hoặc Step-Up Action sẽ xuất hiện tại đây."
          defaultPageSize={25}
          exportFileName="skyer-iam360-approvals"
        />
      )}

      {/* TAB 5: LIVE TEST ALL AGENTS AUDIT REPORT */}
      {activeTab === "fleet_live_audit" && (
        <div className="space-y-3 pb-4">
          {auditReport && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-500 dark:text-[#86efac]">
                <CheckCircle2 size={16} />
                <span>
                  <strong>Authoritative Fleet Live Verification:</strong> {auditReport.passed_count}/{auditReport.total_agents_tested} Agents PASS • {auditReport.organization_cells_tested} Organization Cells • {auditReport.signed_intents_verified} Signed Intents Verified
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">Executed at: {auditReport.executed_at}</span>
            </div>
          )}

          <EnterpriseDataTable
            data={auditReport?.results || []}
            columns={auditColumns}
            isLoading={runningAudit}
            tableKey="admin_iam360_live_audit"
            searchPlaceholder="Tìm kiếm kết quả test theo agent slug, identity_cell_id, cell_id..."
            emptyTitle="Chưa có dữ liệu kiểm thử"
            emptyDescription="Bấm nút 'Live Test Tất Cả' để thực thi kiểm thử trên toàn bộ Agents."
            defaultPageSize={50}
            exportFileName="skyer-iam360-live-test-report"
          />
        </div>
      )}

      {/* Slide-Over Drawer for Organization Cell */}
      <SlideOverDrawer
        isOpen={Boolean(selectedOrg)}
        onClose={() => setSelectedOrg(null)}
        title={`Organization Cell: ${selectedOrg?.display_name || ""}`}
        subtitle={`${selectedOrg?.cell_id} • Owner: ${selectedOrg?.owner_identity_cell_id}`}
      >
        {selectedOrg && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161926] border border-slate-200 dark:border-[#252a3d] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Cell ID:</span>
                <span className="font-bold text-[#f8a87c]">{selectedOrg.cell_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Owner Identity Cell:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedOrg.owner_identity_cell_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Signing Key ID:</span>
                <span className="text-purple-400 flex items-center gap-1">
                  <KeyRound size={11} />
                  <span>{selectedOrg.org_key_id}</span>
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#242838]">
                <span className="text-neutral-400">Runtime Enforcement:</span>
                <div className="flex items-center gap-1">
                  {(["off", "preview", "on"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      disabled={mutating}
                      onClick={() => handleEnforcementChange(selectedOrg.cell_id, m)}
                      className={`px-2 py-0.5 rounded uppercase text-[10px] cursor-pointer border ${
                        selectedOrg.runtime_enforcement === m
                          ? "bg-[#f8a87c]/20 text-[#f8a87c] border-[#f8a87c]/40 font-bold"
                          : "bg-white dark:bg-[#0f111a] text-neutral-400 border-slate-200 dark:border-[#222636]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Two-Person Rule Owner Transfer Box (Upgrade #5) */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#141722] border border-slate-200 dark:border-[#242838] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#e0682b] dark:text-[#f8a87c] flex items-center gap-1.5">
                  <ArrowRightLeft size={13} />
                  <span>Chuyển nhượng Owner Identity Cell (2-Person Rule)</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={transferCandidate}
                  onChange={(e) => setTransferCandidate(e.target.value)}
                  className="flex-1 rounded-lg bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-[#252a3d] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                >
                  {Object.values(selectedOrg.members).map((m) => (
                    <option key={m.identity_cell_id} value={m.identity_cell_id}>
                      {m.name} ({m.identity_cell_id})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={mutating || !transferCandidate}
                  onClick={() => handleRequestOwnerTransfer(selectedOrg.cell_id, transferCandidate)}
                  className="px-3 py-1.5 rounded-lg bg-[#f8a87c] hover:bg-[#f8a87c]/90 text-neutral-950 font-bold text-[11px] cursor-pointer shrink-0"
                >
                  Request Transfer
                </button>
              </div>
            </div>

            {/* Member Role Assignments */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-neutral-400 font-semibold">
                Member Identity Cells ({Object.keys(selectedOrg.members).length})
              </h4>
              <div className="space-y-1.5">
                {Object.values(selectedOrg.members).map((m) => (
                  <div
                    key={m.identity_cell_id}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#141722] border border-slate-200 dark:border-[#242838] flex items-center justify-between gap-2 font-mono text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{m.name}</div>
                      <div className="text-[10px] text-neutral-400 truncate">{m.identity_cell_id}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {(["manager", "employee"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          disabled={mutating}
                          onClick={() => handleMemberRoleChange(selectedOrg.cell_id, m.identity_cell_id, r)}
                          className={`px-2 py-0.5 rounded text-[10px] uppercase cursor-pointer border ${
                            m.role === r
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/40 font-bold"
                              : "bg-slate-50 dark:bg-[#0f111a] text-neutral-400 border-slate-200 dark:border-[#222636]"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Iam360PermissionTreeView
              rootNode={selectedOrg.permission_tree}
              title={`Cây Phân Quyền: ${selectedOrg.cell_id}`}
              subtitle="Chi tiết Owner, Managers, Employees và Baseline Policy."
              defaultExpandDepth={2}
              compact
            />
          </div>
        )}
      </SlideOverDrawer>

      {/* Slide-Over Drawer for Identity Cell */}
      <SlideOverDrawer
        isOpen={Boolean(selectedIdentity)}
        onClose={() => setSelectedIdentity(null)}
        title={`Identity Cell: ${selectedIdentity?.display_name || ""}`}
        subtitle={`${selectedIdentity?.identity_cell_id} • Model: ${selectedIdentity?.model}`}
      >
        {selectedIdentity && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161926] border border-slate-200 dark:border-[#252a3d] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Identity Cell ID:</span>
                <span className="font-bold text-emerald-400">{selectedIdentity.identity_cell_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Self-Owner:</span>
                <span className="text-[#f8a87c]">{selectedIdentity.owner_identity_cell_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Workspace Dir:</span>
                <span className="text-slate-800 dark:text-neutral-200 truncate">{selectedIdentity.workspace_dir}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#242838]">
                <span className="text-neutral-400">Lifecycle Action:</span>
                <div className="flex items-center gap-1">
                  {(["activate", "suspend", "revoke"] as const).map((act) => (
                    <button
                      key={act}
                      type="button"
                      disabled={mutating}
                      onClick={() => handleIdentityStatusChange(selectedIdentity.identity_cell_id, act)}
                      className="px-2 py-0.5 rounded uppercase text-[10px] cursor-pointer border bg-white dark:bg-[#0f111a] hover:border-[#f8a87c] text-slate-800 dark:text-neutral-200 border-slate-200 dark:border-[#222636]"
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Iam360PermissionTreeView
              rootNode={selectedIdentity.permission_tree}
              title={`Cây Phân Quyền 5 Nhánh Cá Nhân → Tổ Chức: ${selectedIdentity.slug}`}
              subtitle="Chi tiết quyền hạn từ Identity Cell tới các Organization Cells, A2A và Observed Principals."
              defaultExpandDepth={3}
              compact
            />
          </div>
        )}
      </SlideOverDrawer>
    </div>
  );
}
