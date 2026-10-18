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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
      const [agentsRes, assignRes] = await Promise.all([
        fetch("/api/v1/agents", { headers }),
        fetch("/api/v1/admin/agents/assignments", { headers }),
      ]);

      if (agentsRes.ok) {
        const ag = await agentsRes.json();
        setAgents(Array.isArray(ag) ? ag : []);
      }
      if (assignRes.ok) {
        const as = await assignRes.json();
        setAssignments(Array.isArray(as) ? as : []);
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
    if (!selectedAgentSlug || targetUserId <= 0) return;

    setSubmitting(true);
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
        setFeedback(`Agent ${selectedAgentSlug} successfully assigned to User #${targetUserId}`);
        setShowAssignModal(false);
        loadData();
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedback(`Failed to assign: ${err.message || res.statusText}`);
      }
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  }

  async function handleDeleteAssignment(id: number) {
    const token = sessionStorage.getItem("skyer_access_token");
    try {
      const res = await fetch(`/api/v1/admin/agents/assignments/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setAssignments((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  }

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.node && a.node.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Fleet Agents & Scoping</h1>
          <p className="text-xs text-neutral-400">
            View all autonomous agents across infra nodes and manage member ownership assignments.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedAgentSlug(agents[0]?.slug || "");
              setShowAssignModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8a1a] text-black text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#ff7a00]/10"
          >
            <Plus size={14} />
            <span>Assign Agent to User</span>
          </button>
          <button
            onClick={loadData}
            title="Refresh list"
            className="p-2 rounded-xl border border-[#262634] bg-[#161620] hover:bg-[#20202c] text-neutral-300 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-xs text-[#ff7a00] flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Current Assignments Bar */}
      <div className="p-5 rounded-2xl bg-[#14141a] border border-[#22222c]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-[#ff7a00]" />
            <h2 className="text-sm font-semibold text-white">Active Member Scoping Assignments</h2>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            {assignments.length} bindings recorded
          </span>
        </div>

        {assignments.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#181822] border border-[#262634] text-center text-xs text-neutral-500">
            No specific member assignments yet. By default, regular members see 0 agents until an admin assigns them.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {assignments.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-[#181822] border border-[#262634] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>{item.agentSlug}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-[#ff7a00]/20 text-[#ff7a00] text-[9px] font-mono">
                      {item.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    Assigned to User #{item.userId}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAssignment(item.id)}
                  title="Remove binding"
                  className="text-neutral-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agents Search & Table */}
      <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot size={16} className="text-[#ff7a00]" />
            <h2 className="text-sm font-semibold text-white">Cluster Fleet Inventory ({agents.length})</h2>
          </div>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search agents or nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181822] border border-[#262634] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#ff7a00]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-neutral-500">Loading infrastructure fleet...</div>
        ) : filteredAgents.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">No agents match your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#22222e] text-[11px] text-neutral-500 uppercase tracking-wider font-mono">
                <tr>
                  <th className="pb-3 pl-2">Agent Name</th>
                  <th className="pb-3">Compute Node</th>
                  <th className="pb-3">Default Model</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e28]">
                {filteredAgents.map((ag) => (
                  <tr key={ag.id} className="hover:bg-[#181822]/60 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="font-semibold text-white">{ag.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{ag.slug}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px]">
                        {ag.node || "3rd Server (Core)"}
                      </span>
                    </td>
                    <td className="py-3 text-neutral-400 font-mono text-[11px]">
                      {ag.model || "claude-3-7-sonnet"}
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active</span>
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={() => {
                          setSelectedAgentSlug(ag.slug);
                          setShowAssignModal(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 text-[#ff7a00] font-medium text-[11px] transition-colors cursor-pointer"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Assign */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#14141a] border border-[#2a2a38] shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Assign Agent Scoping</h3>
            <p className="text-xs text-neutral-400 mb-5">
              Authorize a specific user to view, prompt, and operate this autonomous agent.
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Agent Slug</label>
                <select
                  value={selectedAgentSlug}
                  onChange={(e) => setSelectedAgentSlug(e.target.value)}
                  className="w-full bg-[#181822] border border-[#282838] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#ff7a00]"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.slug}>
                      {a.name} ({a.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Target User ID (Local DB)</label>
                <input
                  type="number"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(Number(e.target.value))}
                  placeholder="e.g. 5"
                  className="w-full bg-[#181822] border border-[#282838] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#ff7a00]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Assignment Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-[#181822] border border-[#282838] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#ff7a00]"
                >
                  <option value="Owner">Owner (Full access & settings)</option>
                  <option value="Operator">Operator (Prompting & tools only)</option>
                  <option value="Viewer">Viewer (Read-only observation)</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8a1a] text-black text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
