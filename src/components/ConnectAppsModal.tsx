import { useTranslation } from "../i18n/LanguageContext";
import { authorizedFetch } from "../services/agentApi";
import { getAgentColorTheme } from "./AgentAvatar";
import { useState, useEffect } from "react";
import {
  Search,
  X,
  Shield,
  Layers,
  Check,
  Loader2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { APPS_CATALOG, resolveAppLogo, KNOWN_MCP_LOGOS, type ConnectedAppItem } from "../data/appsCatalog";

export { APPS_CATALOG, resolveAppLogo, KNOWN_MCP_LOGOS, type ConnectedAppItem };


interface ConnectAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAgentId?: string;
  targetAgentName?: string;
  initialSearchQuery?: string;
  connectedAppIds?: string[];
  onAppConnected?: (appId: string) => void;
  onAppDisconnected?: (appId: string) => void;
}

export function ConnectAppsModal({
  isOpen,
  onClose,
  targetAgentId = "default",
  targetAgentName = "Agent",
  initialSearchQuery = "",
  connectedAppIds = [],
  onAppConnected,
  onAppDisconnected,
}: ConnectAppsModalProps) {
  const agentTheme = getAgentColorTheme(targetAgentId, targetAgentName);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loadingAppId, setLoadingAppId] = useState<string | null>(null);
  const [pendingAuthAppIds, setPendingAuthAppIds] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialSearchQuery || "");
      if (initialSearchQuery) {
        setSelectedCategory("All");
      }
    }
  }, [isOpen, initialSearchQuery]);

  // Realtime WebSocket event listener for instant OAuth activation (MUST run before early return)
  useEffect(() => {
    if (!isOpen) return;

    const handleWsActivation = (event: Event) => {
      const customEv = event as CustomEvent;
      const detail = customEv.detail;
      if (detail && detail.app_slug) {
        const cleanSlug = detail.app_slug.toLowerCase();
        const cleanTargetAgent = targetAgentId.replace(/^bot:agent360:/, "").toLowerCase();
        const incomingAgent = (detail.agent_id || "").toLowerCase();

        if (incomingAgent === cleanTargetAgent || incomingAgent === "all" || !incomingAgent) {
          setPendingAuthAppIds((prev) => prev.filter((id) => id !== cleanSlug));
          onAppConnected?.(cleanSlug);
          setFeedbackMsg({
            text: `✓ WebSocket: ${detail.message || `Đã kết nối thành công ứng dụng ${cleanSlug}!`}`,
            type: "success",
          });
        }
      }
    };

    window.addEventListener("composio:connection_activated", handleWsActivation);
    return () => {
      window.removeEventListener("composio:connection_activated", handleWsActivation);
    };
  }, [isOpen, targetAgentId, onAppConnected]);

  if (!isOpen) return null;

  const categories = [
    "All",
    "Connected",
    "Password Managers",
    "Productivity",
    "Communication",
    "Code",
    "Data",
  ];

  const handleToggleApp = async (app: ConnectedAppItem) => {
    const isCurrentlyConnected = connectedAppIds.includes(app.id);
    setLoadingAppId(app.id);
    setFeedbackMsg(null);

    try {
      if (isCurrentlyConnected) {
        // Disconnect: Hot-patch DELETE from agent MCP layer
        const res = await authorizedFetch(
          `/api/mcp/composio_${app.id}`,
          {
            method: "DELETE",
            headers: {
              "X-Agent-Id": targetAgentId,
            },
          },
          targetAgentId
        );
        if (res.ok) {
          setPendingAuthAppIds((prev) => prev.filter((id) => id !== app.id));
          onAppDisconnected?.(app.id);
          setFeedbackMsg({
            text: `Đã ngắt kết nối ${app.name} khỏi ${targetAgentName}`,
            type: "success",
          });
        } else {
          throw new Error(`Failed to disconnect: status ${res.status}`);
        }
      } else {
        // Connect: Call Composio OAuth + Hot-patch into Agent MCP
        const connRes = await authorizedFetch(
          "/api/integrations/composio/connect",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              appSlug: app.id,
              action: "add",
              agentId: targetAgentId,
            }),
          },
          targetAgentId
        );

        const connData = await connRes.json();
        if (!connRes.ok) {
          throw new Error(connData.error || connData.detail || "Integration connection failed");
        }

        // Immediately reflect connection in parent state & trigger MCP refresh
        onAppConnected?.(app.id);

        const isImmediatelyActive = connData.status === "active" || !connData.redirect_url;
        if (!isImmediatelyActive && connData.redirect_url) {
          setPendingAuthAppIds((prev) => Array.from(new Set([...prev, app.id])));
          // Open OAuth consent in new tab
          window.open(connData.redirect_url, "_blank", "noopener,noreferrer");
          setFeedbackMsg({
            text: `Đã mở trang cấp quyền OAuth cho ${app.name}. Đang tự động theo dõi trạng thái xác thực...`,
            type: "success",
          });

          // Short-term auto-poll worker: checks every 3s for up to 3 minutes
          let attempts = 0;
          const maxAttempts = 60; // 60 * 3s = 180s = 3 minutes
          const pollInterval = setInterval(async () => {
            attempts++;
            if (attempts > maxAttempts) {
              clearInterval(pollInterval);
              setPendingAuthAppIds((prev) => prev.filter((id) => id !== app.id));
              return;
            }
            try {
              const statusRes = await authorizedFetch(
                `/api/integrations/composio/status?appSlug=${encodeURIComponent(app.id)}&agentIdQuery=${encodeURIComponent(targetAgentId)}`,
                {
                  headers: { "X-Agent-Id": targetAgentId },
                },
                targetAgentId
              );
              if (statusRes.ok) {
                const statusData = await statusRes.json();
                if (statusData.status === "active") {
                  clearInterval(pollInterval);
                  setPendingAuthAppIds((prev) => prev.filter((id) => id !== app.id));
                  setFeedbackMsg({
                    text: `✓ Xác thực OAuth ${app.name} hoàn tất thành công! Đã kích hoạt cho ${targetAgentName}.`,
                    type: "success",
                  });
                  onAppConnected?.(app.id);
                }
              }
            } catch (pollErr) {
              // silent poll retry
            }
          }, 3000);
        } else {
          setPendingAuthAppIds((prev) => prev.filter((id) => id !== app.id));
          setFeedbackMsg({
            text: `✓ Đã kết nối và kích hoạt ${app.name} thành công cho ${targetAgentName}!`,
            type: "success",
          });
        }
      }
    } catch (err: any) {
      console.error("[ConnectApps Error]", err);
      setFeedbackMsg({
        text: err.message || "Failed to toggle application integration",
        type: "error",
      });
    } finally {
      setLoadingAppId(null);
    }
  };

  const filteredApps = APPS_CATALOG.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isConnected = connectedAppIds.includes(app.id);
    const matchesCategory =
      selectedCategory === "All"
        ? true
        : selectedCategory === "Connected"
        ? isConnected
        : app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayCategories =
    selectedCategory === "All"
      ? (["Recommended", "Password Managers", "Productivity", "Communication", "Code", "Data"] as const)
      : selectedCategory === "Connected"
      ? (["Connected", "Recommended", "Password Managers", "Productivity", "Communication", "Code", "Data"] as const)
      : [selectedCategory as any];

  return (
    <div className="grok-modal-scope fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#121216] border border-slate-200 dark:border-[#262632] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-neutral-200 font-sans transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-3.5 sm:px-4 py-2 sm:py-2.5 border-b border-[#1f1f2a] flex items-center justify-between gap-2 shrink-0 bg-[#16161c] min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div style={{ backgroundColor: agentTheme.bgLight, borderColor: agentTheme.borderLight, color: agentTheme.light }} className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl border flex items-center justify-center shrink-0 dark:!text-[var(--agent-color)]">
              <Sparkles size={14} className="sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap min-w-0">
                <h2 className="text-xs sm:text-sm font-semibold text-white tracking-tight whitespace-normal sm:whitespace-nowrap leading-snug line-clamp-1">{t("connectApps.title")}</h2>
                <span style={{ backgroundColor: agentTheme.bgLight, color: agentTheme.light, borderColor: agentTheme.borderLight }} className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full border shrink-0 dark:!text-[var(--agent-color)]">
                  {targetAgentName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Interactive Connected Apps entry button matching reference header */}
            <button
              type="button"
              data-testid="header-connected-apps-btn"
              onClick={() => {
                setSelectedCategory("Connected");
                setSearchQuery("");
              }}
              title="Xem danh sách ứng dụng đã kết nối"
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                selectedCategory === "Connected"
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/30 shadow-xs"
                  : "bg-[#1c1c24] hover:bg-[#252532] border-slate-200 dark:border-[#262632] text-slate-700 dark:text-neutral-300 hover:text-white"
              }`}
            >
              {/* Stacked micro app logos: high-contrast dark square badge with subtle border & shadow */}
              {connectedAppIds.length > 0 ? (
                <div className="flex items-center -space-x-1 sm:-space-x-1.5 shrink-0 overflow-hidden py-0.5">
                  {connectedAppIds.slice(0, 4).map((appId) => {
                    const logo = resolveAppLogo(appId);
                    const cleanName = appId.replace(/^composio_/, "");
                    return (
                      <div
                        key={appId}
                        className="h-4 w-4 sm:h-4.5 sm:w-4.5 rounded-md bg-[#181820] border border-white/15 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs ring-1 ring-black/40"
                        title={cleanName}
                      >
                        <img
                          src={logo}
                          alt={cleanName}
                          className="h-full w-full object-contain filter drop-shadow-xs"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            if (target.parentElement) {
                              target.parentElement.className = "h-4 w-4 sm:h-4.5 sm:w-4.5 rounded-md bg-[#252532] text-neutral-300 flex items-center justify-center text-[9px] font-bold font-mono border border-white/10 shrink-0";
                              target.parentElement.textContent = cleanName.charAt(0).toUpperCase();
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Shield size={12} className="text-emerald-400 shrink-0" />
              )}
              <span className="text-[11px] sm:text-xs font-mono font-medium whitespace-nowrap">
                {connectedAppIds.length} connected
              </span>
              <ChevronRight size={12} className="text-neutral-400 shrink-0 hidden sm:inline-block" />
            </button>

            <button
              onClick={onClose}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-[#1a1a22] hover:bg-[#252530] text-slate-500 dark:text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#242430] shrink-0"
              title="Close"
            >
              <X size={14} className="sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackMsg && (
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between border-b transition-all duration-200 ${
              feedbackMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border-red-500/20 text-red-300"
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-slate-500 dark:text-neutral-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search Bar & Categories */}
        <div className="p-3 border-b border-[#1c1c26] space-y-2 shrink-0 bg-[#14141a]">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 60+ verified Composio tool integrations..."
              className="w-full bg-[#1b1b24] border border-[#282836] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[var(--agent-color)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-slate-700 dark:text-neutral-300"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-white text-black shadow-sm"
                      : "bg-[#1d1d26] text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#252532] border border-[#282834]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body: Categorized App Grid */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5 bg-[#0f0f13]">
          {displayCategories.map((category) => {
            const categoryApps = filteredApps.filter((app) => {
              if (category === "Connected") {
                return connectedAppIds.includes(app.id);
              }
              return app.category === category;
            });
            if (categoryApps.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-neutral-400 px-1">
                  <span>{category}</span>
                  <span className="text-[10px] font-mono text-neutral-500 font-normal">
                    {categoryApps.length} apps
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categoryApps.map((app) => {
                    const isConnected = connectedAppIds.includes(app.id);
                    const isPendingAuth = pendingAuthAppIds.includes(app.id);
                    const isLoading = loadingAppId === app.id;

                    return (
                      <div
                        key={app.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                          isConnected
                            ? "bg-[#18221c] border-emerald-500/30"
                            : "bg-[#16161e] border-slate-200 dark:border-[#22222e] hover:border-[#2f2f42] hover:bg-[#1a1a24]"
                        }`}
                      >
                        {/* 100% Verified SVG Vector Logo */}
                        <div className="h-9 w-9 rounded-xl bg-[#20202c] border border-[#2c2c3e] flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-sm">
                          <img
                            src={app.logoUrl}
                            alt={app.name}
                            className="h-full w-full object-contain filter drop-shadow-sm"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                              if (target.parentElement) {
                                target.parentElement.className =
                                  "h-9 w-9 rounded-xl bg-neutral-800 text-white flex items-center justify-center text-xs font-bold";
                                target.parentElement.textContent = app.name[0];
                              }
                            }}
                          />
                        </div>

                        {/* Title & Description */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white truncate block">
                              {app.name}
                            </span>
                            {isConnected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate mt-0.5 leading-snug">
                            {app.description}
                          </p>
                        </div>

                        {/* Action Button: Connect / Add */}
                        <button
                          disabled={isLoading}
                          onClick={() => handleToggleApp(app)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                            isLoading
                              ? "opacity-60 cursor-not-allowed bg-neutral-800 text-slate-500 dark:text-neutral-400"
                              : isConnected
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                              : "bg-[#252534] hover:bg-white hover:text-black text-slate-800 dark:text-neutral-200 border border-[#323246]"
                          }`}
                        >
                          {isLoading ? (
                            <Loader2 size={12} className="animate-spin text-slate-700 dark:text-neutral-300" />
                          ) : isPendingAuth ? (
                            <>
                              <Loader2 size={12} className="animate-spin text-amber-400" />
                              <span className="text-amber-300">Đang xác thực...</span>
                            </>
                          ) : isConnected ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span>{t("connectApps.connected")}</span>
                            </>
                          ) : (
                            <span>{t("connectApps.add")}</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredApps.length === 0 && (
            <div className="py-12 text-center text-xs text-neutral-500 font-mono space-y-2">
              <Layers size={22} className="mx-auto text-neutral-600 mb-1" />
              <div>No applications found matching "{searchQuery}".</div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                style={{ color: agentTheme.light }} className="hover:underline dark:!text-[var(--agent-color)]"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
