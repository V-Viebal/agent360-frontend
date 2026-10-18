import React, { useState, useEffect } from "react";
import { Users, Shield, Mail, Calendar, Check, X, Search, RefreshCw, ShieldCheck, ShieldAlert, Edit2 } from "lucide-react";
import { DataTable, Column } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";

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

  async function loadUsers() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
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
    const newRoleId = isAdmin ? 1 : 2; // 2 = Admin, 1 = Customer / Member
    setUpdatingId(u.id);

    try {
      const token = sessionStorage.getItem("skyer_access_token");
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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  }

  const columns: Column<UserItem>[] = [
    {
      header: "User Identity",
      accessorKey: "displayName",
      sortable: true,
      cell: (u) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {u.displayName || `${u.firstName} ${u.lastName}`.trim() || "User"}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">DB #{u.id}</div>
        </div>
      ),
    },
    {
      header: "Email Address",
      accessorKey: "email",
      sortable: true,
      cell: (u) => (
        <span className="font-mono text-[11px] text-slate-700 dark:text-neutral-300">
          {u.email || "No email"}
        </span>
      ),
    },
    {
      header: "Logto Subject (sub)",
      accessorKey: "logtoUserId",
      sortable: true,
      cell: (u) => (
        <span className="font-mono text-[11px] text-slate-500 dark:text-neutral-400">
          {u.logtoUserId}
        </span>
      ),
    },
    {
      header: "Assigned Role",
      sortable: true,
      cell: (u) => {
        const isAdmin = u.roles.some((r) => r.toUpperCase() === "ADMIN");
        return (
          <span
            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold uppercase ${
              isAdmin
                ? "bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/30"
                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            }`}
          >
            {isAdmin ? "Admin (Infra Fleet)" : "Member (Assigned)"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      sortable: false,
      className: "text-right",
      cell: (u) => {
        const isAdmin = u.roles.some((r) => r.toUpperCase() === "ADMIN");
        const isUpdating = updatingId === u.id;
        return (
          <button
            type="button"
            onClick={() => handleToggleRole(u)}
            disabled={isUpdating}
            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-[#2e2e3e] bg-white dark:bg-[#181822] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-200 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isUpdating ? "Saving..." : isAdmin ? "Demote to Member" : "Promote to Admin"}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            User Directory & Roles
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Real user accounts synchronized from Logto OIDC. Modify RBAC roles live on PostgreSQL backend.
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="p-2 rounded-xl border border-slate-200 dark:border-[#262634] bg-white dark:bg-[#161620] hover:bg-slate-100 dark:hover:bg-[#20202c] text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center gap-2 text-xs shadow-xs self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Users</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400/60 hover:text-emerald-400 text-xs cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-white dark:bg-[#14141a] border border-slate-200 dark:border-[#22222c] shadow-xs">
        <DataTable
          data={users}
          columns={columns}
          isLoading={loading}
          searchPlaceholder="Search users by name, email, or Logto subject ID..."
          emptyTitle="No users found"
          emptyDescription="Users registered via Skyer SSO will appear here."
          pageSize={10}
        />
      </div>
    </div>
  );
}
