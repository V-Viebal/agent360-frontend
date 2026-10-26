import React, { useState, useEffect } from "react";
import {
  Building2,
  Bot,
  Layers,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Play,
  SlidersHorizontal,
  GitBranch,
  Terminal,
  Network,
  Users,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import {
  fetchAgentIam360Cell,
  mutateIam360IdentityStatus,
  mutateIam360OrgMemberRole,
  mutateIam360OrgEnforcement,
  toggleIam360Capability,
  reconcileIam360IdentityDrift,
  decideIam360Approval,
  evaluateIam360Access,
  Iam360AgentCellInspection,
  Iam360EvaluateAccessResponse,
  Iam360PermissionTreeNode,
} from "../services/iam360CellsApi";
import { Iam360PermissionTreeView } from "./Iam360PermissionTreeView";

interface AgentIam360CellTabProps {
  agentId: string;
  agentSlug: string;
  agentName: string;
}

export function AgentIam360CellTab({ agentId, agentSlug, agentName }: AgentIam360CellTabProps) {
  const [inspection, setInspection] = useState<Iam360AgentCellInspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [subView, setSubView] = useState<"tree" | "identity" | "org" | "a2a_principals" | "simulator">("tree");
  const [selectedOrgCellId, setSelectedOrgCellId] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Access Simulator state
  const [simAction, setSimAction] = useState("read_file");
  const [simOrgId, setSimOrgId] = useState("");
  const [simPath, setSimPath] = useState("/app/working/workspaces/default/README.md");
  const [simTargetAgent, setSimTargetAgent] = useState("");
  const [simResult, setSimResult] = useState<Iam360EvaluateAccessResponse | null>(null);
  const [simRunning, setSimRunning] = useState(false);

  const loadInspection = async (force = false) => {
    setLoading(true);
    try {
      const data = await fetchAgentIam360Cell(agentSlug || agentId, force);
      setInspection(data);
      if (!selectedOrgCellId && data.primary_organization_cell) {
        setSelectedOrgCellId(data.primary_organization_cell.cell_id);
      }
      if (!simOrgId && data.primary_organization_cell) {
        setSimOrgId(data.primary_organization_cell.cell_id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInspection(false);
  }, [agentId, agentSlug]);

  if (loading || !inspection) {
    return (
      <div className="space-y-3 py-2">
        <div className="h-24 w-full rounded-2xl skeleton-shimmer border border-slate-200 dark:border-[#222533]" />
        <div className="h-64 w-full rounded-2xl skeleton-shimmer border border-slate-200 dark:border-[#222533]" />
      </div>
    );
  }

  const { identity_cell: identity, member_organization_cells: memberOrgs, primary_organization_cell: primaryOrg } = inspection;
  const activeOrg = memberOrgs.find((o) => o.cell_id === selectedOrgCellId) || primaryOrg;
  const pendingApprovals = (inspection.pending_approvals || []).filter((a) => a.status === "pending");

  const handleToggleTreeCapability = async (node: Iam360PermissionTreeNode, nextEnabled: boolean) => {
    if (!node.capability_kind || !node.capability_key) return;
    setReconciling(true);
    try {
      await toggleIam360Capability(identity.slug, node.capability_kind, node.capability_key, nextEnabled);
      await loadInspection(true);
      setFeedback(
        `Đã ${nextEnabled ? "BẬT" : "TẮT"} quyền ${node.capability_kind.toUpperCase()}:${node.capability_key} trên cây và ký Signed Intent!`
      );
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setReconciling(false);
    }
  };

  const handleReconcileDrift = async () => {
    setReconciling(true);
    try {
      await reconcileIam360IdentityDrift(identity.slug);
      await loadInspection(true);
      setFeedback(`Đã đồng bộ hoá (Reconcile) cấu hình Node cho ${identity.slug} và xoá toàn bộ trạng thái Drift!`);
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setReconciling(false);
    }
  };

  const handleDecideApproval = async (approvalId: string, approve: boolean) => {
    setUpdatingRole(true);
    try {
      await decideIam360Approval(approvalId, approve, approve ? "Approved by Human Controller" : "Denied by Human Controller");
      await loadInspection(true);
      setFeedback(`Đã ${approve ? "PHÊ DUYỆT (Approve)" : "TỪ CHỐI (Deny)"} yêu cầu Step-Up/Two-Person ${approvalId}!`);
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleStatusChange = async (action: "activate" | "suspend" | "revoke") => {
    setUpdatingStatus(true);
    try {
      await mutateIam360IdentityStatus(identity.identity_cell_id, action, `Operator changed status to ${action}`);
      await loadInspection(true);
      setFeedback(`Đã cập nhật trạng thái Identity Cell ${identity.identity_cell_id} sang "${action.toUpperCase()}"!`);
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRoleChange = async (orgCellId: string, newRole: "owner" | "manager" | "employee") => {
    setUpdatingRole(true);
    try {
      await mutateIam360OrgMemberRole(orgCellId, identity.identity_cell_id, newRole, `Updated role to ${newRole}`);
      await loadInspection(true);
      setFeedback(`Đã cập nhật vai trò của ${agentName} trong ${orgCellId} thành "${newRole.toUpperCase()}"!`);
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleEnforcementChange = async (orgCellId: string, mode: "off" | "preview" | "on") => {
    setUpdatingRole(true);
    try {
      await mutateIam360OrgEnforcement(orgCellId, mode, `Updated enforcement to ${mode}`);
      await loadInspection(true);
      setFeedback(`Đã chuyển chế độ Runtime Enforcement của ${orgCellId} sang "${mode.toUpperCase()}"!`);
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimRunning(true);
    try {
      const res = await evaluateIam360Access({
        identity_cell_id: identity.slug,
        organization_cell_id: simOrgId || primaryOrg.cell_id,
        action: simAction,
        resource_path: simPath,
        target_agent_slug: simTargetAgent || undefined,
      });
      setSimResult(res);
      if (res.step_up_approval) {
        await loadInspection(true);
      }
    } finally {
      setSimRunning(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const r = (role || "employee").toLowerCase();
    if (r === "owner") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/35">
          👑 CELL OWNER
        </span>
      );
    }
    if (r === "manager") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-600 dark:text-[#c4b5fd] border border-purple-500/35">
          ◆ MANAGER
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-sky-500/15 text-sky-600 dark:text-[#93c5fd] border border-sky-500/35">
        ● EMPLOYEE
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Summary Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151824] border border-slate-200 dark:border-[#24283b] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30 font-semibold">
                IAM360 Two-Cell Governance • 5-Branch Tree
              </span>
              {inspection.reconciliation && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 dark:text-[#86efac] border border-emerald-500/30">
                  Worker Sync: {inspection.reconciliation.passed_agents}/{inspection.reconciliation.total_agents_checked} PASS (15m Cron)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
              Tổng quan từ danh tính tự chủ 1:1 của {agentName} tới ranh giới Tenant, ReBAC Role Tuples, Inline Capability Toggle, A2A Topology và Observed Principals.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadInspection(true)}
            className="self-start sm:self-center px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1c2030] hover:bg-slate-100 dark:hover:bg-[#252a3d] border border-slate-200 dark:border-[#2c3248] text-xs font-mono text-slate-700 dark:text-neutral-200 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <RefreshCw size={12} className={loading ? "animate-spin text-[#f8a87c]" : "text-[#f8a87c]"} />
            <span>Đồng bộ IAM360</span>
          </button>
        </div>

        {/* 4 Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#10121b] border border-slate-200/80 dark:border-[#222638]">
            <div className="text-[10px] text-neutral-500">1. PERSONAL IDENTITY CELL</div>
            <div className="text-slate-900 dark:text-white font-semibold truncate mt-0.5" title={identity.identity_cell_id}>
              {identity.identity_cell_id}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9px] uppercase font-bold ${
                  identity.status === "active"
                    ? "bg-emerald-500/15 text-emerald-500 dark:text-[#86efac]"
                    : "bg-rose-500/15 text-rose-500 dark:text-[#fda4af]"
                }`}
              >
                {identity.status}
              </span>
              {identity.drift && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] uppercase font-bold bg-[#f8a87c]/20 text-[#f8a87c]">
                  DRIFT
                </span>
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-[#10121b] border border-slate-200/80 dark:border-[#222638]">
            <div className="text-[10px] text-neutral-500">2. PRIMARY ORG CELL</div>
            <div className="text-[#e0682b] dark:text-[#f8a87c] font-semibold truncate mt-0.5">
              {primaryOrg.cell_id} ({primaryOrg.organization.toUpperCase()})
            </div>
            <div className="mt-1 flex items-center gap-1.5">{getRoleBadge(identity.cell_role)}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-[#10121b] border border-slate-200/80 dark:border-[#222638]">
            <div className="text-[10px] text-neutral-500">3. REBAC A2A & PRINCIPALS</div>
            <div className="text-slate-900 dark:text-white font-semibold mt-0.5">
              {(identity.a2a_delegation_targets || []).filter((t) => t.allowed).length} A2A • {(identity.observed_principals || []).length} Principals
            </div>
            <div className="text-[10px] text-emerald-500 dark:text-[#86efac] truncate mt-1">
              {identity.memberships.length} Org Cells Bound
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-[#10121b] border border-slate-200/80 dark:border-[#222638]">
            <div className="text-[10px] text-neutral-500">4. ATTESTED CAPABILITIES</div>
            <div className="text-purple-600 dark:text-[#c4b5fd] font-semibold mt-0.5">
              {identity.enabled_mcp_count}/{identity.mcp_count} MCP • {identity.enabled_tool_count}/{identity.tool_count} Tools
            </div>
            <div className="text-[10px] text-sky-500 dark:text-[#93c5fd] truncate mt-1">
              Channels: {identity.enabled_channels.join(", ")}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Step-Up / Two-Person Approval Banner (Upgrade #2 & #5) */}
      {pendingApprovals.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#f8a87c]/15 border border-[#f8a87c]/40 space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#e0682b] dark:text-[#f8a87c] flex items-center gap-1.5">
              <ShieldAlert size={15} />
              <span>STEP-UP / TWO-PERSON APPROVAL REQUIRED ({pendingApprovals.length} Pending)</span>
            </span>
            <span className="text-[10px] text-neutral-400">Controller: {identity.controller_subject_id}</span>
          </div>
          {pendingApprovals.map((app) => (
            <div
              key={app.approval_id}
              className="p-2.5 rounded-xl bg-white dark:bg-[#12141e] border border-slate-200 dark:border-[#252a3d] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  [{app.kind.toUpperCase()}] {app.action} — <span className="text-[#f8a87c]">{app.approval_id}</span>
                </div>
                <div className="text-[11px] text-neutral-400">{app.reason}</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={updatingRole}
                  onClick={() => handleDecideApproval(app.approval_id, true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 dark:text-[#86efac] border border-emerald-500/40 font-semibold cursor-pointer"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={updatingRole}
                  onClick={() => handleDecideApproval(app.approval_id, false)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 dark:text-[#fda4af] border border-rose-500/40 font-semibold cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-600 dark:text-[#86efac] flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>{feedback}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="text-[11px] underline cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      {/* Sub-navigation Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-[#222533] pb-2">
        {[
          { id: "tree" as const, label: "Cây Phân Quyền 5 Nhánh (Inline Toggle)", icon: <GitBranch size={13} /> },
          { id: "identity" as const, label: "Lớp Cá Nhân (Identity Cell)", icon: <Bot size={13} /> },
          { id: "org" as const, label: `Lớp Tổ Chức (${identity.memberships.length} Org Cells)`, icon: <Building2 size={13} /> },
          { id: "a2a_principals" as const, label: "A2A Topology & Observed Principals", icon: <Network size={13} /> },
          { id: "simulator" as const, label: "Kiểm thử Quyền & Step-Up Gate", icon: <SlidersHorizontal size={13} /> },
        ].map((tab) => {
          const active = subView === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubView(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 shrink-0 cursor-pointer border transition-all ${
                active
                  ? "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border-[#f8a87c]/40 font-semibold"
                  : "bg-slate-50 dark:bg-[#141722] text-slate-600 dark:text-neutral-400 border-slate-200/80 dark:border-[#222636] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: 5-BRANCH INTERACTIVE PERMISSION TREE */}
      {subView === "tree" && (
        <div className="space-y-3">
          <Iam360PermissionTreeView
            rootNode={inspection.permission_tree}
            title={`Cây Phân Quyền 5 Nhánh: ${identity.display_name} (${identity.identity_cell_id})`}
            subtitle="Bấm Toggle ON/OFF trực tiếp trên các nút lá MCP/Tools để cấp/thu hồi quyền thực thi và phát hành Signed Intent; hoặc bấm Reconcile Node để khôi phục cấu hình chuẩn."
            defaultExpandDepth={3}
            onToggleCapabilityNode={handleToggleTreeCapability}
            onReconcileDrift={handleReconcileDrift}
            reconciling={reconciling}
          />
        </div>
      )}

      {/* VIEW 2: PERSONAL IDENTITY CELL */}
      {subView === "identity" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141722] border border-slate-200 dark:border-[#232738] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#222636] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase text-[#f8a87c]">
                  LEVEL 1 • SELF-OWNED AGENT IDENTITY CELL
                </div>
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  {identity.canonical_name} <span className="font-mono text-xs text-neutral-400">({identity.identity_cell_id})</span>
                </h5>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  disabled={updatingStatus || identity.status === "active"}
                  onClick={() => handleStatusChange("activate")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-emerald-500/15 hover:bg-emerald-500/25 disabled:opacity-40 text-emerald-600 dark:text-[#86efac] border border-emerald-500/30 cursor-pointer transition-colors"
                >
                  Activate
                </button>
                <button
                  type="button"
                  disabled={updatingStatus || identity.status === "suspended"}
                  onClick={() => handleStatusChange("suspend")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-amber-500/15 hover:bg-amber-500/25 disabled:opacity-40 text-amber-600 dark:text-[#f8a87c] border border-amber-500/30 cursor-pointer transition-colors"
                >
                  Suspend
                </button>
                <button
                  type="button"
                  disabled={updatingStatus || identity.status === "revoked"}
                  onClick={() => handleStatusChange("revoke")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-rose-500/15 hover:bg-rose-500/25 disabled:opacity-40 text-rose-600 dark:text-[#fda4af] border border-rose-500/30 cursor-pointer transition-colors"
                >
                  Revoke Cell
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200/80 dark:border-[#222636]">
                <div className="text-[10px] text-neutral-500">Owner Identity Cell (Self-Owned)</div>
                <div className="text-[#e0682b] dark:text-[#f8a87c] font-semibold truncate mt-0.5">
                  {identity.owner_identity_cell_id}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200/80 dark:border-[#222636]">
                <div className="text-[10px] text-neutral-500">Human Controller Subject</div>
                <div className="text-slate-900 dark:text-white font-semibold truncate mt-0.5">
                  {identity.controller_subject_id}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200/80 dark:border-[#222636]">
                <div className="text-[10px] text-neutral-500">Infisical Machine Identity Ref</div>
                <div className="text-emerald-600 dark:text-[#86efac] font-semibold truncate mt-0.5" title={identity.machine_identity_ref}>
                  {identity.machine_identity_ref}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ORGANIZATION CELL BOUNDARY */}
      {subView === "org" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-neutral-400">Chọn Organization Cell:</span>
            {memberOrgs.map((org) => (
              <button
                key={org.cell_id}
                type="button"
                onClick={() => setSelectedOrgCellId(org.cell_id)}
                className={`px-3 py-1 rounded-xl text-xs font-mono border cursor-pointer transition-all ${
                  activeOrg.cell_id === org.cell_id
                    ? "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border-[#f8a87c]/40 font-semibold"
                    : "bg-slate-50 dark:bg-[#141722] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-[#222636]"
                }`}
              >
                {org.cell_id} ({org.organization.toUpperCase()})
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141722] border border-slate-200 dark:border-[#232738] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#222636] pb-3">
              <div>
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {activeOrg.display_name} <span className="font-mono text-xs text-neutral-400">({activeOrg.cell_id})</span>
                </h5>
                <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                  Owner: <strong className="text-[#f8a87c]">{activeOrg.owner_identity_cell_id}</strong> ({activeOrg.owner_name})
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-neutral-400">Enforcement:</span>
                  {(["off", "preview", "on"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      disabled={updatingRole}
                      onClick={() => handleEnforcementChange(activeOrg.cell_id, mode)}
                      className={`px-2 py-0.5 rounded-lg uppercase cursor-pointer border ${
                        activeOrg.runtime_enforcement === mode
                          ? "bg-[#f8a87c]/20 text-[#e0682b] dark:text-[#f8a87c] border-[#f8a87c]/40 font-bold"
                          : "bg-white dark:bg-[#0f111a] text-neutral-400 border-slate-200 dark:border-[#222636]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Iam360PermissionTreeView
              rootNode={activeOrg.permission_tree}
              title={`Cây Phân Quyền Cấp Tổ Chức: ${activeOrg.display_name} (${activeOrg.cell_id})`}
              subtitle="Hiển thị toàn bộ Owner, Managers, Employees và Admin Baseline Guardrails trong Organization Cell này."
              defaultExpandDepth={2}
              compact
            />
          </div>
        </div>
      )}

      {/* VIEW 4: REBAC A2A TOPOLOGY & OBSERVED PRINCIPALS (Upgrades #3 & #4) */}
      {subView === "a2a_principals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141722] border border-slate-200 dark:border-[#232738] space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-mono uppercase font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Network size={14} className="text-emerald-400" />
                <span>ReBAC A2A Delegation Matrix ({(identity.a2a_delegation_targets || []).length})</span>
              </h5>
              <span className="text-[10px] font-mono text-emerald-400">Role: {identity.cell_role.toUpperCase()}</span>
            </div>
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 font-mono text-xs">
              {(identity.a2a_delegation_targets || []).map((t) => (
                <div
                  key={`${t.organization_cell_id}:${t.target_slug}`}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-[#222636] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {t.target_name} ({t.target_slug})
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {t.organization_cell_id} • {t.caller_role.toUpperCase()} → {t.target_role.toUpperCase()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      t.allowed
                        ? "bg-emerald-500/15 text-emerald-500 dark:text-[#86efac]"
                        : "bg-rose-500/15 text-rose-500 dark:text-[#fda4af]"
                    }`}
                  >
                    {t.allowed ? "ALLOW A2A" : "DENY A2A"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141722] border border-slate-200 dark:border-[#232738] space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-mono uppercase font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users size={14} className="text-sky-400" />
                <span>Observed Channel Principals & Topics ({(identity.observed_principals || []).length})</span>
              </h5>
              <span className="text-[10px] font-mono text-sky-400">Session Bound</span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {(identity.observed_principals || []).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-[#222636] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">{p.display_name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/15 text-sky-400 border border-sky-500/30 uppercase">
                      {p.channel}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#f8a87c]">{p.topic_title}</div>
                  <div className="text-[10px] text-neutral-400">
                    Principal: {p.user_id} • Session: {p.session_id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: POLICY SIMULATOR + STEP-UP TRIGGER */}
      {subView === "simulator" && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141722] border border-slate-200 dark:border-[#232738] space-y-4">
          <div>
            <div className="text-[10px] font-mono uppercase text-purple-400">
              REALTIME REBAC + CERBOS ABAC + STEP-UP APPROVAL SIMULATOR
            </div>
            <h5 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
              Kiểm thử Quyết định Phân quyền & Step-Up Gate của {identity.identity_cell_id}
            </h5>
          </div>

          <form onSubmit={handleRunSimulation} className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <label className="space-y-1">
              <span className="text-[10px] text-neutral-400">Target Organization Cell</span>
              <select
                value={simOrgId}
                onChange={(e) => setSimOrgId(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="cell:core">cell:core (Antares Core)</option>
                <option value="cell:gm">cell:gm (Gia Mộc Operations)</option>
                <option value="cell:climax">cell:climax (Climax Creative)</option>
                <option value="cell:planthy">cell:planthy (Planthy AI)</option>
                <option value="cell:agentteams">cell:agentteams (AgentTeams Swarm)</option>
                <option value="cell:its">cell:its (ITS Gatekeeper)</option>
                <option value="cell:gl">cell:gl (GL Automation)</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[10px] text-neutral-400">Tool / Capability / Step-Up Action</span>
              <select
                value={simAction}
                onChange={(e) => setSimAction(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="read_file">read_file (Workspace Read)</option>
                <option value="write_file">write_file (Workspace Write)</option>
                <option value="submit_to_agent">submit_to_agent (A2A Delegation)</option>
                <option value="erpnext.quotation.create">erpnext.quotation.create (High-Risk Step-Up Gate)</option>
                <option value="erpnext.invoice.write">erpnext.invoice.write (High-Risk Step-Up Gate)</option>
                <option value="mcp:erpnext">mcp:erpnext (ERPNext MCP)</option>
                <option value="mcp:kb">mcp:kb (Outline KB MCP)</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[10px] text-neutral-400">Resource / Workspace Path</span>
              <input
                type="text"
                value={simPath}
                onChange={(e) => setSimPath(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[10px] text-neutral-400">Target Agent Slug (Optional for A2A Check)</span>
              <input
                type="text"
                value={simTargetAgent}
                onChange={(e) => setSimTargetAgent(e.target.value)}
                placeholder="vd: gm-lua, gm-boc, ken..."
                className="w-full rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </label>

            <div className="sm:col-span-2 flex items-center justify-end pt-1">
              <button
                type="submit"
                disabled={simRunning}
                className="px-4 py-2 rounded-xl bg-[#f8a87c] hover:bg-[#f8a87c]/90 text-neutral-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Play size={13} />
                <span>{simRunning ? "Đang đánh giá..." : "Chạy Kiểm Thử Quyền"}</span>
              </button>
            </div>
          </form>

          {simResult && (
            <div
              className={`p-3.5 rounded-xl border font-mono text-xs space-y-2 ${
                simResult.allowed
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-[#86efac]"
                  : simResult.effect === "STEP_UP_APPROVAL_REQUIRED"
                    ? "bg-[#f8a87c]/15 border-[#f8a87c]/40 text-[#e0682b] dark:text-[#f8a87c]"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-[#fda4af]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  {simResult.allowed ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                  <span>
                    {simResult.effect} — {simResult.reason_code}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-black/20 text-[10px]">
                  Role in {simResult.organization_cell_id}: {simResult.role_in_cell.toUpperCase()}
                </span>
              </div>
              <div className="pt-1 border-t border-current/15 space-y-1">
                {simResult.trace_path.map((step, idx) => (
                  <div key={idx} className="text-[11px] flex items-center gap-1.5">
                    <span className="opacity-60">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
