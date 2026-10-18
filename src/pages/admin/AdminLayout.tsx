import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Users,
  CreditCard,
  Building2,
  Settings,
  ChevronRight,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Server
} from "lucide-react";
import { SkyerLogo } from "../../components/SkyerLogo";

interface UserProfile {
  id: number;
  externalUserId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  roles?: Array<{ id: number; code: string; name: string }>;
  permissions?: string[];
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const token = sessionStorage.getItem("skyer_access_token");
      if (!token) {
        setLoading(false);
        setAuthorized(false);
        return;
      }

      try {
        const res = await fetch("/api/v1/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setLoading(false);
          setAuthorized(false);
          return;
        }

        const data: UserProfile = await res.json();
        setProfile(data);

        // Check if Admin role
        const isAdmin = data.roles?.some((r) =>
          ["ADMIN", "SYSTEM"].includes(r.code.toUpperCase())
        ) || data.permissions?.some((p) => p.includes("ADMIN"));

        setAuthorized(!!isAdmin);
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Agents Infra", path: "/admin/agents", icon: Bot },
    { label: "User Management", path: "/admin/users", icon: Users },
    { label: "Billings & Usage", path: "/admin/billings", icon: CreditCard },
    { label: "Organizations", path: "/admin/organizations", icon: Building2 },
    { label: "Platform Settings", path: "/admin/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ff7a00] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-neutral-400">Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl border border-red-500/20 bg-[#121216] shadow-2xl flex flex-col items-center text-center">
          <ShieldAlert className="w-16 h-16 text-rose-500 mb-4 animate-pulse" />
          <h2 className="text-xl font-bold mb-2 text-rose-400">403 - Restricted Access</h2>
          <p className="text-xs text-neutral-400 mb-6">
            The Skyer Admin Portal requires an active <strong>Admin</strong> or <strong>System Owner</strong> role.
            Your account ({profile?.email || profile?.displayName || "Member"}) does not possess the required administrative clearance.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/app", { replace: true })}
              className="px-5 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8a1a] text-xs font-semibold text-black transition-all cursor-pointer"
            >
              Back to Workspace
            </button>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all cursor-pointer"
            >
              Public Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[var(--text-primary)] flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 w-64 bg-[#111116] border-r border-[#1e1e26] z-50 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-[#1e1e26] flex items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <SkyerLogo className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                Skyer Admin
                <span className="px-1.5 py-0.2 rounded-md bg-[#ff7a00]/20 text-[#ff7a00] text-[9px] font-mono font-semibold uppercase">
                  Root
                </span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">Infra Control-Plane</span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-neutral-400 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-[#181820]"
                }`}
              >
                <Icon size={16} className={active ? "text-[#ff7a00]" : "text-neutral-400"} />
                <span>{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Info */}
        <div className="p-3 border-t border-[#1e1e26]">
          <div className="p-2.5 rounded-xl bg-[#161620] border border-[#22222e] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/30 flex items-center justify-center text-xs font-bold shrink-0">
                {profile?.displayName?.slice(0, 2).toUpperCase() || "AD"}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-white truncate">
                  {profile?.displayName || "Admin User"}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={10} />
                  <span>Admin Verified</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/app")}
              title="Return to Member Workspace"
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-[#20202c] transition-colors"
            >
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#111116] border-b border-[#1e1e26] px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-neutral-400 hover:text-white p-1.5 rounded-lg border border-[#242432]"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <Link to="/app" className="text-neutral-400 hover:text-neutral-200 transition-colors">
                Workspace
              </Link>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-200 font-semibold">Admin Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <Server size={12} />
              <span>Infra Nodes: Connected</span>
            </div>
            <button
              onClick={() => navigate("/app")}
              className="px-3.5 py-1.5 rounded-xl border border-[#2e2e3e] bg-[#1a1a24] hover:bg-[#222230] text-xs font-medium text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>User App</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
