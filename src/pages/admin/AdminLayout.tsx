import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Users,
  CreditCard,
  Building2,
  Settings,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Server,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Activity,
  Shield
} from "lucide-react";
import { SkyerLogo } from "../../components/SkyerLogo";
import { getCurrentUserProfile, parseJwt } from "../../services/userService";
import { getStoredToken } from "../../services/authFetch";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSection } from "../../components/ui/DropdownMenu";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { initiateSkyerSignOut } from "../../services/pkceAuth";
import { authConfig } from "../../config/authConfig";

interface UserProfile {
  id?: number;
  externalUserId?: string;
  sub?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  name?: string;
  picture?: string;
  avatarUrl?: string;
  roles?: Array<{ id?: number; code?: string; name?: string } | string>;
  permissions?: string[];
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Responsive & Collapsible Sidebar State (identical contract to App Workspace)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("skyer_admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const toggleSidebarCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem("skyer_admin_sidebar_collapsed", String(collapsed));
    } catch {}
  };

  useEffect(() => {
    async function loadUser() {
      const token = getStoredToken("skyer_access_token");
      const idToken = getStoredToken("skyer_id_token");

      if (!token && !idToken) {
        setLoading(false);
        setAuthorized(false);
        return;
      }

      let data: UserProfile | null = null;

      // 1. Fetch live profile & RBAC authority from backend
      if (token) {
        try {
          const res = await fetch("/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            data = await res.json();
            setProfile(data);
          }
        } catch (err) {
          console.warn("[AdminLayout] Failed to fetch /api/users/me:", err);
        }
      }

      // 2. Fallback to cached profile or Logto userinfo if backend call is pending/unavailable
      if (!data) {
        try {
          const fallback = await getCurrentUserProfile();
          if (fallback) {
            data = {
              externalUserId: fallback.sub,
              sub: fallback.sub,
              email: fallback.email,
              displayName: fallback.name,
              name: fallback.name,
              picture: fallback.picture,
              roles: fallback.roles,
              permissions: fallback.permissions,
            };
            setProfile(data);
          }
        } catch {}
      }

      // 3. Fallback to decoding claims directly from id_token or access_token
      if (!data && idToken) {
        try {
          const claims = parseJwt(idToken);
          if (claims) {
            data = {
              externalUserId: claims.sub,
              sub: claims.sub,
              email: claims.email,
              displayName: claims.name || claims.email?.split("@")[0],
              name: claims.name || claims.email?.split("@")[0],
              picture: claims.picture,
              roles: Array.isArray(claims.roles) ? claims.roles : [],
            };
            setProfile(data);
          }
        } catch {}
      }

      // Normalize roles
      const rawRoles = data?.roles || [];
      const roleStrings = rawRoles.map((r) => {
        if (typeof r === "string") return r.toUpperCase();
        return (r.code || r.name || "").toUpperCase();
      });

      const sub = data?.externalUserId || data?.sub || "";
      const email = (data?.email || "").toLowerCase();

      const hasOperatorKey = (() => {
        try {
          return !!localStorage.getItem("agent360.a2a.operatorKey");
        } catch {
          return false;
        }
      })();

      let isAdmin =
        hasOperatorKey ||
        roleStrings.some((r) => r.includes("ADMIN") || r.includes("SYSTEM")) ||
        data?.permissions?.some((p) => p.toUpperCase().includes("ADMIN")) ||
        [
          "qtgkbfovj5md",
          "1my9xeouvb48",
          "5izm01e7flyj",
          "2sau26kmqvi9",
          "skyer-m2m-backend"
        ].includes(sub) ||
        [
          "admin@skyer.hmz.one",
          "hmzonehub@gmail.com",
          "mk.zeromind@gmail.com",
          "sales@nexisinterior.com"
        ].includes(email);

      // Double-check ID token if still not matched
      if (!isAdmin && idToken) {
        try {
          const idClaims = parseJwt(idToken);
          if (Array.isArray(idClaims?.roles) && idClaims.roles.some((r: string) => r.toUpperCase().includes("ADMIN"))) {
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
    { label: "Agents Infra", path: "/admin/agents", icon: Bot },
    { label: "User Management", path: "/admin/users", icon: Users },
    { label: "Billings & Usage", path: "/admin/billings", icon: CreditCard },
    { label: "Organizations", path: "/admin/organizations", icon: Building2 },
    { label: "Security Audit", path: "/admin/audit", icon: ShieldAlert },
    { label: "Platform Settings", path: "/admin/settings", icon: Settings },
  ];

  const cleanDisplayName = (() => {
    if (profile?.displayName && profile.displayName !== "User Skyer" && profile.displayName !== "User") {
      return profile.displayName;
    }
    if (profile?.firstName || profile?.lastName) {
      const full = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
      if (full) return full;
    }
    if (profile?.name && profile.name !== "User Skyer" && profile.name !== "User") {
      return profile.name;
    }
    if (profile?.email) {
      return profile.email.split("@")[0];
    }
    return "Admin User";
  })();

  const cleanDisplayEmail = profile?.email || "admin@skyer.hmz.one";

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
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)] font-sans select-none antialiased relative transition-colors">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden"
        />
      )}

      {/* Sidebar Navigation matching App Workspace structure */}
      <aside
        style={{ width: isCollapsed ? "64px" : "264px" }}
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-40 h-full flex flex-col border-r border-neutral-200 dark:border-[#1e1e24] bg-[var(--bg-sidebar)] shrink-0 transition-all duration-200 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {isCollapsed ? (
          /* ========================================================= */
          /* COLLAPSED VIEW: Minimal Rail (Matches App Rail Mode)     */
          /* ========================================================= */
          <>
            {/* Collapsed Header: Icon with hover reveal PanelLeftOpen */}
            <div className="h-12 border-b border-neutral-200 dark:border-[#1c1c22] flex items-center justify-center shrink-0 bg-[var(--bg-sidebar)]">
              <button
                type="button"
                onClick={() => toggleSidebarCollapse(false)}
                className="relative h-9 w-9 rounded-xl flex items-center justify-center hover:bg-[#1f1f2c] text-neutral-400 hover:text-white transition-all cursor-pointer group"
                title="Bấm để mở rộng Sidebar (Ctrl+B)"
                aria-label="Expand Admin Sidebar"
              >
                <div className="transition-all duration-200 group-hover:opacity-0 group-hover:scale-75">
                  <SkyerLogo size={24} showText={false} showBotBadge={false} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 text-[#ff7a00]">
                  <PanelLeftOpen size={18} />
                </div>
              </button>
            </div>

            {/* Quick Switch to App Workspace */}
            <div className="p-2 border-b border-neutral-200 dark:border-[#1c1c22] flex justify-center">
              <Link
                to="/app"
                title="Quay lại Member Workspace (/app)"
                className="relative h-10 w-10 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shrink-0 group"
              >
                <Bot size={18} className="group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Collapsed Nav Icons */}
            <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-1.5 flex flex-col items-center scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={item.label}
                    className={`relative h-10 w-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                      active
                        ? "bg-[#ff7a00]/15 text-[#ff7a00] border-[#ff7a00]/40 shadow-xs shadow-[#ff7a00]/20"
                        : "border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-[#161620] hover:border-[#2a2a38]"
                    }`}
                  >
                    <Icon size={18} />
                    {active && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#ff7a00] ring-1 ring-black" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Collapsed Bottom Profile Bar */}
            <div ref={userMenuRef} className="p-2 border-t border-neutral-200 dark:border-[#1c1c22] flex flex-col items-center relative select-none shrink-0">
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-8 w-8 rounded-full bg-[#2a2a34] text-[#ff7a00] border border-[#3a3a4c] hover:border-[#ff7a00] flex items-center justify-center text-xs font-semibold shadow-xs cursor-pointer transition-colors relative overflow-hidden"
                title={`${cleanDisplayName} (${cleanDisplayEmail})`}
              >
                {profile?.picture ? (
                  <img src={profile.picture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  cleanDisplayName.slice(0, 2).toUpperCase()
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-[#0c0c0e]" />
              </div>

              {/* User Dropdown */}
              <DropdownMenu
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
                anchorRef={userMenuRef}
                align="left"
                placement="top"
                width="w-64"
              >
                <div className="px-2.5 py-1.5 border-b border-[#22222e] mb-1">
                  <div className="text-xs font-semibold text-white">{cleanDisplayName}</div>
                  <div className="text-[10px] font-mono text-neutral-400">{cleanDisplayEmail}</div>
                </div>
                <DropdownMenuItem
                  icon={<Bot size={14} className="text-[#ff7a00]" />}
                  label="Vào App Workspace"
                  badge="/app"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate("/app");
                  }}
                />
                <DropdownMenuSection label="Tài khoản & Phiên">
                  <DropdownMenuItem
                    icon={<LogOut size={13} className="text-rose-400" />}
                    label="Đăng xuất"
                    variant="danger"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsSignOutConfirmOpen(true);
                    }}
                  />
                </DropdownMenuSection>
              </DropdownMenu>
            </div>
          </>
        ) : (
          /* ========================================================= */
          /* EXPANDED VIEW: Full Brand Header, Nav Items & Profile    */
          /* ========================================================= */
          <>
            {/* Header: Logo, Clean Wordmark & Collapse Button */}
            <div className="px-3 py-2.5 border-b border-neutral-200 dark:border-[#1c1c22] flex items-center justify-between shrink-0 bg-[var(--bg-sidebar)]">
              <Link
                to="/"
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                title="Return to Skyer Home"
              >
                <SkyerLogo size={24} showText={false} showBotBadge={false} />
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-white font-sans">
                    Skyer Admin
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-[#ff7a00]/20 text-[#ff7a00] text-[9px] font-mono font-semibold uppercase">
                    Root
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-1">
                {/* Desktop Collapse Trigger */}
                <button
                  type="button"
                  aria-label="Collapse Admin Sidebar"
                  onClick={() => toggleSidebarCollapse(true)}
                  className="hidden md:flex h-7 w-7 rounded-lg bg-[#181820] hover:bg-[#22222e] border border-[#242430] items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Collapse Sidebar"
                >
                  <PanelLeftClose size={14} />
                </button>
                {/* Mobile Drawer Close */}
                <button
                  type="button"
                  aria-label="Close drawer"
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden h-7 w-7 rounded-lg bg-[#181820] border border-[#242430] flex items-center justify-center text-neutral-400 hover:text-white shrink-0"
                  title="Close drawer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Quick Switch to Member Workspace */}
            <div className="p-2 border-b border-neutral-200 dark:border-[#1c1c22]">
              <Link
                to="/app"
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all group cursor-pointer select-none"
                title="Quay lại Member Workspace (/app)"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-[#ff7a00]/15 border border-[#ff7a00]/30 flex items-center justify-center text-[#ff7a00] shrink-0">
                    <Bot size={14} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col truncate text-left">
                    <span className="text-xs font-semibold text-white group-hover:text-[#ff7a00] transition-colors flex items-center gap-1.5">
                      User App
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono truncate">
                      Vào Member Workspace (/app)
                    </span>
                  </div>
                </div>
                <ExternalLink size={13} className="text-neutral-500 group-hover:text-white shrink-0 ml-1" />
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              <div className="px-2 pt-1 pb-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Administration
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold border border-[#ff7a00]/30"
                        : "text-neutral-400 hover:text-neutral-200 hover:bg-[#181820] border border-transparent"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-[#ff7a00]" : "text-neutral-400"} />
                    <span>{item.label}</span>
                    {active && <ChevronRight size={14} className="ml-auto opacity-70" />}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Profile Bar with User Dropdown (Identical to App Workspace) */}
            <div ref={userMenuRef} className="p-3 border-t border-neutral-200 dark:border-[#1c1c22] relative select-none">
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-between text-xs cursor-pointer hover:bg-[#161620] -m-1.5 p-1.5 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-full bg-[#2a2a34] text-[#ff7a00] border border-[#3a3a4c] flex items-center justify-center text-xs font-semibold shadow-xs shrink-0 overflow-hidden">
                    {profile?.picture ? (
                      <img src={profile.picture} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      cleanDisplayName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs text-neutral-200 font-medium truncate">{cleanDisplayName}</span>
                    <span className="text-[10px] font-mono text-neutral-500 truncate">{cleanDisplayEmail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Admin</span>
                  </div>
                  <ChevronDown
                    size={12}
                    className={`text-neutral-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </div>

              {/* User Profile Dropdown Menu in Expanded State */}
              <DropdownMenu
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
                anchorRef={userMenuRef}
                align="left"
                placement="top"
                width="w-72"
              >
                <div className="px-2.5 py-1.5 border-b border-[#22222e] mb-1">
                  <div className="text-xs font-semibold text-white">{cleanDisplayName}</div>
                  <div className="text-[10px] font-mono text-neutral-400">{cleanDisplayEmail}</div>
                </div>
                <DropdownMenuItem
                  icon={<Bot size={14} className="text-[#ff7a00]" />}
                  label="Vào App Workspace"
                  badge="/app"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate("/app");
                  }}
                />
                <DropdownMenuSection label="Hệ thống">
                  <DropdownMenuItem
                    icon={<Activity size={13} className="text-emerald-400" />}
                    label="Infra Nodes Telemetry"
                    badge="Connected"
                    badgeColor="text-emerald-400"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/admin/agents");
                    }}
                  />
                  <DropdownMenuItem
                    icon={<ExternalLink size={13} className="text-neutral-400" />}
                    label="Community Forum"
                    badge="↗"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      window.open("https://community-agent360.antares.vn", "_blank");
                    }}
                  />
                </DropdownMenuSection>
                <DropdownMenuSection label="Tài khoản & Phiên">
                  <DropdownMenuItem
                    icon={<LogOut size={13} className="text-rose-400" />}
                    label="Đăng xuất"
                    variant="danger"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsSignOutConfirmOpen(true);
                    }}
                  />
                </DropdownMenuSection>
              </DropdownMenu>
            </div>
          </>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-12 bg-[#111116] border-b border-[#1e1e26] px-4 md:px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-neutral-400 hover:text-white p-1 rounded-lg border border-[#242432]"
              aria-label="Open sidebar"
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
            <Link
              to="/app"
              className="px-3 py-1 rounded-xl border border-[#2e2e3e] bg-[#1a1a24] hover:bg-[#222230] text-xs font-medium text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>User App</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Sign Out Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isSignOutConfirmOpen}
        onClose={() => setIsSignOutConfirmOpen(false)}
        onConfirm={() => {
          setIsSignOutConfirmOpen(false);
          initiateSkyerSignOut(authConfig);
        }}
        title="Đăng xuất khỏi phiên làm việc"
        description={
          <div className="space-y-1.5">
            <p>
              Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc{" "}
              <strong>{cleanDisplayName}</strong> không?
            </p>
            <p className="text-xs text-neutral-400">
              Mọi quyền quản trị và token truy cập cục bộ sẽ được thu hồi an toàn.
            </p>
          </div>
        }
        confirmText="Đăng xuất"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}
