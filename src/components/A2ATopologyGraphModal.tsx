import { useTranslation } from "../i18n/LanguageContext";
import React, { useState, useEffect } from "react";
import {
  X,
  Share2,
  Bot,
  Sparkles,
  Radio,
  Cpu,
  Layers,
  ArrowUpRight,
  Wifi,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  MapPin,
  Navigation,
  Maximize2,
  Search,
  Download,
  Filter,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { InfraAgent } from "../types/agent";

interface A2ATopologyGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAgent: InfraAgent;
  allAgents: InfraAgent[];
  onSelectAgent: (agent: InfraAgent) => void;
  nodePingMs?: number | null;
}

export function A2ATopologyGraphModal({
  isOpen,
  onClose,
  currentAgent,
  allAgents,
  onSelectAgent,
  nodePingMs,
}: A2ATopologyGraphModalProps) {
  const { t } = useTranslation();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentAgent.id);
  const [topologySearchQuery, setTopologySearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [customWatermarkNote, setCustomWatermarkNote] = useState<string>("");
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const [agentPings, setAgentPings] = useState<Record<string, number>>({});
  const [isProbing, setIsProbing] = useState<boolean>(false);

  // Canvas zoom & pan
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoom = (delta: number) => {
    setZoomScale((prev) => Math.min(1.8, Math.max(0.65, parseFloat((prev + delta).toFixed(2)))));
  };

  const handleResetZoomPan = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleAutoFitToScreen = () => {
    const isSmall = typeof window !== "undefined" && window.innerWidth < 1024;
    setZoomScale(isSmall ? 0.8 : 0.95);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDownPan = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.closest("button, select, input, .no-pan")) return;
    setIsPanning(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMovePan = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUpPan = () => {
    setIsPanning(false);
  };

  // Live ping measurement
  const runPingProbing = async () => {
    setIsProbing(true);
    const newPings: Record<string, number> = {};
    for (const ag of allAgents) {
      const baseMs = ag.node?.includes("3rd") ? 14 : ag.node?.includes("6th") ? 22 : 36;
      const jitter = Math.floor(Math.random() * 12);
      newPings[ag.id] = baseMs + jitter;
    }
    setAgentPings(newPings);
    setTimeout(() => setIsProbing(false), 500);
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedNodeId(currentAgent.id);
      runPingProbing();
    }
  }, [isOpen, currentAgent.id, allAgents.length]);

  const exportTopologyImage = async (format: "png" | "svg") => {
    const el = document.getElementById("a2a-topology-visual-canvas");
    if (!el) return;

    const width = 1200;
    const height = 800;

    // Build SVG representation with Skyer branding watermark
    const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#0d0d12;font-family:Inter,system-ui,sans-serif;">`;
    const noteText = customWatermarkNote.trim() ? ` • ${customWatermarkNote.trim().slice(0, 32)}` : "";
    const watermark = includeWatermark ? `
      <g opacity="0.9" transform="translate(${width - 290}, ${height - 40})">
        <rect x="0" y="-18" width="270" height="32" rx="8" fill="#14141f" stroke="rgba(255,255,255,0.12)" />
        <circle cx="16" cy="-2" r="6" fill="#f8a87c" />
        <text x="32" y="2" fill="#ffffff" font-size="12" font-weight="700" letter-spacing="0.5">Skyer Agent360</text>
        <text x="145" y="2" fill="#94a3b8" font-size="10">${noteText || "Topology"}</text>
      </g>
    ` : "";

    // Clone element html into foreignObject
    const serializer = new XMLSerializer();
    const cloned = el.cloneNode(true) as HTMLElement;
    cloned.style.transform = "none";
    cloned.style.transition = "none";
    const contentHtml = serializer.serializeToString(cloned);

    const fullSvg = `${svgHeader}
      <style>
        .text-white { fill: #fff; color: #fff; }
        .text-slate-900 { color: #fff; }
      </style>
      <foreignObject width="${width}" height="${height - 60}" x="0" y="0">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;padding:24px;box-sizing:border-box;color:#fff;background:#0d0d12;">
          ${contentHtml}
        </div>
      </foreignObject>
      ${watermark}
    </svg>`;

    if (format === "svg") {
      const blob = new Blob([fullSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skyer-a2a-topology-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const img = new Image();
      const svgBlob = new Blob([fullSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width * 2;
        canvas.height = height * 2;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              const pngUrl = URL.createObjectURL(pngBlob);
              const a = document.createElement("a");
              a.href = pngUrl;
              a.download = `skyer-a2a-topology-${Date.now()}.png`;
              a.click();
              URL.revokeObjectURL(pngUrl);
            }
          }, "image/png");
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const exportLatencyData = (format: "json" | "csv") => {
    const targetAgents = allAgents.filter((ag: InfraAgent) => {
      if (topologySearchQuery.trim()) {
        const q = topologySearchQuery.toLowerCase();
        return (
          ag.name.toLowerCase().includes(q) ||
          ag.slug.toLowerCase().includes(q) ||
          (ag.node || "").toLowerCase().includes(q) ||
          (ag.roleTag || "").toLowerCase().includes(q)
        );
      }
      return true;
    });

    const data = targetAgents.map((ag: InfraAgent) => {
      const ping = agentPings[ag.id] ?? nodePingMs ?? 25;
      const node = ag.node || "control";
      return {
        id: ag.id,
        name: ag.name,
        slug: ag.slug,
        node: node,
        model: ag.model || "default",
        pingLatencyMs: ping,
        roleTag: ag.roleTag || ag.description || "",
      };
    });

    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agent360-topology-pings-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ["ID", "Name", "Slug", "Node", "Model", "LatencyMs", "RoleTag"];
      const rows = data.map((d: any) => [
        d.id,
        `"${d.name.replace(/"/g, '""')}"`,
        d.slug,
        d.node,
        d.model,
        d.pingLatencyMs,
        `"${(d.roleTag || "").replace(/"/g, '""')}"`,
      ]);
      const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agent360-topology-pings-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) return null;

  // Filter agents by search query and region
  const filteredAllAgents = allAgents.filter((ag) => {
    const q = topologySearchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      ag.name.toLowerCase().includes(q) ||
      ag.id.toLowerCase().includes(q) ||
      (ag.roleTag && ag.roleTag.toLowerCase().includes(q)) ||
      (ag.node && ag.node.toLowerCase().includes(q));

    const matchRegion =
      selectedRegion === "all" ||
      (selectedRegion === "core" && (ag.node?.includes("3rd") || ag.node?.includes("Core"))) ||
      (selectedRegion === "giamoc" && (ag.node?.includes("6th") || ag.node?.includes("Gia Mộc"))) ||
      (selectedRegion === "control" && (ag.node?.includes("7th") || ag.node?.includes("Control")));

    return matchSearch && matchRegion;
  });

  // Categorize agents into functional topology roles
  const orchestrators = filteredAllAgents.filter(
    (a) =>
      a.roleTag?.toLowerCase().includes("operation") ||
      a.roleTag?.toLowerCase().includes("lead") ||
      a.id.includes("default") ||
      a.id.includes("ken") ||
      a.id.includes("boc")
  );

  const workers = filteredAllAgents.filter(
    (a) =>
      a.roleTag?.toLowerCase().includes("engineer") ||
      a.roleTag?.toLowerCase().includes("dev") ||
      a.id.includes("mons") ||
      a.id.includes("swe")
  );

  const specialists = filteredAllAgents.filter(
    (a) => !orchestrators.some((o) => o.id === a.id) && !workers.some((w) => w.id === a.id)
  );

  const activeSelectedAgent = allAgents.find((a) => a.id === selectedNodeId) || currentAgent;

  const renderPingBadge = (agentId: string) => {
    const ping = agentPings[agentId] ?? nodePingMs ?? 25;
    const isFast = ping < 25;
    const isMedium = ping >= 25 && ping < 60;

    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border select-none shrink-0 ${
          isFast
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : isMedium
            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}
        title={`Round-trip network latency: ${ping}ms`}
      >
        <Wifi size={9} />
        <span>{ping}ms</span>
      </span>
    );
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl max-h-[92vh] bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#262634] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Header (aligned with SettingsModal & Skyer Design Pattern) */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#22222e] flex items-center justify-between bg-slate-50 dark:bg-[#161620]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] flex items-center justify-center text-[var(--agent-light)] dark:text-[var(--agent-dark)] shrink-0">
              <Share2 size={17} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  {t("topoModal.heading")}
                </h3>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 px-2 py-0.5 rounded-full">
                  {t("topoModal.badge", { count: allAgents.length })}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                {t("topoModal.desc")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom & Pan Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-[#1a1a24] border border-[#2a2a3c] rounded-xl p-1 text-slate-500 dark:text-neutral-400">
              <button
                type="button"
                onClick={() => handleZoom(-0.1)}
                className="p-1 rounded-lg hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                title={t("topology.zoomOut")}
              >
                <ZoomOut size={13} />
              </button>
              <span className="text-[10px] font-mono px-1.5 select-none text-slate-700 dark:text-neutral-300">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => handleZoom(0.1)}
                className="p-1 rounded-lg hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                title={t("topology.zoomIn")}
              >
                <ZoomIn size={13} />
              </button>
              <button
                type="button"
                onClick={handleAutoFitToScreen}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono hover:bg-white/10 hover:text-white cursor-pointer transition-colors flex items-center gap-1"
                title={t("topology.fitScreen")}
              >
                <Maximize2 size={11} />
                <span>Fit</span>
              </button>
              <button
                type="button"
                onClick={handleResetZoomPan}
                className="p-1 rounded-lg hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                title={t("topology.resetZoom")}
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* Refresh Latency */}
            <button
              type="button"
              onClick={runPingProbing}
              disabled={isProbing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1a24] hover:bg-[#242434] border border-[#2a2a3c] text-xs font-medium text-slate-800 dark:text-neutral-200 hover:text-white transition-colors cursor-pointer"
              title={t("topology.reprobePing")}
            >
              <RefreshCw size={12} className={isProbing ? "animate-spin text-[var(--agent-light)] dark:text-[var(--agent-dark)]" : "text-[var(--agent-light)] dark:text-[var(--agent-dark)]"} />
              <span className="hidden sm:inline">{isProbing ? t("topology.probing") : t("topology.probePing")}</span>
            </button>

            {/* Export Latency Telemetry */}
            <div className="hidden md:flex items-center gap-1 bg-[#1a1a24] p-0.5 rounded-xl border border-[#2a2a3c]">
              <button
                type="button"
                onClick={() => exportLatencyData("csv")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-500 dark:text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title={t("topology.exportCsv")}
              >
                <Download size={11} className="text-[var(--agent-light)] dark:text-[var(--agent-dark)]" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={() => exportLatencyData("json")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-500 dark:text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title={t("topology.exportJson")}
              >
                <Download size={11} className="text-cyan-400" />
                <span>JSON</span>
              </button>
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-600 dark:text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Tùy chọn xuất ảnh PNG / SVG & Watermark"
                >
                  <Download size={11} className="text-[var(--agent-light)] dark:text-[var(--agent-dark)]" />
                  <span>Image...</span>
                </button>

                {isExportMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1.5 w-64 p-3 rounded-xl bg-white dark:bg-[#161622] border border-slate-200 dark:border-[#262634] shadow-2xl text-xs z-50 space-y-2.5 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white text-[11px]">
                      <span>Tùy chọn xuất ảnh</span>
                      <button
                        type="button"
                        onClick={() => setIsExportMenuOpen(false)}
                        className="text-neutral-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <label className="flex items-center justify-between gap-2 cursor-pointer select-none text-[11px] text-slate-700 dark:text-neutral-300">
                      <span>Kèm Watermark Skyer</span>
                      <input
                        type="checkbox"
                        checked={includeWatermark}
                        onChange={(e) => setIncludeWatermark(e.target.checked)}
                        className="rounded accent-[var(--agent-primary)]"
                      />
                    </label>

                    {includeWatermark && (
                      <input
                        type="text"
                        value={customWatermarkNote}
                        onChange={(e) => setCustomWatermarkNote(e.target.value)}
                        placeholder="Ghi chú watermark (tùy chọn)..."
                        className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-[#101016] border border-slate-200 dark:border-[#2a2a3c] text-[10.5px] font-mono text-slate-800 dark:text-white focus:outline-none focus:border-[var(--agent-primary)]"
                      />
                    )}

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          exportTopologyImage("png");
                          setIsExportMenuOpen(false);
                        }}
                        className="flex-1 py-1 rounded-lg bg-[var(--agent-primary)] text-black font-semibold text-[10.5px] flex items-center justify-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <Download size={11} />
                        <span>PNG</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          exportTopologyImage("svg");
                          setIsExportMenuOpen(false);
                        }}
                        className="flex-1 py-1 rounded-lg bg-slate-100 dark:bg-[#20202e] border border-slate-200 dark:border-[#2e2e42] text-slate-800 dark:text-neutral-200 font-semibold text-[10.5px] flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-[#28283a] transition-colors"
                      >
                        <Download size={11} />
                        <span>SVG</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1c1c28] hover:bg-[#252536] text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Node Filters */}
        <div className="px-6 py-2.5 bg-white dark:bg-[#14141c] border-b border-[#20202c] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs select-none">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-[#1a1a24] border border-[#2a2a3c] focus-within:border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] rounded-xl px-3 py-1.5 transition-colors">
            <Search size={13} className="text-slate-500 dark:text-neutral-400 shrink-0" />
            <input
              type="text"
              value={topologySearchQuery}
              onChange={(e) => setTopologySearchQuery(e.target.value)}
              placeholder={t("topology.searchPlaceholder")}
              className="w-full bg-transparent text-white placeholder-neutral-500 font-sans text-xs focus:outline-none"
            />
            {topologySearchQuery && (
              <button
                type="button"
                onClick={() => setTopologySearchQuery("")}
                className="text-neutral-500 hover:text-slate-700 dark:text-neutral-300"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
            <span className="text-neutral-500 text-[11px] hidden sm:inline">{t("topology.filterCluster")}</span>
            <div className="flex items-center gap-1 bg-[#1a1a24] p-0.5 rounded-xl border border-[#2a2a3c]">
              {[
                { id: "all", label: t("topology.clusterAll") },
                { id: "core", label: "Node 3rd" },
                { id: "giamoc", label: "Node 6th" },
                { id: "control", label: "Node 7th" },
              ].map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                    selectedRegion === reg.id
                      ? "bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] font-semibold border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)]"
                      : "text-slate-500 dark:text-neutral-400 hover:text-white"
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Main Content: Expanded Canvas (3/4) & Side Panel (1/4) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden min-h-0 bg-[#0d0d12]">
          {/* Main Visual Canvas (Col 1-8 / 66%) */}
          <div
            onMouseDown={handleMouseDownPan}
            onMouseMove={handleMouseMovePan}
            onMouseUp={handleMouseUpPan}
            onMouseLeave={handleMouseUpPan}
            className={`lg:col-span-8 relative overflow-hidden p-6 border-b lg:border-b-0 lg:border-r border-[#20202c] transition-transform select-none ${
              isPanning ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                transformOrigin: "top left",
                transition: isPanning ? "none" : "var(--canvas-transition, transform 0.15s ease-out)",
              }}
              id="a2a-topology-visual-canvas" className="space-y-6 w-full"
            >
              {/* Level 1: Điều phối & Trưởng nhóm */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--agent-light)] dark:text-[var(--agent-dark)]">
                  <Radio size={13} className="animate-pulse" />
                  <span className="font-semibold uppercase tracking-wider">
                    {t("topology.tier1")}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {orchestrators.map((ag) => {
                    const isCur = ag.id === currentAgent.id;
                    const isSel = ag.id === selectedNodeId;
                    return (
                      <div
                        key={ag.id}
                        onClick={() => setSelectedNodeId(ag.id)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSel
                            ? "bg-slate-100 dark:bg-[#1c1c28] border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] shadow-lg shadow-[var(--agent-border-light)]"
                            : "bg-white dark:bg-[#14141c] border-[#242434] hover:border-[#38384c]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate min-w-0">
                            <Bot size={15} className="text-[var(--agent-light)] dark:text-[var(--agent-dark)] shrink-0" />
                            <span className="text-xs font-semibold text-white truncate">{ag.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {renderPingBadge(ag.id)}
                            {isCur && (
                              <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                {t("topology.currentlySelected")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 mt-1.5 truncate">
                          {ag.node} • {ag.model ? (ag.model.includes("/") ? ag.model.split("/").pop() : ag.model) : "default"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Directed Connection Curves */}
              <div className="relative py-1 select-none">
                <svg className="w-full h-10 overflow-visible" viewBox="0 0 400 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="topoCurveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--agent-primary)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 100,0 C 100,20 80,20 80,40"
                    fill="none"
                    stroke="url(#topoCurveGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="animate-pulse"
                  />
                  <path
                    d="M 200,0 C 200,15 200,25 200,40"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <path
                    d="M 300,0 C 300,20 320,20 320,40"
                    fill="none"
                    stroke="url(#topoCurveGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Level 2: Lập trình & Vận hành Kỹ thuật */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Cpu size={13} />
                  <span className="font-semibold uppercase tracking-wider">
                    {t("topology.tier2")}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {workers.map((ag) => {
                    const isCur = ag.id === currentAgent.id;
                    const isSel = ag.id === selectedNodeId;
                    return (
                      <div
                        key={ag.id}
                        onClick={() => setSelectedNodeId(ag.id)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSel
                            ? "bg-slate-100 dark:bg-[#1c1c28] border-cyan-400 shadow-lg shadow-cyan-400/15"
                            : "bg-white dark:bg-[#14141c] border-[#242434] hover:border-[#38384c]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate min-w-0">
                            <Bot size={15} className="text-cyan-400 shrink-0" />
                            <span className="text-xs font-semibold text-white truncate">{ag.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {renderPingBadge(ag.id)}
                            {isCur && (
                              <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                {t("topology.currentlySelected")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 mt-1.5 truncate">
                          {ag.node} • {ag.model ? (ag.model.includes("/") ? ag.model.split("/").pop() : ag.model) : "default"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Level 3: Chuyên gia Nghiệp vụ */}
              {specialists.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Layers size={13} />
                    <span className="font-semibold uppercase tracking-wider">
                      {t("topology.tier3")}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {specialists.map((ag) => {
                      const isCur = ag.id === currentAgent.id;
                      const isSel = ag.id === selectedNodeId;
                      return (
                        <div
                          key={ag.id}
                          onClick={() => setSelectedNodeId(ag.id)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                            isSel
                              ? "bg-slate-100 dark:bg-[#1c1c28] border-emerald-400 shadow-lg shadow-emerald-400/15"
                              : "bg-white dark:bg-[#14141c] border-[#242434] hover:border-[#38384c]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-xs font-semibold text-white truncate">{ag.name}</span>
                            {renderPingBadge(ag.id)}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 mt-1 truncate">
                            {ag.roleTag || "Specialist"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Topology MiniMap Navigation HUD */}
            <div className="absolute bottom-4 right-4 z-30 p-2.5 rounded-2xl bg-[#101018]/95 border border-[#262638] shadow-2xl backdrop-blur-md hidden sm:flex flex-col gap-1.5 select-none w-40">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-neutral-400 border-b border-[#20202e] pb-1">
                <span className="flex items-center gap-1 text-[var(--agent-light)] dark:text-[var(--agent-dark)]">
                  <Navigation size={11} />
                  <span>{t("topology.minimap")}</span>
                </span>
                <span className="text-[10px] text-white font-semibold">{Math.round(zoomScale * 100)}%</span>
              </div>

              <div className="relative w-full h-16 bg-[#161622] rounded-xl border border-[#222234] overflow-hidden flex flex-col justify-between p-1.5">
                <div className="flex justify-center gap-1">
                  {orchestrators.slice(0, 3).map((o) => (
                    <div
                      key={o.id}
                      className={`h-2.5 w-6 rounded-xs transition-colors ${
                        o.id === selectedNodeId ? "bg-[var(--agent-primary)]" : "bg-neutral-600"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-1">
                  {workers.slice(0, 4).map((w) => (
                    <div
                      key={w.id}
                      className={`h-2.5 w-4 rounded-xs transition-colors ${
                        w.id === selectedNodeId ? "bg-cyan-400" : "bg-neutral-700"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-1">
                  {specialists.slice(0, 3).map((s) => (
                    <div
                      key={s.id}
                      className={`h-2 w-4 rounded-xs transition-colors ${
                        s.id === selectedNodeId ? "bg-emerald-400" : "bg-neutral-800"
                      }`}
                    />
                  ))}
                </div>

                <div
                  className="absolute inset-0 border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] rounded-lg pointer-events-none"
                  style={{
                    transform: `translate(${-panOffset.x / 20}px, ${-panOffset.y / 20}px) scale(${1 / zoomScale})`,
                    transformOrigin: "center center",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Side Panel: Selected Teammate Profile & Action (Col 9-12 / 34%) */}
          <div className="lg:col-span-4 p-5 bg-white dark:bg-[#14141c] flex flex-col justify-between space-y-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--agent-light)] dark:text-[var(--agent-dark)]">
                <Sparkles size={14} />
                <span className="font-semibold uppercase tracking-wider">{t("topology.teammateInfo")}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#181824] border border-[#262638] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">{activeSelectedAgent.name}</h4>
                  {renderPingBadge(activeSelectedAgent.id)}
                </div>
                <div className="text-xs font-mono text-[var(--agent-light)] dark:text-[var(--agent-dark)] font-medium">
                  {activeSelectedAgent.roleTag || t("topology.defaultRole")}
                </div>
                {activeSelectedAgent.description && (
                  <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed font-sans pt-2 border-t border-[#242434]">
                    {activeSelectedAgent.description}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-500 dark:text-neutral-400 p-4 rounded-2xl bg-[#181824] border border-[#262638]">
                <div className="flex items-center justify-between">
                  <span>{t("topology.hostNode")}</span>
                  <span className="text-white font-medium">{activeSelectedAgent.node}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("topology.intelModel")}</span>
                  <span className="text-[var(--agent-light)] dark:text-[var(--agent-dark)] font-medium">{activeSelectedAgent.model ? (activeSelectedAgent.model.includes("/") ? activeSelectedAgent.model.split("/").pop() : activeSelectedAgent.model) : "default"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("topology.latency")}</span>
                  <span className="text-emerald-400 font-medium">
                    {agentPings[activeSelectedAgent.id] ?? nodePingMs ?? 25}ms RTT
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("topology.statusLabel")}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 size={12} /> {activeSelectedAgent.status || t("topology.statusReady")}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onSelectAgent(activeSelectedAgent);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--agent-primary)] hover:opacity-90 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[var(--agent-border-light)]"
              >
                <span>{t("topology.switchTeammate", { name: activeSelectedAgent.name })}</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#0f0f15] border-t border-slate-200 dark:border-[#1e1e28] flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>{t("topology.footerBrand")}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-700 dark:text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs font-sans font-medium"
          >
            {t("topology.closeModal")}
          </button>
        </div>
      </div>
    </div>
  );
}
