import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Users,
  Shield,
  CheckCircle,
  RefreshCw,
  Edit2,
  Trash2,
  ExternalLink
} from "lucide-react";
import { EnterpriseDataTable, Column } from "../../components/ui/EnterpriseDataTable";
import { SlideOverDrawer } from "../../components/ui/SlideOverDrawer";
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
  const [selectedOrg, setSelectedOrg] = useState<OrganizationItem | null>(null);
  const [editOrg, setEditOrg] = useState<OrganizationItem | null>(null);
  const [quotaPlan, setQuotaPlan] = useState("");
  const [quotaAgents, setQuotaAgents] = useState<number>(10);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadOrgs() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
      const res = await fetch("/api/admin/metrics/organizations", {
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
      header: "Tổ Chức / Workspace",
      accessorKey: "name",
      sortable: true,
      width: "30%",
      cell: (org) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Building2 size={15} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-white truncate text-xs hover:text-[#ff7a00] transition-colors">
              {org.name}
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">slug: {org.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Trạng Thái",
      accessorKey: "status",
      sortable: true,
      width: "15%",
      cell: (org) => (
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
          {org.status}
        </span>
      ),
    },
    {
      header: "Thành Viên",
      accessorKey: "members_count",
      sortable: true,
      width: "15%",
      cell: (org) => (
        <span className="font-mono text-slate-700 dark:text-neutral-300 text-[11px]">
          {org.members_count} Users
        </span>
      ),
    },
    {
      header: "Quota Agents",
      accessorKey: "agents_count",
      sortable: true,
      width: "15%",
      cell: (org) => (
        <span className="font-mono font-semibold text-[#ff7a00] text-[11px]">
          {org.agents_count} Agents
        </span>
      ),
    },
    {
      header: "Gói Dịch Vụ",
      accessorKey: "plan",
      sortable: true,
      width: "15%",
      cell: (org) => (
        <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400">
          {org.plan}
        </span>
      ),
    },
    {
      header: "Thao Tác",
      sortable: false,
      width: "10%",
      className: "text-right",
      cell: (org) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenEdit(org);
          }}
          className="px-2.5 py-1 rounded-lg border border-[#2e2e3e] bg-slate-100 dark:bg-[#1a1a24] hover:bg-[#ff7a00]/10 hover:border-[#ff7a00]/40 text-slate-800 dark:text-neutral-200 hover:text-[#ff7a00] text-[11px] font-medium transition-all cursor-pointer"
        >
          Sửa Quota
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 space-y-3">
      {/* Header Tier */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Tổ Chức & Không Gian Làm Việc (Tenants)</span>
            <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              {orgs.length} Tenants
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400">
            Phân định ranh giới tổ chức, quản trị tài nguyên và quota agent theo từng tenant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadOrgs}
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
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400/60 hover:text-emerald-400 text-xs cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      {/* Main Full-Height Power Table */}
      <EnterpriseDataTable
        data={orgs}
        columns={columns}
        isLoading={loading}
        tableKey="admin_orgs"
        searchPlaceholder="Tìm kiếm tổ chức theo tên, slug, gói..."
        emptyTitle="Chưa có tổ chức nào"
        emptyDescription="Các workspace tenant sẽ xuất hiện tại đây."
        defaultPageSize={25}
        exportFileName="agent360-organizations"
        onRowClick={(org) => setSelectedOrg(org)}
        selectedItemId={selectedOrg?.id}
      />

      {/* Slide-over Organization Detail Drawer */}
      <SlideOverDrawer
        isOpen={Boolean(selectedOrg)}
        onClose={() => setSelectedOrg(null)}
        title={`Tổ chức: ${selectedOrg?.name || "Workspace"}`}
        subtitle={`Slug: ${selectedOrg?.slug}`}
        actions={
          selectedOrg && (
            <button
              onClick={() => handleOpenEdit(selectedOrg)}
              className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-bold text-xs cursor-pointer"
            >
              Cập nhật Quota Hạn Mức
            </button>
          )
        }
      >
        {selectedOrg && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#161622] border border-slate-200 dark:border-[#242432] flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                <Building2 size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedOrg.name}</div>
                <div className="text-slate-500 dark:text-neutral-400 font-mono text-[11px]">slug: {selectedOrg.slug}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Trạng thái: {selectedOrg.status}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181824] border border-[#262636] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-neutral-400">Gói đăng ký:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedOrg.plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-neutral-400">Số lượng thành viên:</span>
                <span className="text-blue-400">{selectedOrg.members_count} Users</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-neutral-400">Hạn mức AI Agent:</span>
                <span className="text-[#ff7a00] font-bold">{selectedOrg.agents_count} Agents tối đa</span>
              </div>
            </div>
          </div>
        )}
      </SlideOverDrawer>

      {/* Edit Quota Modal */}
      {editOrg && (
        <Modal
          isOpen={Boolean(editOrg)}
          onClose={() => setEditOrg(null)}
          title={`Cập nhật Quota: ${editOrg.name}`}
        >
          <form onSubmit={handleSaveQuota} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 dark:text-neutral-400 block">Gói dịch vụ Workspace</label>
              <input
                type="text"
                value={quotaPlan}
                onChange={(e) => setQuotaPlan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#181822] border border-[#2a2a38] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff7a00]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 dark:text-neutral-400 block">Số lượng AI Agents tối đa</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quotaAgents}
                onChange={(e) => setQuotaAgents(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-[#181822] border border-[#2a2a38] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff7a00]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditOrg(null)}
                className="px-3 py-1.5 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold cursor-pointer shadow-sm"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
