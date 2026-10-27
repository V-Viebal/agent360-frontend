import React, { useState, useEffect } from "react";
import {
  Building2,
  Bot,
  RefreshCw,
  CheckCircle2,
  Play,
  SlidersHorizontal,
  GitBranch,
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
        <div className="h-16 w-full rounded-xl skeleton-shimmer border border-slate-200 dark:border-[#222533]" />
        <div className="h-64 w-full rounded-xl skeleton-shimmer border border-slate-200 dark:border-[#222533]" />
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
        `Đã ${nextEnabled ? "bật" : "tắt"} quyền ${node.capability_kind.toUpperCase()}:${node.capability_key} và ký xác thực.`
      );
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setReconciling(false);
    }
  };

  const handleReconcileDrift = async () => {
    setReconciling(true);
    try {
      await reconcileIam360IdentityDrift(identity.slug);
      await loadInspection(true);
      setFeedback(`Đã khôi phục cấu hình chuẩn cho ${identity.slug}.`);
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setReconciling(false);
    }
  };

  const handleDecideApproval = async (approvalId: string, approve: boolean) => {
    setUpdatingRole(true);
    try {
      await decideIam360Approval(approvalId, approve, approve ? "Approved by Human Controller" : "Denied by Human Controller");
      await loadInspection(true);
      setFeedback(`Đã ${approve ? "phê duyệt" : "từ chối"} yêu cầu ${approvalId}.`);
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleStatusChange = async (action: "activate" | "suspend" | "revoke") => {
    setUpdatingStatus(true);
    try {
      await mutateIam360IdentityStatus(identity.identity_cell_id, action, `Operator changed status to ${action}`);
      await loadInspection(true);
      setFeedback(`Đã chuyển trạng thái ${identity.identity_cell_id} sang "${action.toUpperCase()}".`);
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEnforcementChange = async (orgCellId: string, mode: "off" | "preview" | "on") => {
    setUpdatingRole(true);
    try {
      await mutateIam360OrgEnforcement(orgCellId, mode, `Updated enforcement to ${mode}`);
      await loadInspection(true);
      setFeedback(`Đã chuyển chế độ kiểm soát của ${orgCellId} sang "${mode.toUpperCase()}".`);
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

  return (
    <div className="space-y-3">
      {/* Minimalist Top Bar: Compact Summary & Sub-Navigation in one clean area */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141620] border border-slate-200 dark:border-[#222534] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600 dark:text-neutral-300 font-mono">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <span
                className={`h-2 w-2 rounded-full ${
                  identity.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span>{identity.identity_cell_id}</span>
            </span>
            <span className="text-slate-300 dark:text-neutral-600">•</span>
            <span>
              Tổ chức: <strong className="text-slate-800 dark:text-neutral-200">{primaryOrg.cell_id}</strong> ({identity.cell_role.toUpperCase()})
            </span>
            <span className="text-slate-300 dark:text-neutral-600">•</span>
            <span>
              {identity.enabled_mcp_count}/{identity.mcp_count} MCP • {identity.enabled_tool_count}/{identity.tool_count} Tools
            </span>
            <span className="text-slate-300 dark:text-neutral-600">•</span>
            <span>
              {(identity.a2a_delegation_targets || []).filter((t) => t.allowed).length} A2A
            </span>
            {identity.drift && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Lệch chuẩn
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => loadInspection(true)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1a1d2b] hover:bg-slate-100 dark:hover:bg-[#222638] border border-slate-200 dark:border-[#282c3e] text-xs text-slate-700 dark:text-neutral-200 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
            title="Làm mới dữ liệu IAM360"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Đồng bộ</span>
          </button>
        </div>

        {/* Clean Segmented Sub-Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-2 border-t border-slate-200/80 dark:border-[#222534]">
          {[
            { id: "tree" as const, label: "Cây phân quyền", icon: <GitBranch size={13} /> },
            { id: "identity" as const, label: "Danh tính", icon: <Bot size={13} /> },
            { id: "org" as const, label: `Tổ chức (${identity.memberships.length})`, icon: <Building2 size={13} /> },
            { id: "a2a_principals" as const, label: "Ủy quyền & Kênh", icon: <Network size={13} /> },
            { id: "simulator" as const, label: "Kiểm thử", icon: <SlidersHorizontal size={13} /> },
          ].map((tab) => {
            const active = subView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubView(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                  active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 !text-white dark:!text-slate-900 shadow-xs"
                    : "text-slate-600 dark:text-neutral-400 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pending Step-Up / Two-Person Approval Banner */}
      {pendingApprovals.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/25 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <ShieldAlert size={14} />
              <span>Cần phê duyệt ({pendingApprovals.length})</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">Controller: {identity.controller_subject_id}</span>
          </div>
          {pendingApprovals.map((app) => (
            <div
              key={app.approval_id}
              className="p-2.5 rounded-lg bg-white dark:bg-[#12141e] border border-slate-200 dark:border-[#252a3d] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="font-medium text-slate-900 dark:text-white">
                  [{app.kind.toUpperCase()}] {app.action} — <span className="font-mono text-slate-500">{app.approval_id}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-neutral-400">{app.reason}</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={updatingRole}
                  onClick={() => handleDecideApproval(app.approval_id, true)}
                  className="px-2.5 py-1 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium cursor-pointer"
                >
                  Duyệt
                </button>
                <button
                  type="button"
                  disabled={updatingRole}
                  onClick={() => handleDecideApproval(app.approval_id, false)}
                  className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-neutral-700 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {feedback && (
        <div className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#181b28] border border-slate-200 dark:border-[#282d42] text-xs text-slate-800 dark:text-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="text-[11px] text-slate-500 hover:underline cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      {/* VIEW 1: 5-BRANCH INTERACTIVE PERMISSION TREE */}
      {subView === "tree" && (
        <Iam360PermissionTreeView
          rootNode={inspection.permission_tree}
          title={`Cây phân quyền của ${identity.display_name}`}
          defaultExpandDepth={3}
          onToggleCapabilityNode={handleToggleTreeCapability}
          onReconcileDrift={handleReconcileDrift}
          reconciling={reconciling}
        />
      )}

      {/* VIEW 2: PERSONAL IDENTITY CELL */}
      {subView === "identity" && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-[#222533] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#222636] pb-3">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">
                Danh tính tự chủ (Self-Owned Identity Cell)
              </div>
              <h5 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {identity.canonical_name} <span className="font-mono text-xs text-slate-400">({identity.identity_cell_id})</span>
              </h5>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                disabled={updatingStatus || identity.status === "active"}
                onClick={() => handleStatusChange("activate")}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-40 cursor-pointer transition-opacity"
              >
                Kích hoạt
              </button>
              <button
                type="button"
                disabled={updatingStatus || identity.status === "suspended"}
                onClick={() => handleStatusChange("suspend")}
                className="px-2.5 py-1 rounded-lg text-xs border border-slate-200 dark:border-[#2a2f45] text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 cursor-pointer transition-colors"
              >
                Tạm dừng
              </button>
              <button
                type="button"
                disabled={updatingStatus || identity.status === "revoked"}
                onClick={() => handleStatusChange("revoke")}
                className="px-2.5 py-1 rounded-lg text-xs border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 disabled:opacity-40 cursor-pointer transition-colors"
              >
                Thu hồi
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#161924] border border-slate-200/80 dark:border-[#222636]">
              <div className="text-[10px] text-slate-400">Owner Identity Cell</div>
              <div className="text-slate-900 dark:text-white font-medium truncate mt-0.5">
                {identity.owner_identity_cell_id}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#161924] border border-slate-200/80 dark:border-[#222636]">
              <div className="text-[10px] text-slate-400">Human Controller</div>
              <div className="text-slate-900 dark:text-white font-medium truncate mt-0.5">
                {identity.controller_subject_id}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#161924] border border-slate-200/80 dark:border-[#222636]">
              <div className="text-[10px] text-slate-400">Machine Identity Ref</div>
              <div className="text-slate-900 dark:text-white font-medium truncate mt-0.5" title={identity.machine_identity_ref}>
                {identity.machine_identity_ref}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ORGANIZATION CELL BOUNDARY */}
      {subView === "org" && (
        <div className="space-y-3">
          {memberOrgs.length > 1 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {memberOrgs.map((org) => (
                <button
                  key={org.cell_id}
                  type="button"
                  onClick={() => setSelectedOrgCellId(org.cell_id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border cursor-pointer transition-colors ${
                    activeOrg.cell_id === org.cell_id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white font-medium"
                      : "bg-white dark:bg-[#141722] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-[#222636]"
                  }`}
                >
                  {org.cell_id}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 rounded-xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-[#222533] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-[#222636] pb-3">
              <div>
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {activeOrg.display_name} <span className="font-mono text-xs text-slate-400">({activeOrg.cell_id})</span>
                </h5>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Chủ sở hữu: <strong className="text-slate-800 dark:text-neutral-200">{activeOrg.owner_identity_cell_id}</strong> ({activeOrg.owner_name})
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="text-slate-400 mr-1">Chế độ:</span>
                {(["off", "preview", "on"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    disabled={updatingRole}
                    onClick={() => handleEnforcementChange(activeOrg.cell_id, mode)}
                    className={`px-2 py-0.5 rounded uppercase cursor-pointer border ${
                      activeOrg.runtime_enforcement === mode
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white font-semibold"
                        : "bg-transparent text-slate-500 border-slate-200 dark:border-[#252a3d]"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <Iam360PermissionTreeView
              rootNode={activeOrg.permission_tree}
              title={`Cây quyền tổ chức ${activeOrg.cell_id}`}
              defaultExpandDepth={2}
              compact
            />
          </div>
        </div>
      )}

      {/* VIEW 4: REBAC A2A TOPOLOGY & OBSERVED PRINCIPALS */}
      {subView === "a2a_principals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-[#222533] space-y-2.5">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Network size={13} className="text-slate-400" />
                <span>Ủy quyền A2A ({(identity.a2a_delegation_targets || []).length})</span>
              </h5>
              <span className="text-[10px] font-mono text-slate-400">Vai trò: {identity.cell_role.toUpperCase()}</span>
            </div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 font-mono text-xs">
              {(identity.a2a_delegation_targets || []).map((t) => (
                <div
                  key={`${t.organization_cell_id}:${t.target_slug}`}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#161924] border border-slate-200/80 dark:border-[#222636] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 dark:text-white truncate">
                      {t.target_name} ({t.target_slug})
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {t.organization_cell_id} • {t.caller_role.toUpperCase()} → {t.target_role.toUpperCase()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 border ${
                      t.allowed
                        ? "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-200 border-slate-200 dark:border-white/10"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {t.allowed ? "Cho phép" : "Chặn"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-[#222533] space-y-2.5">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users size={13} className="text-slate-400" />
                <span>Người dùng & Chủ đề ({(identity.observed_principals || []).length})</span>
              </h5>
              <span className="text-[10px] font-mono text-slate-400">Session Bound</span>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {(identity.observed_principals || []).map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#161924] border border-slate-200/80 dark:border-[#222636] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-white">{p.display_name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200/70 dark:bg-white/5 text-slate-600 dark:text-neutral-300 uppercase">
                      {p.channel}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-neutral-300">{p.topic_title}</div>
                  <div className="text-[10px] text-slate-400">
                    {p.user_id} • {p.session_id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: POLICY SIMULATOR */}
      {subView === "simulator" && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-[#222533] space-y-3">
          <h5 className="text-xs font-semibold text-slate-900 dark:text-white">
            Kiểm thử quyết định phân quyền ({identity.identity_cell_id})
          </h5>

          <form onSubmit={handleRunSimulation} className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <label className="space-y-1">
              <span className="text-[10px] text-slate-400">Tổ chức đích (Organization Cell)</span>
              <select
                value={simOrgId}
                onChange={(e) => setSimOrgId(e.target.value)}
                className="w-full rounded-lg bg-slate-50 dark:bg-[#161924] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white"
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
              <span className="text-[10px] text-slate-400">Hành động / Quyền kiểm tra</span>
              <select
                value={simAction}
                onChange={(e) => setSimAction(e.target.value)}
                className="w-full rounded-lg bg-slate-50 dark:bg-[#161924] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="read_file">read_file (Đọc file Workspace)</option>
                <option value="write_file">write_file (Ghi file Workspace)</option>
                <option value="submit_to_agent">submit_to_agent (Ủy quyền A2A)</option>
                <option value="erpnext.quotation.create">erpnext.quotation.create (Step-Up Gate)</option>
                <option value="erpnext.invoice.write">erpnext.invoice.write (Step-Up Gate)</option>
                <option value="mcp:erpnext">mcp:erpnext (ERPNext MCP)</option>
                <option value="mcp:kb">mcp:kb (Outline KB MCP)</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[10px] text-slate-400">Đường dẫn tài nguyên</span>
              <input
                type="text"
                value={simPath}
                onChange={(e) => setSimPath(e.target.value)}
                className="w-full rounded-lg bg-slate-50 dark:bg-[#161924] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[10px] text-slate-400">Agent nhận ủy quyền (Tuỳ chọn)</span>
              <input
                type="text"
                value={simTargetAgent}
                onChange={(e) => setSimTargetAgent(e.target.value)}
                placeholder="vd: gm-lua, gm-boc, ken..."
                className="w-full rounded-lg bg-slate-50 dark:bg-[#161924] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </label>

            <div className="sm:col-span-2 flex items-center justify-end pt-1">
              <button
                type="submit"
                disabled={simRunning}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play size={12} />
                <span>{simRunning ? "Đang kiểm tra..." : "Chạy kiểm thử"}</span>
              </button>
            </div>
          </form>

          {simResult && (
            <div
              className={`p-3 rounded-lg border font-mono text-xs space-y-2 ${
                simResult.allowed
                  ? "bg-slate-50 dark:bg-[#161924] border-slate-200 dark:border-[#252a3d] text-slate-800 dark:text-neutral-200"
                  : "bg-rose-500/5 border-rose-500/25 text-rose-600 dark:text-rose-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  {simResult.allowed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertTriangle size={14} />}
                  <span>
                    {simResult.effect} — {simResult.reason_code}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-white/5 text-[10px]">
                  Vai trò: {simResult.role_in_cell.toUpperCase()}
                </span>
              </div>
              <div className="pt-1 border-t border-slate-200 dark:border-[#252a3d] space-y-1 text-slate-500 dark:text-neutral-400">
                {simResult.trace_path.map((step, idx) => (
                  <div key={idx} className="text-[11px] flex items-center gap-1.5">
                    <span>{idx + 1}.</span>
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
