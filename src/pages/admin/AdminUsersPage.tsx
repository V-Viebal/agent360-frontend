import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  SlidersHorizontal,
  Mail,
  UserCheck,
  Calendar
} from "lucide-react";
import { EnterpriseDataTable, Column } from "../../components/ui/EnterpriseDataTable";
import { SlideOverDrawer } from "../../components/ui/SlideOverDrawer";

interface UserItem {
  id: number;
  logtoUserId: string;
  email?: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  status: number;
  createdAt: string;
  roles: string[];
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/admin/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleToggleRole(u: UserItem) {
    const isAdmin = u.roles.some((r) => r.toUpperCase() === "ADMIN");
    const newRoleId = isAdmin ? 1 : 2; // 2 = Admin, 1 = Member
    setUpdatingId(u.id);

    try {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
      const res = await fetch(`/api/v1/admin/users/${u.id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ roleId: newRoleId }),
      });

      if (res.ok) {
        setFeedback(`Đã chuyển vai trò của ${u.displayName || u.email} thành ${isAdmin ? "Member" : "Admin"}!`);
        setTimeout(() => setFeedback(null), 3500);
        await loadUsers();
        if (selectedUser?.id === u.id) {
          setSelectedUser({
            ...u,
            roles: isAdmin ? ["MEMBER"] : ["ADMIN"],
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  }

  const getInitials = (name?: string, email?: string) => {
    const target = name || email || "User";
    const parts = target.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return target.slice(0, 2).toUpperCase();
  };

  const columns: Column<UserItem>[] = [
    {
      header: "Thành viên / Identity",
      accessorKey: "displayName",
      sortable: true,
      width: "25%",
      cell: (u) => {
        const initials = getInitials(u.displayName, u.email);
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-white truncate text-xs hover:text-[#ff7a00] transition-colors">
                {u.displayName || `${u.firstName} ${u.lastName}`.trim() || "User Skyer"}
              </div>
              <div className="text-[10px] text-neutral-500 font-mono">DB #{u.id}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Email Address",
      accessorKey: "email",
      sortable: true,
      width: "25%",
      cell: (u) => (
        <span className="font-mono text-neutral-300 truncate block text-[11px]">
          {u.email || "No email bound"}
        </span>
      ),
    },
    {
      header: "Logto Subject ID",
      accessorKey: "logtoUserId",
      sortable: true,
      width: "20%",
      cell: (u) => (
        <span className="font-mono text-neutral-500 text-[11px] truncate block select-all">
          {u.logtoUserId}
        </span>
      ),
    },
    {
      header: "Phân Quyền (RBAC)",
      sortable: true,
      width: "15%",
      cell: (u) => {
        const isAdmin = u.roles.some((r) => r.toUpperCase() === "ADMIN");
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold uppercase ${
              isAdmin
                ? "bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/30"
                : "bg-blue-500/15 text-blue-400 border border-blue-500/25"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-[#ff7a00] animate-pulse" : "bg-blue-400"}`} />
            {isAdmin ? "Admin (Root)" : "Member"}
          </span>
        );
      },
    },
    {
      header: "Thao tác",
      sortable: false,
      width: "15%",
      className: "text-right",
      cell: (u) => {
        const isAdmin = u.roles.some((r) => r.toUpperCase() === "ADMIN");
        const isUpdating = updatingId === u.id;
        return (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => handleToggleRole(u)}
              disabled={isUpdating}
              className="px-2.5 py-1 rounded-lg border border-[#2a2a38] bg-[#1a1a24] hover:bg-[#222230] text-neutral-200 hover:text-white text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? "Lưu..." : isAdmin ? "Hạ xuống Member" : "Nâng lên Admin"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 space-y-3">
      {/* Top Header Row (Compact Tier) */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>Danh Bạ & Phân Quyền Thành Viên</span>
            <span className="text-[11px] font-mono text-[#ff7a00] bg-[#ff7a00]/10 px-2 py-0.5 rounded-full border border-[#ff7a00]/20">
              {users.length} Users
            </span>
          </h1>
          <p className="text-[11px] text-neutral-400">
            Đồng bộ từ Logto OIDC Authority. Quản trị vai trò RBAC thời gian thực trên PostgreSQL Backend.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadUsers}
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
        data={users}
        columns={columns}
        isLoading={loading}
        tableKey="admin_users"
        searchPlaceholder="Tìm kiếm thành viên theo tên, email, Logto subject..."
        emptyTitle="Không tìm thấy thành viên"
        emptyDescription="Các tài khoản đăng ký qua Skyer SSO sẽ tự động đồng bộ vào đây."
        defaultPageSize={25}
        exportFileName="agent360-users-directory"
        onRowClick={(u) => setSelectedUser(u)}
        selectedItemId={selectedUser?.id}
      />

      {/* Slide-over User Detail Drawer */}
      <SlideOverDrawer
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title={`Thông tin Thành Viên: ${selectedUser?.displayName || selectedUser?.email || "User"}`}
        subtitle={`Logto Sub: ${selectedUser?.logtoUserId}`}
        actions={
          selectedUser && (
            <button
              onClick={() => handleToggleRole(selectedUser)}
              disabled={updatingId === selectedUser.id}
              className="px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-bold text-xs cursor-pointer disabled:opacity-50"
            >
              {selectedUser.roles.some((r) => r.toUpperCase() === "ADMIN")
                ? "Hạ xuống Member"
                : "Nâng lên System Admin"}
            </button>
          )
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            {/* Header Avatar Box */}
            <div className="p-4 rounded-xl bg-[#161622] border border-[#242432] flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/30 flex items-center justify-center font-bold text-base font-mono">
                {getInitials(selectedUser.displayName, selectedUser.email)}
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {selectedUser.displayName || `${selectedUser.firstName} ${selectedUser.lastName}`.trim()}
                </div>
                <div className="text-neutral-400 font-mono text-[11px]">{selectedUser.email || "No email"}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">DB Record #{selectedUser.id}</div>
              </div>
            </div>

            {/* General Info Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">Thông tin định danh</span>
              <div className="p-3.5 rounded-xl bg-[#181824] border border-[#262636] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Logto Subject (sub):</span>
                  <span className="font-mono text-white select-all">{selectedUser.logtoUserId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Vai trò hiện tại:</span>
                  <span className="font-bold text-[#ff7a00] font-mono">
                    {selectedUser.roles.join(", ") || "Member"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Trạng thái:</span>
                  <span className="text-emerald-400 font-mono">Hoạt động (Active)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Ngày tạo tài khoản:</span>
                  <span className="font-mono text-neutral-300">
                    {new Date(selectedUser.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Access Permissions Summary */}
            <div className="p-3.5 rounded-xl bg-[#181824] border border-[#262636] space-y-2 text-[11px]">
              <div className="font-semibold text-white">Quyền hạn truy cập platform:</div>
              <ul className="space-y-1 text-neutral-400 list-disc list-inside">
                <li>Truy cập Workspace và thực thi AI Agents được gán</li>
                <li>Được cấp số dư ví Token PAYG độc lập</li>
                {selectedUser.roles.some((r) => r.toUpperCase() === "ADMIN") && (
                  <li className="text-[#ff7a00] font-semibold">
                    Toàn quyền truy cập Root Admin Control-Plane, quản lý hạ tầng & thanh toán
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </SlideOverDrawer>
    </div>
  );
}
