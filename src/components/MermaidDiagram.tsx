import React, { useState } from "react";
import { GitCommit, Copy, Check, Maximize2, Minimize2, Eye, Code, Download } from "lucide-react";

interface MermaidDiagramProps {
  code: string;
}

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const [viewMode, setViewMode] = useState<"diagram" | "code">("diagram");
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [customNote, setCustomNote] = useState<string>("");
  const [isExportOptionsOpen, setIsExportOptionsOpen] = useState<boolean>(false);

  const exportDiagramImage = (format: "png" | "svg") => {
    const width = 800;
    const height = 480;
    const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#0c0c12;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">`;
    const noteStr = customNote.trim() ? ` • ${customNote.trim().slice(0, 24)}` : "";
    const watermark = includeWatermark ? `
      <g opacity="0.85" transform="translate(${width - 220}, ${height - 30})">
        <rect x="0" y="-14" width="200" height="24" rx="6" fill="#14141f" stroke="rgba(255,255,255,0.12)" />
        <circle cx="12" cy="-2" r="4" fill="#f8a87c" />
        <text x="24" y="2" fill="#ffffff" font-size="10" font-weight="700">Skyer Mermaid</text>
        <text x="112" y="2" fill="#94a3b8" font-size="9">${noteStr}</text>
      </g>
    ` : "";

    const el = document.getElementById(`mermaid-flow-canvas-${code.length}`);
    const innerHtml = el ? el.innerHTML : "";

    const fullSvg = `${svgHeader}
      <foreignObject width="${width}" height="${height - 40}" x="0" y="0">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;padding:20px;box-sizing:border-box;color:#fff;background:#0c0c12;">
          ${innerHtml}
        </div>
      </foreignObject>
      ${watermark}
    </svg>`;

    if (format === "svg") {
      const blob = new Blob([fullSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skyer-mermaid-diagram-${Date.now()}.svg`;
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
              a.download = `skyer-mermaid-diagram-${Date.now()}.png`;
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

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Lightweight visual diagram node extractor for flowcharts & sequence flows
  const parseNodesAndEdges = (raw: string) => {
    const lines = raw.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("%%") && !l.startsWith("graph") && !l.startsWith("flowchart") && !l.startsWith("sequenceDiagram"));
    const steps: { from: string; to: string; label?: string }[] = [];
    const participants = new Set<string>();

    lines.forEach((line) => {
      // Flowchart arrow: A --> B or A -- label --> B or A ->> B: label
      const flowMatch = line.match(/^([A-Za-z0-9_-]+)(?:\[.*?\])?\s*-->\|?(.*?)\|?\s*([A-Za-z0-9_-]+)(?:\[.*?\])?$/);
      if (flowMatch) {
        steps.push({ from: flowMatch[1], to: flowMatch[3], label: flowMatch[2]?.trim() });
        participants.add(flowMatch[1]);
        participants.add(flowMatch[3]);
        return;
      }
      // Sequence diagram: Alice->>Bob: Hello
      const seqMatch = line.match(/^([A-Za-z0-9_-]+)\s*->>\s*([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
      if (seqMatch) {
        steps.push({ from: seqMatch[1], to: seqMatch[2], label: seqMatch[3]?.trim() });
        participants.add(seqMatch[1]);
        participants.add(seqMatch[2]);
      }
    });

    return { steps, nodes: Array.from(participants) };
  };

  const { steps, nodes } = parseNodesAndEdges(code);

  return (
    <div
      className={`my-2.5 rounded-2xl overflow-hidden border border-[#2a2a3c] bg-[#0c0c12] font-mono text-xs shadow-xl transition-all ${
        isExpanded ? "fixed inset-4 z-50 flex flex-col bg-[#0c0c12]/95 backdrop-blur-xl border-[var(--agent-primary)]/50 p-4" : ""
      }`}
    >
      {/* Header Bar */}
      <div className="px-3.5 py-2 bg-[#14141c] border-b border-[#22222e] flex items-center justify-between text-[11px] text-neutral-400 select-none">
        <div className="flex items-center gap-2">
          <GitCommit size={14} style={{ color: "var(--agent-primary)" }} />
          <span className="font-semibold text-white">Mermaid Diagram Flow</span>
          <span className="text-[10px] text-neutral-500 font-sans">
            {nodes.length > 0 ? `${nodes.length} nodes • ${steps.length} transitions` : "Schema View"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "diagram" ? "code" : "diagram")}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1c1c28] hover:bg-[#252536] text-neutral-300 hover:text-white transition-colors cursor-pointer text-[10px]"
          >
            {viewMode === "diagram" ? <Code size={11} /> : <Eye size={11} />}
            <span>{viewMode === "diagram" ? "View Code" : "View Diagram"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Mermaid Code"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>

          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsExportOptionsOpen(!isExportOptionsOpen)}
              className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Xuất ảnh PNG / SVG & Tùy chọn Watermark"
            >
              <Download size={12} className="text-emerald-400" />
            </button>

            {isExportOptionsOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 w-56 p-2.5 rounded-xl bg-white dark:bg-[#161622] border border-slate-200 dark:border-[#262634] shadow-2xl text-xs z-50 space-y-2 select-none"
              >
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white text-[11px]">
                  <span>Xuất ảnh sơ đồ</span>
                  <button type="button" onClick={() => setIsExportOptionsOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
                </div>

                <label className="flex items-center justify-between gap-1.5 cursor-pointer text-[10.5px] text-slate-700 dark:text-neutral-300">
                  <span>Watermark Skyer</span>
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
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Ghi chú watermark..."
                    className="w-full px-2 py-0.5 rounded-md bg-slate-50 dark:bg-[#101016] border border-slate-200 dark:border-[#2a2a3c] text-[10px] font-mono text-slate-800 dark:text-white focus:outline-none focus:border-[var(--agent-primary)]"
                  />
                )}

                <div className="flex items-center gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      exportDiagramImage("png");
                      setIsExportOptionsOpen(false);
                    }}
                    className="flex-1 py-1 rounded-md bg-[var(--agent-primary)] text-black font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      exportDiagramImage("svg");
                      setIsExportOptionsOpen(false);
                    }}
                    className="flex-1 py-1 rounded-md bg-slate-100 dark:bg-[#20202e] border border-slate-200 dark:border-[#2e2e42] text-slate-800 dark:text-neutral-200 font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-[#28283a] transition-colors"
                  >
                    SVG
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? "Minimize" : "Maximize view"}
          >
            {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === "code" ? (
        <pre className="p-4 overflow-x-auto text-neutral-300 font-mono text-[11px] leading-relaxed max-h-80 overflow-y-auto">
          <code>{code}</code>
        </pre>
      ) : (
        <div className="p-4 overflow-x-auto flex-1 flex flex-col justify-center min-h-[140px] max-h-96 overflow-y-auto">
          {steps.length > 0 ? (
            <div id="mermaid-flow-canvas" className="flex flex-col gap-2.5 max-w-lg mx-auto w-full py-1">
              {steps.map((st, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#161622] border border-[#262638] text-[11px] shadow-sm animate-in fade-in"
                >
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold truncate max-w-[120px]">
                      {st.from}
                    </span>
                    <span style={{ color: "var(--agent-primary)" }} className="font-bold">➔</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold truncate max-w-[120px]">
                      {st.to}
                    </span>
                  </div>
                  {st.label && (
                    <span className="text-[10px] text-neutral-400 font-sans italic truncate max-w-[160px]">
                      {st.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-neutral-400 text-xs font-mono space-y-2">
              <div className="text-neutral-500">Flowchart Schema / Topology Structure</div>
              <pre className="p-3 rounded-xl bg-[#121218] border border-[#20202c] text-neutral-300 text-[10px] text-left max-h-48 overflow-auto">
                <code>{code}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
