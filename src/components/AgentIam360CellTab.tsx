import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  Bot,
  Layers,
  Lock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Play,
  SlidersHorizontal,
  GitBranch,
  KeyRound,
  Terminal,
  Radio,
  Sparkles,
} from "lucide-react";
import {
  fetchAgentIam360Cell,
  mutateIam360IdentityStatus,
  mutateIam360OrgMemberRole,
  mutateIam360OrgEnforcement,
  evaluateIam360Access,
  Iam360AgentCellInspection,
  Iam360EvaluateAccessResponse,
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
  const [subView, setSubView] = useState<"tree" | "identity" | "org" | "simulator">("tree");
  const [selectedOrgCellId, setSelectedOrgCellId] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Access Simulator state
  const [simAction, setSimAction] = useState("read_file");
  const [simOrgId, setSimOrgId] = useState("");
  const [simPath, setSimPath] = useState("/app/working/workspaces/default/README.md");
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
        identity_cell_id: identity.identity_cell_id,
        organization_cell_id: simOrgId || primaryOrg.cell_id,
        action: simAction,
        resource_path: simPath,
      });
      setSimResult(res);
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
      {/* Top Summary Banner: Two-Cell Architecture Overview (Personal -> Organization) */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151824] border border-slate-200 dark:border-[#24283b] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30 font-semibold">
                IAM360 Two-Cell Governance
              </span>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Định danh Cá nhân (Identity Cell) & Tổ chức (Organization Cell)
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Tổng quan liền mạch từ danh tính tự chủ 1:1 của {agentName} tới ranh giới Tenant, ReBAC Role Tuples và Cerbos ABAC Policy.
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
              <span className="text-[10px] text-neutral-400">{identity.assurance}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-[#10121b] border border-slate-200/80 dark:border-[#222638]">
            <div className="text-[10px] text-neutral-500">2. PRIMARY ORG CELL</div>
            <div className="text-[#e0682b] dark:text-[#f8a87c] font-semibold truncate mt-0.5">
              {primaryOrg.cell_id} ({primaryOrg.organization.toUpperCase()})
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              {getRoleBadge(identity.cell_role)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-[#10121b] border border-slate-200/80 dark:border-[#222638]">
            <div className="text-[10px] text-neutral-500">3. CROSS-ORG MEMBERSHIPS</div>
            <div className="text-slate-900 dark:text-white font-semibold mt-0.5">
              {identity.memberships.length} Organization Cells
            </div>
            <div className="text-[10px] text-emerald-500 dark:text-[#86efac] truncate mt-1">
              {identity.memberships.map((m) => `${m.cell_id} (${m.role})`).join(" • ")}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-[#10121b] border border-slate-200/80 dark:border-[#222638]">
            <div className="text-[10px] text-neutral-500">4. ATTESTED CAPABILITIES</div>
            <div className="text-purple-600 dark:text-[#c4b5fd] font-semibold mt-0.5">
              {identity.enabled_mcp_count} MCP • {identity.enabled_tool_count} Tools
            </div>
            <div className="text-[10px] text-sky-500 dark:text-[#93c5fd] truncate mt-1">
              Channels: {identity.enabled_channels.join(", ")}
            </div>
          </div>
        </div>
      </div>

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

      {/* Sub-navigation Switcher: Tree | Identity Cell | Organization Cell | Simulator */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-[#222533] pb-2">
        {[
          { id: "tree" as const, label: "Cây Phân Quyền (Permission Tree)", icon: <GitBranch size={13} /> },
          { id: "identity" as const, label: "Lớp Cá Nhân (Identity Cell)", icon: <Bot size={13} /> },
          { id: "org" as const, label: `Lớp Tổ Chức (${identity.memberships.length} Org Cells)`, icon: <Building2 size={13} /> },
          { id: "simulator" as const, label: "Kiểm thử Quyền (Policy Simulator)", icon: <SlidersHorizontal size={13} /> },
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

      {/* VIEW 1: HIERARCHICAL PERMISSION TREE (PERSONAL -> ORGANIZATION) */}
      {subView === "tree" && (
        <div className="space-y-3">
          <Iam360PermissionTreeView
            rootNode={inspection.permission_tree}
            title={`Cây Phân Quyền Đa Tầng: ${identity.display_name} (${identity.identity_cell_id})`}
            subtitle="Mở rộng từng nhánh để xem chi tiết từ Identity Cell cá nhân → Tư cách trong các Organization Cells → ReBAC Tuples → Cerbos ABAC → MCP/Tools & Baseline Guardrails."
            defaultExpandDepth={3}
          />
        </div>
      )}

      {/* VIEW 2: PERSONAL IDENTITY CELL MANAGEMENT */}
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

              {/* Lifecycle Controls */}
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

            {/* Metadata Grid */}
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
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200/80 dark:border-[#222636]">
                <div className="text-[10px] text-neutral-500">Isolated Workspace Path</div>
                <div className="text-slate-800 dark:text-neutral-200 truncate mt-0.5" title={identity.workspace_dir}>
                  {identity.workspace_dir}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200/80 dark:border-[#222636]">
                <div className="text-[10px] text-neutral-500">Assurance & Attestation</div>
                <div className="text-sky-600 dark:text-[#93c5fd] font-semibold truncate mt-0.5">
                  {identity.assurance_level} • rev {identity.revision}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200/80 dark:border-[#222636]">
                <div className="text-[10px] text-neutral-500">Constitution Files</div>
                <div className="text-purple-600 dark:text-[#c4b5fd] truncate mt-0.5">
                  {identity.system_prompt_files.join(", ")}
                </div>
              </div>
            </div>

            {/* Attested MCP Clients & Builtin Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200/80 dark:border-[#222636] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <Layers size={13} className="text-emerald-400" />
                    <span>Attested MCP Clients ({identity.mcp_clients.length})</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500">Runtime Verified</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {identity.mcp_clients.map((m) => (
                    <span
                      key={m.id}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border ${
                        m.enabled
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-[#86efac] border-emerald-500/25"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/25"
                      }`}
                      title={`${m.name} (${m.transport})`}
                    >
                      {m.key} ({m.transport})
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200/80 dark:border-[#222636] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <Terminal size={13} className="text-purple-400" />
                    <span>Attested Builtin Tools ({identity.builtin_tools.length})</span>
                  </span>
                  <span className="text-[10px] font-mono text-purple-400">Scoped</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {identity.builtin_tools.map((t) => (
                    <span
                      key={t.id}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border ${
                        t.enabled
                          ? "bg-purple-500/10 text-purple-600 dark:text-[#c4b5fd] border-purple-500/25"
                          : "bg-slate-500/10 text-neutral-500 border-slate-500/25 line-through"
                      }`}
                      title={t.description}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ORGANIZATION CELL BOUNDARY & ROLE MANAGEMENT */}
      {subView === "org" && (
        <div className="space-y-4">
          {/* Selector for which Org Cell to inspect if agent belongs to multiple cells (e.g. Mons) */}
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
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-emerald-400">
                    LEVEL 2 • IMMUTABLE TENANT ORGANIZATION CELL
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-500 dark:text-[#86efac] border border-emerald-500/30">
                    {activeOrg.lifecycle}
                  </span>
                </div>
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  {activeOrg.display_name} <span className="font-mono text-xs text-neutral-400">({activeOrg.cell_id})</span>
                </h5>
                <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                  Owner Identity Cell: <strong className="text-[#f8a87c]">{activeOrg.owner_identity_cell_id}</strong> ({activeOrg.owner_name}) • Node {activeOrg.cluster_node} ({activeOrg.domain})
                </p>
              </div>

              {/* Enforcement & Role Controls */}
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

                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-neutral-400">Vai trò của {agentSlug}:</span>
                  {(["owner", "manager", "employee"] as const).map((r) => {
                    const currentRole =
                      activeOrg.owner_identity_cell_id === identity.identity_cell_id
                        ? "owner"
                        : activeOrg.members[identity.identity_cell_id]?.role || "employee";
                    return (
                      <button
                        key={r}
                        type="button"
                        disabled={updatingRole || (r === "owner" && activeOrg.owner_identity_cell_id === identity.identity_cell_id)}
                        onClick={() => handleRoleChange(activeOrg.cell_id, r)}
                        className={`px-2 py-0.5 rounded-lg uppercase cursor-pointer border ${
                          currentRole === r
                            ? "bg-purple-500/20 text-purple-600 dark:text-[#c4b5fd] border-purple-500/40 font-bold"
                            : "bg-white dark:bg-[#0f111a] text-neutral-400 border-slate-200 dark:border-[#222636]"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Organization Permission Tree */}
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

      {/* VIEW 4: INTERACTIVE ACCESS SIMULATOR */}
      {subView === "simulator" && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141722] border border-slate-200 dark:border-[#232738] space-y-4">
          <div>
            <div className="text-[10px] font-mono uppercase text-purple-400">
              REALTIME REBAC + CERBOS ABAC POLICY SIMULATOR
            </div>
            <h5 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
              Kiểm thử Quyết định Phân quyền của {identity.identity_cell_id}
            </h5>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Mô phỏng luồng đánh giá quyền từ Identity Cell → Tư cách thành viên Organization Cell → Cerbos Rule → Baseline Path Guardrail.
            </p>
          </div>

          <form onSubmit={handleRunSimulation} className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <label className="space-y-1">
              <span className="text-[10px] text-neutral-400">Target Organization Cell</span>
              <select
                value={simOrgId}
                onChange={(e) => setSimOrgId(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#f8a87c]"
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
              <span className="text-[10px] text-neutral-400">Tool / Capability Action</span>
              <select
                value={simAction}
                onChange={(e) => setSimAction(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#f8a87c]"
              >
                <option value="read_file">read_file (Workspace Read)</option>
                <option value="write_file">write_file (Workspace Write)</option>
                <option value="chat_with_agent">chat_with_agent (A2A Collaboration)</option>
                <option value="submit_to_agent">submit_to_agent (Sub-Agent Delegation)</option>
                <option value="iam360_submit_intent">iam360_submit_intent (Owner Policy Intent)</option>
                <option value="mcp:erpnext">mcp:erpnext (ERPNext Operations)</option>
                <option value="mcp:kb">mcp:kb (Outline Knowledge Base)</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[10px] text-neutral-400">Resource / Workspace Path</span>
              <input
                type="text"
                value={simPath}
                onChange={(e) => setSimPath(e.target.value)}
                placeholder="/app/working/workspaces/..."
                className="w-full rounded-xl bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-[#252a3d] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#f8a87c]"
              />
            </label>

            <div className="sm:col-span-3 flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span>Gợi ý test Baseline Deny:</span>
                <button
                  type="button"
                  onClick={() => setSimPath("/app/working.secret/keys.json")}
                  className="text-rose-400 hover:underline cursor-pointer"
                >
                  /app/working.secret
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSimPath("$workspace/credentials.yaml")}
                  className="text-rose-400 hover:underline cursor-pointer"
                >
                  $workspace/credentials.yaml
                </button>
              </div>

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
                  : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-[#fda4af]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  {simResult.allowed ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                  <span>
                    {simResult.effect} — {simResult.reason_code}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-black/20 text-[10px]">
                  Role in {simResult.organization_cell_id}: {simResult.role_in_cell.toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] opacity-90">Matched Rule: {simResult.matched_rule}</div>
              <div className="pt-1 border-t border-current/15 space-y-1">
                <div className="text-[10px] uppercase opacity-75">Decision Trace Path:</div>
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
