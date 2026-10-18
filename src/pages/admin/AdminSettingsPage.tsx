import React, { useState } from "react";
import { Settings, Shield, Key, Database, RefreshCw, CheckCircle2, Lock, Globe, Server, Save } from "lucide-react";
import { DataTable, Column } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Modal } from "../../components/ui/Modal";

interface ClusterConfigItem {
  id: string;
  category: "IAM" | "Storage" | "Vault" | "Fleet";
  name: string;
  endpoint: string;
  status: "Connected" | "Synced" | "Active";
  details: string;
}

export function AdminSettingsPage() {
  const [configs, setConfigs] = useState<ClusterConfigItem[]>([
    {
      id: "iam_logto",
      category: "IAM",
      name: "Logto Dedicated OIDC Engine",
      endpoint: "https://auth-skyer.hmz.one/oidc",
      status: "Connected",
      details: "Secured with Argon2i, PKCE S256 & Social OAuth 2.0 (Google, GitHub)",
    },
    {
      id: "iam_admin_portal",
      category: "IAM",
      name: "Logto Tenant Administration",
      endpoint: "https://admin-auth-skyer.hmz.one",
      status: "Active",
      details: "Management API enabled for machine-to-machine tokens & role synchronization",
    },
    {
      id: "s3_minio",
      category: "Storage",
      name: "MinIO Dedicated S3 Storage",
      endpoint: "https://s3-skyer.hmz.one",
      status: "Connected",
      details: "Bucket 'agent360-production' with presigned URLs & immutable audit snapshots",
    },
    {
      id: "vault_infisical",
      category: "Vault",
      name: "Infisical Central Secrets Vault",
      endpoint: "keys.hmz.one (agent360-x5-o0)",
      status: "Synced",
      details: "18 environment variables and API keys dynamically synchronized",
    },
    {
      id: "fleet_proxy",
      category: "Fleet",
      name: "ACP Transport & Fleet Proxy",
      endpoint: "http://agent360-a2a:8095/api/v1/a2a",
      status: "Active",
      details: "Low-latency streaming inter-agent delegation and task consensus",
    },
  ]);

  const [editItem, setEditItem] = useState<ClusterConfigItem | null>(null);
  const [editEndpoint, setEditEndpoint] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleOpenEdit = (item: ClusterConfigItem) => {
    setEditItem(item);
    setEditEndpoint(item.endpoint);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    setConfigs((prev) =>
      prev.map((c) => (c.id === editItem.id ? { ...c, endpoint: editEndpoint } : c))
    );
    setEditItem(null);
    setFeedback(`Cập nhật thông số ${editItem.name} thành công!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const columns: Column<ClusterConfigItem>[] = [
    {
      header: "Category",
      accessorKey: "category",
      sortable: true,
      className: "w-28",
      cell: (item) => (
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
          {item.category}
        </span>
      ),
    },
    {
      header: "Service Name & Details",
      accessorKey: "name",
      sortable: true,
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
          <div className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">{item.details}</div>
        </div>
      ),
    },
    {
      header: "Endpoint URI",
      accessorKey: "endpoint",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-[11px] text-slate-700 dark:text-neutral-300">
          {item.endpoint}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (item) => (
        <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{item.status}</span>
        </span>
      ),
    },
    {
      header: "Actions",
      sortable: false,
      className: "text-right",
      cell: (item) => (
        <button
          type="button"
          onClick={() => handleOpenEdit(item)}
          className="px-3 py-1 rounded-lg border border-slate-200 dark:border-[#2e2e3e] bg-white dark:bg-[#1a1a24] hover:bg-[#ff7a00]/10 hover:border-[#ff7a00]/40 text-slate-700 dark:text-neutral-200 hover:text-[#ff7a00] text-[11px] font-medium transition-all cursor-pointer shadow-xs"
        >
          Modify
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
          Platform Architecture & Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400">
          Core identity authority endpoints, S3 storage buckets, and centralized secret vault configurations.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400/60 hover:text-emerald-400 text-xs cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#14141a] border border-slate-200 dark:border-[#22222c] shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#ff7a00]/10 text-[#ff7a00]">
            <Shield size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-neutral-400">Identity Authority</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Logto OIDC (Dedicated)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#14141a] border border-slate-200 dark:border-[#22222c] shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Database size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-neutral-400">Object Storage</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">MinIO S3 Cluster</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#14141a] border border-slate-200 dark:border-[#22222c] shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Key size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-neutral-400">Security Vault</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Infisical (Keys locked)</div>
          </div>
        </div>
      </div>

      {/* Services DataTable */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#14141a] border border-slate-200 dark:border-[#22222c] shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Server size={16} className="text-[#ff7a00]" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active Infrastructure Endpoints</h2>
        </div>

        <DataTable
          data={configs}
          columns={columns}
          searchPlaceholder="Search endpoints by name, category, or url..."
          emptyTitle="No configuration records found"
          pageSize={6}
        />
      </div>

      {/* Edit Config Modal */}
      {editItem && (
        <Modal
          isOpen={Boolean(editItem)}
          onClose={() => setEditItem(null)}
          title={`Configure: ${editItem.name}`}
        >
          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-neutral-400 block mb-1">
                Endpoint URL / URI
              </label>
              <input
                type="text"
                value={editEndpoint}
                onChange={(e) => setEditEndpoint(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#181822] border border-slate-200 dark:border-[#2e2e3e] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-[#ff7a00]"
                required
              />
            </div>

            <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
              Modifying platform endpoints updates the runtime routing contract. Ensure SSL/TLS and DNS resolution are properly verified before applying changes.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#22222e]">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Save size={13} />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
