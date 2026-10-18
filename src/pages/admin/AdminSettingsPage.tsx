import React, { useState } from "react";
import { Settings, Shield, Key, Database, RefreshCw, CheckCircle2, Lock, Globe, Server, Save, ExternalLink } from "lucide-react";
import { EnterpriseDataTable, Column } from "../../components/ui/EnterpriseDataTable";
import { SlideOverDrawer } from "../../components/ui/SlideOverDrawer";
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

  const [selectedConfig, setSelectedConfig] = useState<ClusterConfigItem | null>(null);
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
      header: "Phân Loại",
      accessorKey: "category",
      sortable: true,
      width: "15%",
      cell: (item) => (
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
          {item.category}
        </span>
      ),
    },
    {
      header: "Dịch Vụ & Mô Tả",
      accessorKey: "name",
      sortable: true,
      width: "35%",
      cell: (item) => (
        <div className="min-w-0">
          <div className="font-semibold text-white truncate text-xs hover:text-[#ff7a00] transition-colors">
            {item.name}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5 truncate font-mono">{item.details}</div>
        </div>
      ),
    },
    {
      header: "Endpoint URI",
      accessorKey: "endpoint",
      sortable: true,
      width: "25%",
      cell: (item) => (
        <span className="font-mono text-[11px] text-neutral-300 truncate block select-all">
          {item.endpoint}
        </span>
      ),
    },
    {
      header: "Trạng Thái",
      accessorKey: "status",
      sortable: true,
      width: "15%",
      cell: (item) => (
        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{item.status}</span>
        </span>
      ),
    },
    {
      header: "Thao Tác",
      sortable: false,
      width: "10%",
      className: "text-right",
      cell: (item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenEdit(item);
          }}
          className="px-2.5 py-1 rounded-lg border border-[#2e2e3e] bg-[#1a1a24] hover:bg-[#ff7a00]/10 hover:border-[#ff7a00]/40 text-neutral-200 hover:text-[#ff7a00] text-[10px] font-semibold transition-all cursor-pointer"
        >
          Cấu hình
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 space-y-3 font-sans">
      {/* Header Tier */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>Kiến Trúc Hạ Tầng & Cấu Hình Cụm (Platform Settings)</span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              CLUSTER LOCKED
            </span>
          </h1>
          <p className="text-[11px] text-neutral-400">
            Điểm cuối xác thực Logto OIDC, MinIO S3 cluster storage, Infisical central secrets vault và ACP agent broker.
          </p>
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

      {/* Overview Cards (App360 Exact Stat-Card Pattern) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
        <div className="p-4 rounded-2xl bg-[#14141a] border border-[#22222c] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/20 shrink-0">
            <Shield size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-neutral-400 font-mono">IAM AUTHORITY</div>
            <div className="text-sm font-bold text-white truncate mt-0.5">Logto OIDC Cluster (4th Server)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14141a] border border-[#22222c] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Database size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-neutral-400 font-mono">OBJECT STORAGE</div>
            <div className="text-sm font-bold text-white truncate mt-0.5">MinIO S3 Dedicated Cluster</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14141a] border border-[#22222c] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Key size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-neutral-400 font-mono">SECRETS VAULT</div>
            <div className="text-sm font-bold text-white truncate mt-0.5">Infisical (18 Secrets Locked)</div>
          </div>
        </div>
      </div>

      {/* Main Full-Height Power Table */}
      <EnterpriseDataTable
        data={configs}
        columns={columns}
        tableKey="admin_settings"
        searchPlaceholder="Tìm kiếm dịch vụ, category, endpoint URI..."
        emptyTitle="Chưa có cấu hình nào"
        defaultPageSize={25}
        exportFileName="agent360-cluster-settings"
        onRowClick={(item) => setSelectedConfig(item)}
        selectedItemId={selectedConfig?.id}
      />

      {/* Slide-over Config Detail Drawer */}
      <SlideOverDrawer
        isOpen={Boolean(selectedConfig)}
        onClose={() => setSelectedConfig(null)}
        title={`Cấu hình Dịch Vụ: ${selectedConfig?.name}`}
        subtitle={`Category: ${selectedConfig?.category}`}
        actions={
          selectedConfig && (
            <button
              onClick={() => handleOpenEdit(selectedConfig)}
              className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-bold text-xs cursor-pointer"
            >
              Chỉnh Sửa Endpoint
            </button>
          )
        }
      >
        {selectedConfig && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#181824] border border-[#262636] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Tên dịch vụ:</span>
                <span className="font-bold text-white font-sans">{selectedConfig.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Endpoint URL:</span>
                <span className="text-emerald-400 select-all truncate max-w-xs">{selectedConfig.endpoint}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Trạng thái kết nối:</span>
                <span className="text-emerald-400">{selectedConfig.status}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#181824] border border-[#262636] space-y-1.5 font-sans">
              <span className="text-neutral-400 block font-mono text-[10px] uppercase">Ghi chú vận hành:</span>
              <p className="text-neutral-300 text-xs leading-relaxed">{selectedConfig.details}</p>
            </div>
          </div>
        )}
      </SlideOverDrawer>

      {/* Edit Config Modal */}
      {editItem && (
        <Modal
          isOpen={Boolean(editItem)}
          onClose={() => setEditItem(null)}
          title={`Cấu hình: ${editItem.name}`}
        >
          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                Endpoint URL / URI
              </label>
              <input
                type="text"
                value={editEndpoint}
                onChange={(e) => setEditEndpoint(e.target.value)}
                className="w-full bg-[#181822] border border-[#2e2e3e] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#ff7a00]"
                required
              />
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              Việc thay đổi endpoint sẽ cập nhật hợp đồng điều hướng mạng của cụm. Đảm bảo chứng chỉ SSL/TLS và DNS đã được xác thực trước khi lưu.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#22222e]">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Save size={13} />
                <span>Lưu Cấu Hình</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
