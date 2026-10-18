import React, { useState, useEffect } from "react";
import { Users, Shield, Mail, Calendar, Check, X, Search, RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react";

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
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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
        await loadUsers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = users.filter(
    (u) =>
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.displayName && u.displayName.toLowerCase().includes(search.toLowerCase())) ||
      u.logtoUserId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">User Directory & Roles</h1>
          <p className="text-xs text-neutral-400">
            Real user accounts synchronized from Logto OIDC. Modify RBAC roles live on PostgreSQL backend.
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="p-2 rounded-xl border border-[#262634] bg-[#161620] hover:bg-[#20202c] text-neutral-300 transition-colors cursor-pointer flex items-center gap-2 text-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Users</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#ff7a00]" />
            <h2 className="text-sm font-semibold text-white">Registered Users ({users.length})</h2>
          </div>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#181822] border border-[#262634] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#ff7a00]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-neutral-500">Loading live user accounts...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#22222e] text-[11px] text-neutral-500 uppercase tracking-wider font-mono">
                <tr>
                  <th className="pb-3 pl-2">User ID & Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Logto Subject (sub)</th>
                  <th className="pb-3">Assigned Role</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e28]">
                {filtered.map((u) => {
                  const isAdmin = u.roles.some((r) => r.toUpperCase() === "ADMIN");
                  const isUpdating = updatingId === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-[#181822]/60 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="font-semibold text-white">
                          {u.displayName || `${u.firstName} ${u.lastName}`.trim() || "User"}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">DB #{u.id}</div>
                      </td>
                      <td className="py-3 text-neutral-300 font-mono text-[11px]">
                        {u.email || "No email"}
                      </td>
                      <td className="py-3 text-neutral-400 font-mono text-[11px]">
                        {u.logtoUserId}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold uppercase ${
                            isAdmin
                              ? "bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {isAdmin ? "Admin (Infra Fleet)" : "Member (Assigned)"}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          onClick={() => handleToggleRole(u)}
                          disabled={isUpdating}
                          className="px-2.5 py-1 rounded-lg border border-[#2e2e3e] hover:bg-white/10 text-neutral-200 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isUpdating ? "Saving..." : isAdmin ? "Demote to Member" : "Promote to Admin"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
