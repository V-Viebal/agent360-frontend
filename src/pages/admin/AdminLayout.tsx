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
  ShieldAlert,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Server,
  PanelLeftClose,
  PanelLeftOpen
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("skyer_admin_sidebar_collapsed") === "true";
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("skyer_admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  useEffect(() => {
    async function loadUser() {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
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

        // Check if Admin role (via backend DB roles, permissions, or Logto ID token)
        let isAdmin = data.roles?.some((r) =>
          ["ADMIN", "SYSTEM", "ROLE-ADMIN"].includes(r.code.toUpperCase()) ||
          ["ADMIN", "SYSTEM", "ROLE-ADMIN"].includes(r.name.toUpperCase())
        ) || data.permissions?.some((p) => p.toUpperCase().includes("ADMIN"))
        || data.externalUserId === "qtgkbfovj5md"
        || data.externalUserId === "1my9xeouvb48"
        || data.externalUserId === "5izm01e7flyj"
        || data.externalUserId === "2sau26kmqvi9"
        || data.email === "admin@skyer.hmz.one"
        || data.email === "hmzonehub@gmail.com"
        || data.email === "mk.zeromind@gmail.com"
        || data.email === "sales@nexisinterior.com";

        if (!isAdmin) {
          try {
            const idToken = sessionStorage.getItem("skyer_id_token") || localStorage.getItem("skyer_id_token");
            if (idToken) {
              const payload = JSON.parse(decodeURIComponent(atob(idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
              if (Array.isArray(payload.roles) && payload.roles.some((r: string) => r.toUpperCase().includes("ADMIN"))) {
                isAdmin = true;
              }
            }
          } catch {}
        }

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
    { label: "Agents Fleet", path: "/admin/agents", icon: Bot },
    { label: "User Directory", path: "/admin/users", icon: Users },
    { label: "Billing & PAYG", path: "/admin/billings", icon: CreditCard },
    { label: "Organizations", path: "/admin/organizations", icon: Building2 },
    { label: "Security Audit", path: "/admin/audit", icon: ShieldAlert },
    { label: "Platform Settings", path: "/admin/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0c0c0e] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ff7a00] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-neutral-400">Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="h-screen w-screen bg-[#0c0c0e] text-white flex items-center justify-center p-4 font-sans">
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
    <div className="h-screen w-screen bg-[#0c0c0e] text-neutral-200 flex overflow-hidden font-sans select-none">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation (Collapsible: 64px vs 240px) */}
      <aside
        className={`fixed md:static top-0 bottom-0 left-0 bg-[#111116] border-r border-[#1e1e26] z-50 flex flex-col transition-all duration-200 shrink-0 ${
          isSidebarCollapsed ? "w-16" : "w-60"
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="h-14 border-b border-[#1e1e26] flex items-center justify-between px-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <SkyerLogo className="w-6 h-6 shrink-0" />
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs tracking-tight text-white flex items-center gap-1.5 truncate">
                  Skyer Admin
                  <span className="px-1.5 py-0.2 rounded-md bg-[#ff7a00]/20 text-[#ff7a00] text-[9px] font-mono font-semibold uppercase">
                    Root
                  </span>
                </span>
                <span className="text-[9px] text-neutral-500 font-mono truncate">Control-Plane</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Collapse Toggle Button (Desktop) */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden md:flex p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a1a24] transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar (Tối đa không gian)"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-neutral-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-[#181820]"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon size={16} className={`shrink-0 ${active ? "text-[#ff7a00]" : "text-neutral-400"}`} />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                {!isSidebarCollapsed && active && <ChevronRight size={13} className="ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Status Info */}
        <div className="p-2 border-t border-[#1e1e26] shrink-0">
          <div className={`p-2 rounded-xl bg-[#161620] border border-[#22222e] flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/30 flex items-center justify-center text-[10px] font-bold shrink-0">
                {profile?.displayName?.slice(0, 2).toUpperCase() || "AD"}
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-white truncate">
                    {profile?.displayName || "Admin User"}
                  </div>
                  <div className="text-[9px] text-emerald-400 flex items-center gap-1 font-mono">
                    <ShieldCheck size={9} />
                    <span>Verified</span>
                  </div>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button
                onClick={() => navigate("/app")}
                title="Quay lại Member Workspace"
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-[#20202c] transition-colors cursor-pointer"
              >
                <ExternalLink size={13} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Viewport (Zero-Waste Full Viewport Flex Column) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#0a0a0d]">
        {/* Top Mini Header */}
        <header className="h-12 bg-[#111116] border-b border-[#1e1e26] px-4 sm:px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-neutral-400 hover:text-white p-1.5 rounded-lg border border-[#242432]"
            >
              <Menu size={16} />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <Link to="/app" className="text-neutral-400 hover:text-neutral-200 transition-colors">
                Workspace
              </Link>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-200 font-semibold">Admin Control Surface</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fleet: 5 Nodes Online</span>
            </div>
            <button
              onClick={() => navigate("/app")}
              className="px-3 py-1 rounded-lg border border-[#2e2e3e] bg-[#1a1a24] hover:bg-[#222230] text-xs font-medium text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>User App</span>
              <ExternalLink size={11} />
            </button>
          </div>
        </header>

        {/* Page Content: Full-Height Flex-1, Zero External Scroll */}
        <main className="flex-1 overflow-hidden p-3 sm:p-5 flex flex-col min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
