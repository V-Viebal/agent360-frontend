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
  AlertCircle
} from "lucide-react";
import { DataTable, Column } from "../../components/ui/DataTable";
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
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgentSlug, setSelectedAgentSlug] = useState("");
  const [targetUserId, setTargetUserId] = useState<number>(5);
  const [targetRole, setTargetRole] = useState("Owner");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const token = sessionStorage.getItem("skyer_access_token");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      // 1. Load fleet agents
      const resAgents = await fetch("/api/v1/agents", { headers });
      if (resAgents.ok) {
        const data = await resAgents.json();
        setAgents(Array.isArray(data) ? data : []);
      }

      // 2. Load assignments
      const resAssign = await fetch("/api/v1/admin/agents/assignments", { headers });
      if (resAssign.ok) {
        const data = await resAssign.json();
        setAssignments(Array.isArray(data) ? data : []);
      }

      // 3. Load users for dropdown selector
      const resUsers = await fetch("/api/v1/admin/users", { headers });
      if (resUsers.ok) {
        const data = await resUsers.json();
        setUsers(Array.isArray(data) ? data : []);
        if (data.length > 0 && !targetUserId) {
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

  async function handleAssignSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/admin/agents/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: Number(targetUserId),
          agentSlug: selectedAgentSlug,
          role: targetRole,
        }),
      });

      if (res.ok) {
        setFeedback(`Agent '${selectedAgentSlug}' assigned to User successfully.`);
        setShowAssignModal(false);
        await loadData();
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedback(`Error: ${err.message || "Failed to assign agent"}`);
      }
    } catch (e: any) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteAssignment(id: number) {
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch(`/api/v1/admin/agents/assignments/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const columns: Column<AgentItem>[] = [
    {
      header: "Agent Identity",
      accessorKey: "name",
      sortable: true,
      cell: (ag) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{ag.name}</div>
          <div className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">{ag.slug}</div>
        </div>
      ),
    },
    {
      header: "Compute Node",
      accessorKey: "node",
      sortable: true,
      cell: (ag) => (
        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 font-mono text-[10px]">
          {ag.node || "3rd Server (Core)"}
        </span>
      ),
    },
    {
      header: "Intelligence Model",
      accessorKey: "model",
      sortable: true,
      cell: (ag) => (
        <span className="text-slate-600 dark:text-neutral-400 font-mono text-[11px]">
          {ag.model || "claude-3-7-sonnet"}
        </span>
      ),
    },
    {
      header: "Operating Status",
      accessorKey: "status",
      sortable: true,
      cell: () => (
        <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active</span>
        </span>
      ),
    },
    {
      header: "Actions",
      sortable: false,
      className: "text-right",
      cell: (ag) => (
        <button
          type="button"
          onClick={() => {
            setSelectedAgentSlug(ag.slug);
            setShowAssignModal(true);
          }}
          className="px-3 py-1 rounded-lg bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 text-[#ff7a00] font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
        >
          Assign User
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            Agent Fleet & Ownership Scoping
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Control which tenant members or team operators have access to specific autonomous agents across the cluster.
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 rounded-xl border border-slate-200 dark:border-[#262634] bg-white dark:bg-[#161620] hover:bg-slate-100 dark:hover:bg-[#20202c] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-2 text-xs shadow-xs self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Fleet</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Current Scoping Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#14141a] border border-slate-200 dark:border-[#22222c] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-[#ff7a00]" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active Scoping Assignments</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400">
            {assignments.length} bindings recorded
          </span>
        </div>

        {assignments.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181822] border border-slate-200 dark:border-[#262634] text-center text-xs text-slate-500 dark:text-neutral-400">
            No specific member assignments yet. By default, regular members see 0 agents until an admin assigns them.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {assignments.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#181822] border border-slate-200 dark:border-[#262634] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{item.agentSlug}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-[#ff7a00]/20 text-[#ff7a00] text-[9px] font-mono">
                      {item.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono mt-0.5">
                    Assigned to: {(() => {
                      const matched = users.find((u) => u.id === item.userId);
                      return matched ? (matched.displayName || matched.email || `User #${item.userId}`) : `User #${item.userId}`;
                    })()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAssignment(item.id)}
                  title="Remove binding"
                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agents Search & DataTable */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#14141a] border border-slate-200 dark:border-[#22222c] shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Bot size={16} className="text-[#ff7a00]" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Cluster Fleet Inventory ({agents.length})</h2>
        </div>

        <DataTable
          data={agents}
          columns={columns}
          isLoading={loading}
          searchPlaceholder="Search agents by name, slug, or model..."
          emptyTitle="No agents found"
          emptyDescription="Deploy agents in cluster to see them listed here."
          pageSize={8}
        />
      </div>

      {/* Modal Assign */}
      {showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Assign Agent Scoping"
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Authorize a specific user to view, prompt, and operate this autonomous agent.
            </p>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-neutral-400 block mb-1">
                Target Agent
              </label>
              <input
                type="text"
                disabled
                value={selectedAgentSlug}
                className="w-full bg-slate-100 dark:bg-[#1c1c28] border border-slate-200 dark:border-[#2e2e3e] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono cursor-not-allowed opacity-80"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-neutral-400 block mb-1">
                Assign to User
              </label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#1c1c28] border border-slate-200 dark:border-[#2e2e3e] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#ff7a00]"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.displayName || u.email || `User #${u.id}`} ({u.roles.join(", ") || "Member"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-neutral-400 block mb-1">
                Access Level / Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1c1c28] border border-slate-200 dark:border-[#2e2e3e] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#ff7a00]"
              >
                <option value="Owner">Owner (Full Read, Prompt & Config)</option>
                <option value="Operator">Operator (Prompt & Memory only)</option>
                <option value="Viewer">Viewer (Read audit trail only)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#22222e]">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Assignment"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
