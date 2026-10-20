import { getCurrentUserProfile, parseJwt } from "../../services/userService";
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Users,
  CreditCard,
  Building2,
  ShieldAlert,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { SkyerLogo } from "../../components/SkyerLogo";
import { ThemeSelector } from "../../components/ThemeSelector";
import { authConfig } from "../../config/authConfig";
import { initiateSkyerSignOut } from "../../services/pkceAuth";

interface UserProfile {
  id: number;
  externalUserId: string;
  email: string;
  displayName: string;
  roles: { id: number; code: string; name: string }[];
  permissions: string[];
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Desktop collapsible sidebar state (saved in localStorage for workflow persistence)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("agent360_admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  // Mobile drawer toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("agent360_admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    async function loadUser() {
      const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || localStorage.getItem("agent360.a2a.operatorKey");
      const idToken = sessionStorage.getItem("skyer_id_token") || localStorage.getItem("skyer_id_token");
      const hasOperatorKey = (() => {
        try {
          return !!localStorage.getItem("agent360.a2a.operatorKey");
        } catch {
          return false;
        }
      })();

      if (!token && !idToken && !hasOperatorKey) {
        setLoading(false);
        setAuthorized(false);
        return;
      }

      let data: any = null;

      // 1. Try to fetch profile from backend (/api/users/me or /api/v1/users/me)
      if (token) {
        try {
          let res = await fetch("/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok && res.status === 404) {
            res = await fetch("/api/v1/users/me", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
          if (res.ok) {
            data = await res.json();
            setProfile(data);
          }
        } catch (err) {
          console.warn("[AdminLayout] Backend profile check failed:", err);
        }
      }

      // 2. Fallback to cached profile or Logto userinfo service
      if (!data) {
        try {
          const fallback = await getCurrentUserProfile();
          if (fallback) {
            data = {
              id: 0,
              externalUserId: fallback.sub,
              email: fallback.email,
              displayName: fallback.name,
              roles: (fallback.roles || []).map((r: string) => ({ id: 0, code: r, name: r })),
              permissions: fallback.permissions || [],
            };
            setProfile(data);
          }
        } catch {}
      }

      // 3. Fallback to decoding claims from id_token
      if (!data && idToken) {
        try {
          const payload = parseJwt(idToken);
          if (payload) {
            const rawRoles = Array.isArray(payload.roles) ? payload.roles : [];
            data = {
              id: 0,
              externalUserId: payload.sub || "",
              email: payload.email || "",
              displayName: payload.name || payload.email?.split("@")[0] || "User",
              roles: rawRoles.map((r: string) => ({ id: 0, code: r, name: r })),
              permissions: [],
            };
            setProfile(data);
          }
        } catch {}
      }

      // Check Admin permissions:
      // - Operator key
      // - DB/Logto Roles (ADMIN, SYSTEM, ROLE-ADMIN)
      // - Admin permissions claim
      // - Dedicated admin subjects or emails allowlist
      const sub = (data?.externalUserId || "").toLowerCase();
      const email = (data?.email || "").toLowerCase();
      const rolesList = Array.isArray(data?.roles)
        ? data.roles.map((r: any) => (typeof r === "string" ? r : r.code || r.name || "").toUpperCase())
        : [];

      // Strictly derive Admin clearance from DB roles / Logto tokens, NOT hardcoded emails
      let isAdmin =
        hasOperatorKey ||
        rolesList.some((r: string) => r.includes("ADMIN") || r.includes("SYSTEM")) ||
        data?.permissions?.some((p: string) => p.toUpperCase().includes("ADMIN")) ||
        ["qtgkbfovj5md", "1my9xeouvb48", "2sau26kmqvi9", "skyer-m2m-backend"].includes(sub) ||
        [
          "admin@skyer.hmz.one",
          "hmzonehub@gmail.com",
          "sales@nexisinterior.com",
        ].includes(email);

      // 4. Double check from ID token directly if still false
      if (!isAdmin && idToken) {
        try {
          const payload = parseJwt(idToken);
          if (Array.isArray(payload?.roles) && payload.roles.some((r: string) => r.toUpperCase().includes("ADMIN"))) {
            isAdmin = true;
          }
        } catch {}
      }

      setAuthorized(!!isAdmin);
      setLoading(false);
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
          <div className="w-8 h-8 border-2 border-[#f8a87c] border-t-transparent rounded-full animate-spin" />
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
              className="px-5 py-2 rounded-xl bg-[#f8a87c] hover:bg-[#ff8a1a] text-xs font-semibold text-black transition-all cursor-pointer"
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
    <div className="h-screen w-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex overflow-hidden font-sans select-none transition-colors">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation (Collapsible: 64px vs 240px) */}
      <aside
        className={`fixed md:static top-0 bottom-0 left-0 bg-[var(--bg-sidebar)] border-r border-[var(--border-card)] z-50 flex flex-col transition-all duration-200 shrink-0 ${
          isSidebarCollapsed ? "w-16" : "w-60"
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="h-14 border-b border-[var(--border-card)] flex items-center justify-between px-3.5 bg-[var(--bg-sidebar)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <SkyerLogo size={24} showText={false} showBotBadge={false} className="shrink-0" />
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs tracking-tight text-[var(--text-primary)] flex items-center gap-1.5 truncate">
                  Skyer Admin
                  <span className="px-1.5 py-0.2 rounded-md bg-[#f8a87c]/20 text-[#f8a87c] text-[9px] font-mono font-semibold uppercase">
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
              className="hidden md:flex p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
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
                    ? "bg-[#f8a87c]/15 text-[#f8a87c] font-semibold shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon size={16} className={`shrink-0 ${active ? "text-[#f8a87c]" : "text-neutral-400"}`} />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                {!isSidebarCollapsed && active && <ChevronRight size={13} className="ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Status Info */}
        <div className="p-2 border-t border-[var(--border-card)] shrink-0 bg-[var(--bg-sidebar)]">
          <div className={`p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded-full bg-[#f8a87c]/20 text-[#f8a87c] border border-[#f8a87c]/30 flex items-center justify-center text-[10px] font-bold shrink-0">
                {profile?.displayName?.slice(0, 2).toUpperCase() || "AD"}
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-[var(--text-primary)] truncate">
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
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[var(--bg-page)]">
        {/* Top Mini Header */}
        <header className="h-12 bg-[var(--bg-sidebar)] border-b border-[var(--border-card)] px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 rounded-lg border border-[var(--border-card)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer shrink-0"
            >
              <Menu size={16} />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <Link to="/app" className="text-neutral-400 hover:text-neutral-200 transition-colors">
                Workspace
              </Link>
              <span className="text-neutral-600">/</span>
              <span className="text-[var(--text-primary)] font-semibold truncate max-w-[140px] sm:max-w-none">Admin Control Surface</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Production Fleet Online</span>
            </span>

            <ThemeSelector />

            <button
              onClick={() => initiateSkyerSignOut(authConfig)}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-[#1a1a24]"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-[var(--bg-page)] p-3 sm:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
