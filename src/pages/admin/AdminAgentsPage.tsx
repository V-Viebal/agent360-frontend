import React, { useState, useEffect } from "react";
import {
  Bot,
  UserCheck,
  Search,
  RefreshCw,
  Plus,
  Shield,
  Layers,
  Cpu,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  Globe
} from "lucide-react";
import { EnterpriseDataTable, Column } from "../../components/ui/EnterpriseDataTable";
import { SlideOverDrawer } from "../../components/ui/SlideOverDrawer";
import { Modal } from "../../components/ui/Modal";
import { CustomSelect, SelectOption } from "../../components/ui/CustomSelect";
import { AgentIam360CellTab } from "../../components/AgentIam360CellTab";

interface AgentItem {
  id: string;
  name: string;
  slug: string;
  node?: string;
  status: string;
  model?: string;
  description?: string;
  enabled: boolean;
}

interface UserItem {
  id: number;
  logtoUserId: string;
  email?: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  roles: string[];
}

interface AssignmentItem {
  id: number;
  userId: number;
  agentSlug: string;
  role: string;
  assignedAt: string;
}

const ANYONE_USER_ID = -1;

const normalizeSlug = (slug?: string) =>
  (slug || "").replace(/^bot:agent360:/i, "").trim().toLowerCase();

export function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<AgentItem | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [targetUserId, setTargetUserId] = useState<number>(0);
  const [targetRole, setTargetRole] = useState("Owner");
  const [submitting, setSubmitting] = useState(false);
  const [togglingAnyoneSlug, setTogglingAnyoneSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const resAgents = await fetch("/api/agents", { headers });
      if (resAgents.ok) {
        const data = await resAgents.json();
        setAgents(Array.isArray(data) ? data : []);
      }

      const resAssign = await fetch("/api/admin/agents/assignments", { headers });
      if (resAssign.ok) {
        const data = await resAssign.json();
        setAssignments(Array.isArray(data) ? data : []);
      }

      const resUsers = await fetch("/api/admin/users", { headers });
      if (resUsers.ok) {
        const data = await resUsers.json();
        setUsers(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0 && targetUserId === 0) {
          setTargetUserId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const getAgentAssignments = (agentSlug: string) => {
    const clean = normalizeSlug(agentSlug);
    return assignments.filter((a) => normalizeSlug(a.agentSlug) === clean);
  };

  const getAnyoneAssignment = (agentSlug: string) => {
    return getAgentAssignments(agentSlug).find((a) => a.userId === ANYONE_USER_ID);
  };

  async function handleToggleAnyoneAccess(agent: AgentItem, enabled: boolean, role: string = "Operator") {
    setTogglingAnyoneSlug(agent.slug);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const res = await fetch("/api/admin/agents/anyone-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          agentSlug: agent.slug,
          enabled,
          role,
        }),
      });

      if (res.ok) {
        setFeedback(
          enabled
            ? `Đã bật quyền "Anyone" (${role}) cho Agent ${agent.name} — tất cả tài khoản đều có quyền truy cập!`
            : `Đã tắt quyền "Anyone" trên Agent ${agent.name}.`
        );
        setTimeout(() => setFeedback(null), 3500);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTogglingAnyoneSlug(null);
    }
  }

  async function handleAssignUser(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAgent || (targetUserId <= 0 && targetUserId !== ANYONE_USER_ID)) return;
    setSubmitting(true);

    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const res = await fetch("/api/admin/agents/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: targetUserId,
          agentSlug: selectedAgent.slug,
          role: targetRole,
        }),
      });

      if (res.ok) {
        setFeedback(
          targetUserId === ANYONE_USER_ID
            ? `Đã cấp quyền Anyone (${targetRole}) cho Agent ${selectedAgent.name} thành công!`
            : `Đã cấp quyền điều khiển Agent ${selectedAgent.name} thành công!`
        );
        setShowAssignModal(false);
        setTimeout(() => setFeedback(null), 3500);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClearAllAssignments(agentSlug?: string) {
    const msg = agentSlug
      ? `Bạn có chắc chắn muốn gỡ toàn bộ phân quyền trên Agent "${agentSlug}" (về mặc định không gán cho ai)?`
      : "Bạn có chắc chắn muốn đặt lại mặc định: gỡ toàn bộ phân quyền của tất cả Agent (không gán cho bất kỳ ai)?";
    if (!confirm(msg)) return;
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const url = agentSlug
        ? `/api/admin/agents/assignments?agentSlug=${encodeURIComponent(agentSlug)}`
        : `/api/admin/agents/assignments`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setFeedback(
          agentSlug
            ? `Đã gỡ toàn bộ phân quyền trên Agent "${agentSlug}" về mặc định (Chưa gán)!`
            : "Đã đặt lại mặc định: Tất cả Agent hiện không gán cho bất kỳ ai!"
        );
        setTimeout(() => setFeedback(null), 3500);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleRevokeAssignment(id: number) {
    if (!confirm("Bạn có chắc chắn muốn thu hồi quyền truy cập này khỏi Agent?")) return;
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const res = await fetch(`/api/admin/agents/assignments/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setFeedback("Đã thu hồi quyền truy cập thành công!");
        setTimeout(() => setFeedback(null), 3500);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const columns: Column<AgentItem>[] = [
    {
      header: "AI Agent / Teammate",
      accessorKey: "name",
      sortable: true,
      width: "22%",
      cell: (agent) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-[#f8a87c]/15 text-[#f8a87c] border border-[#f8a87c]/30 flex items-center justify-center shrink-0">
            <Bot size={15} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-white truncate text-xs hover:text-[#f8a87c] transition-colors">
              {agent.name}
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">slug: {agent.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Cụm VPS Node",
      accessorKey: "node",
      sortable: true,
      width: "16%",
      cell: (agent) => (
        <span className="font-mono text-[11px] text-slate-700 dark:text-neutral-300">
          {agent.node || "3rd-server (Core)"}
        </span>
      ),
    },
    {
      header: "Mô Hình AI",
      accessorKey: "model",
      sortable: true,
      width: "18%",
      cell: (agent) => (
        <span className="font-mono text-[11px] text-[#f8a87c] bg-[#f8a87c]/10 px-2 py-0.5 rounded-md border border-[#f8a87c]/20">
          {agent.model || "Qwen 2.5 72B / Claude 3.7"}
        </span>
      ),
    },
    {
      header: "Quyền Anyone",
      sortable: false,
      width: "14%",
      cell: (agent) => {
        const anyoneAssign = getAnyoneAssignment(agent.slug);
        const isAnyone = Boolean(anyoneAssign);
        const isBusy = togglingAnyoneSlug === agent.slug;
        return (
          <div onClick={(e) => e.stopPropagation()} className="flex items-center">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => handleToggleAnyoneAccess(agent, !isAnyone, anyoneAssign?.role || "Operator")}
              title={
                isAnyone
                  ? "Đang cho phép Anyone (tất cả người dùng đã đăng nhập). Nhấn để tắt."
                  : "Nhấn để cho phép Anyone (bất kỳ ai đăng nhập cũng có quyền dùng Agent này)"
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border transition-all cursor-pointer disabled:opacity-50 ${
                isAnyone
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                  : "bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-white/10 hover:text-slate-800 dark:hover:text-white hover:border-[#f8a87c]/40"
              }`}
            >
              <Globe size={11} className={isAnyone ? "text-emerald-400" : "text-neutral-400"} />
              <span>{isAnyone ? `Anyone (${anyoneAssign?.role || "Operator"})` : "Tắt (Restricted)"}</span>
            </button>
          </div>
        );
      },
    },
    {
      header: "Thành Viên Được Gán",
      sortable: false,
      width: "18%",
      cell: (agent) => {
        const assigned = getAgentAssignments(agent.slug);
        return (
          <div className="flex items-center gap-1 flex-wrap">
            {assigned.length === 0 ? (
              <span className="text-[10px] text-neutral-500 font-mono">Chưa gán (Admin only)</span>
            ) : (
              assigned.map((a) => {
                if (a.userId === ANYONE_USER_ID) {
                  return (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold"
                    >
                      <Globe size={10} />
                      <span>Anyone (Mọi người)</span>
                    </span>
                  );
                }
                const u = users.find((x) => x.id === a.userId);
                return (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-700 dark:text-neutral-300"
                  >
                    <span>{u?.displayName || u?.email?.split("@")[0] || `User #${a.userId}`}</span>
                  </span>
                );
              })
            )}
          </div>
        );
      },
    },
    {
      header: "Trạng Thái",
      accessorKey: "status",
      sortable: true,
      width: "12%",
      className: "text-right",
      cell: (agent) => (
        <div className="flex items-center justify-end gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ONLINE</span>
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
            <span>Quản Trị AI Teammates Fleet</span>
            <span className="text-[11px] font-mono text-[#f8a87c] bg-[#f8a87c]/10 px-2 py-0.5 rounded-full border border-[#f8a87c]/20">
              {agents.length} Agents
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400">
            Giám sát cụm worker runtime trên VPS fleet và phân quyền Agent cho từng thành viên hoặc mở quyền Anyone (tất cả người dùng).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {assignments.length > 0 && (
            <button
              onClick={() => handleClearAllAssignments()}
              className="px-2.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="Gỡ toàn bộ phân quyền của tất cả Agent về trạng thái mặc định (không gán cho ai)"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline text-[11px]">Gỡ tất cả phân quyền ({assignments.length})</span>
            </button>
          )}
          <button
            onClick={loadData}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-[#262634] bg-slate-50 dark:bg-[#161620] hover:bg-slate-100 dark:hover:bg-[#20202c] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
            title="Tải lại danh sách"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline text-[11px]">Tải lại</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400/60 hover:text-emerald-400 text-xs cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      {/* Main Full-Height Power Table */}
      <EnterpriseDataTable
        data={agents}
        columns={columns}
        isLoading={loading}
        tableKey="admin_agents"
        searchPlaceholder="Tìm kiếm Agent theo tên, slug, cụm VPS..."
        emptyTitle="Không có AI Agent nào"
        emptyDescription="Các agent containerized trên fleet sẽ tự động nhận diện ở đây."
        defaultPageSize={25}
        exportFileName="skyer-agents-fleet"
        onRowClick={(a) => setSelectedAgent(a)}
        selectedItemId={selectedAgent?.slug}
      />

      {/* Slide-over Agent Detail Drawer */}
      <SlideOverDrawer
        isOpen={Boolean(selectedAgent)}
        onClose={() => setSelectedAgent(null)}
        title={`AI Teammate: ${selectedAgent?.name || "Agent"}`}
        subtitle={`Slug: ${selectedAgent?.slug}`}
        actions={
          selectedAgent && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2 rounded-xl bg-[#f8a87c] hover:bg-[#f5935f] text-black font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck size={14} />
              <span>Gán Thêm Thành Viên</span>
            </button>
          )
        }
      >
        {selectedAgent && (() => {
          const anyoneAssign = getAnyoneAssignment(selectedAgent.slug);
          const isAnyoneEnabled = Boolean(anyoneAssign);
          const isToggling = togglingAnyoneSlug === selectedAgent.slug;
          const agentAssignedList = getAgentAssignments(selectedAgent.slug);

          return (
            <div className="space-y-5">
              {/* Header Box */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#161622] border border-slate-200 dark:border-[#242432] flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#f8a87c]/20 text-[#f8a87c] border border-[#f8a87c]/30 flex items-center justify-center font-bold">
                  <Bot size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedAgent.name}</div>
                  <div className="text-slate-500 dark:text-neutral-400 font-mono text-[11px]">{selectedAgent.description || "Containerized Autonomous Agent"}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Runtime: {selectedAgent.node || "3rd-server"}</div>
                </div>
              </div>

              {/* Public / Anyone Access Configuration Card */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#161622] border border-slate-200 dark:border-[#242432] space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isAnyoneEnabled
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-100 dark:bg-white/5 text-neutral-400 border-slate-200 dark:border-white/10"
                    }`}>
                      <Globe size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Cho phép bất kỳ ai (Anyone Access)</span>
                        {isAnyoneEnabled && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[9px] uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        Khi bật, tất cả tài khoản đăng nhập vào hệ thống đều tự động thấy và có quyền tương tác với Agent này mà không cần gán từng người.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={() => handleToggleAnyoneAccess(selectedAgent, !isAnyoneEnabled, anyoneAssign?.role || "Operator")}
                    className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer shrink-0 disabled:opacity-50 ${
                      isAnyoneEnabled
                        ? "bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30"
                        : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {isToggling ? "Đang lưu..." : isAnyoneEnabled ? "Tắt Anyone" : "Bật Anyone"}
                  </button>
                </div>

                {isAnyoneEnabled && (
                  <div className="pt-2 border-t border-slate-200/70 dark:border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-neutral-400 font-mono">Vai trò mặc định cho Anyone:</span>
                    <div className="flex items-center gap-1.5">
                      {(["Owner", "Operator", "Viewer"] as const).map((r) => {
                        const active = (anyoneAssign?.role || "Operator").toLowerCase() === r.toLowerCase();
                        return (
                          <button
                            key={r}
                            type="button"
                            disabled={isToggling}
                            onClick={() => handleToggleAnyoneAccess(selectedAgent, true, r)}
                            className={`px-2 py-0.5 rounded-md font-mono text-[10px] border transition-all cursor-pointer ${
                              active
                                ? "bg-[#f8a87c] text-black font-bold border-[#f8a87c]"
                                : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
                            }`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* IAM360 Identity Cell & Organization Cell Hierarchy Tree */}
              <div className="pt-2 border-t border-slate-200 dark:border-[#242434]">
                <AgentIam360CellTab
                  agentId={selectedAgent.id}
                  agentSlug={selectedAgent.slug}
                  agentName={selectedAgent.name}
                />
              </div>

              {/* Assigned Users Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-neutral-400 font-semibold">
                    Thành viên có quyền truy cập
                  </span>
                  <span className="text-[10px] font-mono text-[#f8a87c]">
                    {agentAssignedList.length} gán
                  </span>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-[#242434] border border-slate-200 dark:border-[#242434] rounded-xl overflow-hidden bg-white dark:bg-[#161622]">
                  {agentAssignedList.length === 0 ? (
                    <div className="p-4 text-center text-neutral-500 text-xs">
                      Chưa có thành viên thông thường nào được gán. Hiện chỉ có Admin toàn quyền điều khiển.
                    </div>
                  ) : (
                    agentAssignedList.map((a) => {
                      const isAnyone = a.userId === ANYONE_USER_ID;
                      const u = users.find((x) => x.id === a.userId);
                      return (
                        <div key={a.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#1a1a28] transition-colors">
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                              {isAnyone ? (
                                <>
                                  <Globe size={13} className="text-emerald-400" />
                                  <span className="text-emerald-400">Anyone (Tất cả thành viên đã đăng nhập)</span>
                                </>
                              ) : (
                                <span>{u?.displayName || u?.email || `User #${a.userId}`}</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">
                              Role: {a.role} • Gán lúc: {new Date(a.assignedAt).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRevokeAssignment(a.id)}
                            className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                            title="Thu hồi quyền"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </SlideOverDrawer>

      {/* Assign User Modal */}
      {showAssignModal && selectedAgent && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title={`Gán Quyền: ${selectedAgent.name}`}
          bodyClassName="p-6 overflow-visible"
        >
          <form onSubmit={handleAssignUser} className="space-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-neutral-300 font-medium block">Chọn đối tượng thụ hưởng</label>
              <CustomSelect
                value={targetUserId.toString()}
                onChange={(val) => setTargetUserId(Number(val))}
                placeholder="Chọn Anyone hoặc thành viên cụ thể..."
                searchable={true}
                className="w-full"
                triggerClassName="w-full p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#181822] border border-slate-200 dark:border-[#282836] text-slate-900 dark:text-white hover:border-[#f8a87c]/50"
                options={[
                  {
                    value: ANYONE_USER_ID.toString(),
                    label: "🌐 Anyone (Tất cả người dùng đã đăng nhập)",
                    badge: "Public / All Users",
                    description: "Mở quyền truy cập Agent này cho mọi tài khoản trên hệ thống",
                  },
                  ...users.map((u) => {
                    const isAdminRole = u.roles.some((r) => r.toUpperCase().includes("ADMIN"));
                    const cleanName = u.displayName || `${u.firstName || ""} ${u.lastName || ""}`.trim() || (u.email ? u.email.split("@")[0] : `User #${u.id}`);
                    return {
                      value: u.id.toString(),
                      label: cleanName,
                      badge: isAdminRole ? "Admin" : "Member",
                      description: u.email ? `${u.email} (DB #${u.id})` : `DB #${u.id} • ${u.logtoUserId}`,
                    };
                  }),
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-neutral-300 font-medium block">Vai trò trong Agent</label>
              <CustomSelect
                value={targetRole}
                onChange={(val) => setTargetRole(val)}
                className="w-full"
                triggerClassName="w-full p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#181822] border border-slate-200 dark:border-[#282836] text-slate-900 dark:text-white hover:border-[#f8a87c]/50"
                options={[
                  { value: "Owner", label: "Owner (Chủ sở hữu)", badge: "Toàn quyền", description: "Toàn quyền hội thoại, kích hoạt công cụ và cấu hình Agent" },
                  { value: "Operator", label: "Operator (Vận hành)", badge: "Tác vụ", description: "Thực thi tác vụ, chạy routine automation" },
                  { value: "Viewer", label: "Viewer (Quan sát)", badge: "Chỉ đọc", description: "Chỉ xem lịch sử và nhật ký hoạt động của Agent" },
                ]}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#20202c]">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting || (targetUserId <= 0 && targetUserId !== ANYONE_USER_ID)}
                className="px-5 py-2.5 rounded-xl bg-[#f8a87c] hover:bg-[#f5935f] text-black font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Đang gán..." : "Xác nhận gán quyền"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
