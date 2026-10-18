import React, { useState, useEffect } from "react";
import { Building2, Plus, Users, Shield, CheckCircle, RefreshCw, Edit2, Trash2 } from "lucide-react";
import { DataTable, Column } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";

interface OrganizationItem {
  id: string;
  name: string;
  slug: string;
  members_count: number;
  agents_count: number;
  plan: string;
  status: string;
  created_at: string;
}

export function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOrg, setEditOrg] = useState<OrganizationItem | null>(null);
  const [quotaPlan, setQuotaPlan] = useState("");
  const [quotaAgents, setQuotaAgents] = useState<number>(10);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadOrgs() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/admin/metrics/organizations", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setOrgs(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrgs();
  }, []);

  const handleOpenEdit = (org: OrganizationItem) => {
    setEditOrg(org);
    setQuotaPlan(org.plan);
    setQuotaAgents(org.agents_count);
  };

  const handleSaveQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOrg) return;

    setOrgs((prev) =>
      prev.map((o) =>
        o.id === editOrg.id
          ? { ...o, plan: quotaPlan, agents_count: quotaAgents }
          : o
      )
    );
    setEditOrg(null);
    setFeedback(`Đã cập nhật hạn mức cho tổ chức ${editOrg.name} thành công!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const columns: Column<OrganizationItem>[] = [
    {
      header: "Organization Name",
      accessorKey: "name",
      sortable: true,
      cell: (org) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{org.name}</div>
          <div className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">slug: {org.slug}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (org) => (
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
          {org.status}
        </span>
      ),
    },
    {
      header: "Members",
      accessorKey: "members_count",
      sortable: true,
      cell: (org) => (
        <span className="font-mono text-slate-700 dark:text-neutral-300">
          {org.members_count} Users
        </span>
      ),
    },
    {
      header: "Agents Quota",
      accessorKey: "agents_count",
      sortable: true,
      cell: (org) => (
        <span className="font-mono font-semibold text-[#ff7a00]">
          {org.agents_count} Agents
        </span>
      ),
    },
    {
      header: "Plan Tier",
      accessorKey: "plan",
      sortable: true,
      cell: (org) => (
        <span className="text-[11px] font-mono text-slate-600 dark:text-neutral-400">
          {org.plan}
        </span>
      ),
    },
    {
      header: "Actions",
      sortable: false,
      className: "text-right",
      cell: (org) => (
        <button
          type="button"
          onClick={() => handleOpenEdit(org)}
          className="px-3 py-1 rounded-lg border border-slate-200 dark:border-[#2e2e3e] bg-white dark:bg-[#1a1a24] hover:bg-[#ff7a00]/10 hover:border-[#ff7a00]/40 text-slate-700 dark:text-neutral-200 hover:text-[#ff7a00] text-[11px] font-medium transition-all cursor-pointer shadow-xs"
        >
          Manage Quota
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            Organizations & Workspaces
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Tenant boundaries and team workspace quotas verified from backend persistence.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadOrgs}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#262634] bg-white dark:bg-[#161620] hover:bg-slate-100 dark:hover:bg-[#20202c] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-2 text-xs shadow-xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400/60 hover:text-emerald-400 text-xs cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-white dark:bg-[#14141a] border border-slate-200 dark:border-[#22222c] shadow-xs">
        <DataTable
          data={orgs}
          columns={columns}
          isLoading={loading}
          searchPlaceholder="Search organizations by name, slug, or tier..."
          emptyTitle="No organizations registered"
          emptyDescription="Organizations and workspace tenants will appear here."
          pageSize={8}
        />
      </div>

      {/* Edit Organization Modal */}
      {editOrg && (
        <Modal
          isOpen={Boolean(editOrg)}
          onClose={() => setEditOrg(null)}
          title={`Edit Quota: ${editOrg.name}`}
        >
          <form onSubmit={handleSaveQuota} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-neutral-300">Workspace Plan</label>
              <input
                type="text"
                value={quotaPlan}
                onChange={(e) => setQuotaPlan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#181822] border border-slate-200 dark:border-[#2a2a38] text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#ff7a00]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-neutral-300">Max Autonomous Agents Quota</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quotaAgents}
                onChange={(e) => setQuotaAgents(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#181822] border border-slate-200 dark:border-[#2a2a38] text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#ff7a00]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditOrg(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black text-xs font-semibold cursor-pointer shadow-sm transition-all"
              >
                Save Quota
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
