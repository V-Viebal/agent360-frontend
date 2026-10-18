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
  Users
} from "lucide-react";
import { EnterpriseDataTable, Column } from "../../components/ui/EnterpriseDataTable";
import { SlideOverDrawer } from "../../components/ui/SlideOverDrawer";
import { Modal } from "../../components/ui/Modal";

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
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const resAgents = await fetch("/api/v1/agents", { headers });
      if (resAgents.ok) {
        const data = await resAgents.json();
        setAgents(Array.isArray(data) ? data : []);
      }

      const resAssign = await fetch("/api/v1/admin/agents/assignments", { headers });
      if (resAssign.ok) {
        const data = await resAssign.json();
        setAssignments(Array.isArray(data) ? data : []);
      }

      const resUsers = await fetch("/api/v1/admin/users", { headers });
      if (resUsers.ok) {
        const data = await resUsers.json();
        setUsers(Array.isArray(data) ? data : []);
        if (data.length > 0 && targetUserId === 0) {
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

  async function handleAssignUser(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAgent || !targetUserId) return;
    setSubmitting(true);

    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/admin/agents/assign", {
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
        setFeedback(`Đã cấp quyền điều khiển Agent ${selectedAgent.name} thành công!`);
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

  async function handleRevokeAssignment(id: number) {
    if (!confirm("Bạn có chắc chắn muốn thu hồi quyền truy cập của thành viên này khỏi Agent?")) return;
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
      const res = await fetch(`/api/v1/admin/agents/assignments/${id}`, {
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
      width: "25%",
      cell: (agent) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 flex items-center justify-center shrink-0">
            <Bot size={15} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate text-xs hover:text-[#ff7a00] transition-colors">
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
      width: "20%",
      cell: (agent) => (
        <span className="font-mono text-[11px] text-neutral-300">
          {agent.node || "3rd-server (Core)"}
        </span>
      ),
    },
    {
      header: "Mô Hình AI",
      accessorKey: "model",
      sortable: true,
      width: "20%",
      cell: (agent) => (
        <span className="font-mono text-[11px] text-[#ff7a00] bg-[#ff7a00]/10 px-2 py-0.5 rounded-md border border-[#ff7a00]/20">
          {agent.model || "Qwen 2.5 72B / Claude 3.7"}
        </span>
      ),
    },
    {
      header: "Thành Viên Được Gán",
      sortable: false,
      width: "20%",
      cell: (agent) => {
        const assigned = assignments.filter((a) => a.agentSlug === agent.slug);
        return (
          <div className="flex items-center gap-1 flex-wrap">
            {assigned.length === 0 ? (
              <span className="text-[10px] text-neutral-500 font-mono">Chưa gán (Admin only)</span>
            ) : (
              assigned.map((a) => {
                const u = users.find((x) => x.id === a.userId);
                return (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300"
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
      width: "15%",
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
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>Quản Trị AI Teammates Fleet</span>
            <span className="text-[11px] font-mono text-[#ff7a00] bg-[#ff7a00]/10 px-2 py-0.5 rounded-full border border-[#ff7a00]/20">
              {agents.length} Agents
            </span>
          </h1>
          <p className="text-[11px] text-neutral-400">
            Giám sát cụm worker runtime trên VPS fleet (3rd, 6th, 7th Server) và phân quyền agent cho thành viên.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-1.5 rounded-xl border border-[#262634] bg-[#161620] hover:bg-[#20202c] text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
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
        exportFileName="agent360-agents-fleet"
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
              className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck size={14} />
              <span>Gán Thêm Thành Viên</span>
            </button>
          )
        }
      >
        {selectedAgent && (
          <div className="space-y-5">
            {/* Header Box */}
            <div className="p-4 rounded-xl bg-[#161622] border border-[#242432] flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/30 flex items-center justify-center font-bold">
                <Bot size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{selectedAgent.name}</div>
                <div className="text-neutral-400 font-mono text-[11px]">{selectedAgent.description || "Containerized Autonomous Agent"}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Runtime: {selectedAgent.node || "3rd-server"}</div>
              </div>
            </div>

            {/* Assigned Users Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">
                  Thành viên có quyền truy cập
                </span>
                <span className="text-[10px] font-mono text-[#ff7a00]">
                  {assignments.filter((a) => a.agentSlug === selectedAgent.slug).length} gán
                </span>
              </div>

              <div className="divide-y divide-[#242434] border border-[#242434] rounded-xl overflow-hidden bg-[#161622]">
                {assignments.filter((a) => a.agentSlug === selectedAgent.slug).length === 0 ? (
                  <div className="p-4 text-center text-neutral-500 text-xs">
                    Chưa có thành viên thông thường nào được gán. Hiện chỉ có Admin toàn quyền điều khiển.
                  </div>
                ) : (
                  assignments
                    .filter((a) => a.agentSlug === selectedAgent.slug)
                    .map((a) => {
                      const u = users.find((x) => x.id === a.userId);
                      return (
                        <div key={a.id} className="p-3 flex items-center justify-between hover:bg-[#1a1a28] transition-colors">
                          <div>
                            <div className="font-semibold text-white text-xs">
                              {u?.displayName || u?.email || `User #${a.userId}`}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
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
        )}
      </SlideOverDrawer>

      {/* Assign User Modal */}
      {showAssignModal && selectedAgent && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title={`Gán Quyền: ${selectedAgent.name}`}
        >
          <form onSubmit={handleAssignUser} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-400 block">Chọn thành viên thụ hưởng</label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#181822] border border-[#282836] text-white focus:outline-none focus:border-[#ff7a00]"
                required
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.displayName || u.email || `User #${u.id}`} ({u.roles.join(", ") || "Member"})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 block">Vai trò trong Agent</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#181822] border border-[#282836] text-white focus:outline-none focus:border-[#ff7a00]"
              >
                <option value="Owner">Owner (Toàn quyền chat & công cụ)</option>
                <option value="Operator">Operator (Thực thi tác vụ)</option>
                <option value="Viewer">Viewer (Chỉ xem log)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-3 py-1.5 rounded-xl text-neutral-400 hover:text-white cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-bold cursor-pointer disabled:opacity-50"
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
