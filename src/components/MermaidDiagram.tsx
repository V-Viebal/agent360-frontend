import React, { useState } from "react";
import { GitCommit, Copy, Check, Maximize2, Minimize2, Eye, Code } from "lucide-react";

interface MermaidDiagramProps {
  code: string;
}

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const [viewMode, setViewMode] = useState<"diagram" | "code">("diagram");
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
        isExpanded ? "fixed inset-4 z-50 flex flex-col bg-[#0c0c12]/95 backdrop-blur-xl border-[#f8a87c]/50 p-4" : ""
      }`}
    >
      {/* Header Bar */}
      <div className="px-3.5 py-2 bg-[#14141c] border-b border-[#22222e] flex items-center justify-between text-[11px] text-neutral-400 select-none">
        <div className="flex items-center gap-2">
          <GitCommit size={14} className="text-[#f8a87c]" />
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
            <div className="flex flex-col gap-2.5 max-w-lg mx-auto w-full py-1">
              {steps.map((st, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#161622] border border-[#262638] text-[11px] shadow-sm animate-in fade-in"
                >
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold truncate max-w-[120px]">
                      {st.from}
                    </span>
                    <span className="text-[#f8a87c] font-bold">➔</span>
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
