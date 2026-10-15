import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  Code2,
  Terminal,
  Shield,
  Layers,
  Users,
  Cpu,
  Database,
  Radio,
  CheckCircle2,
  GitBranch,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { DOCS_SECTIONS, DocSection } from "../data/docsContent";
import { AgentTopologyVisualizer } from "../components/AgentTopologyVisualizer";

export function DocsPage() {
  const [selectedDocId, setSelectedDocId] = useState<string>("quickstart");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"code" | "sandbox">("code");

  // Group sections by Category
  const categories = useMemo(() => {
    const map = new Map<string, DocSection[]>();
    DOCS_SECTIONS.forEach((doc) => {
      const list = map.get(doc.category) || [];
      list.push(doc);
      map.set(doc.category, list);
    });
    return Array.from(map.entries());
  }, []);

  // Filtered docs based on search
  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return DOCS_SECTIONS;
    const q = searchQuery.toLowerCase();
    return DOCS_SECTIONS.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeDoc = useMemo(() => {
    return DOCS_SECTIONS.find((d) => d.id === selectedDocId) || DOCS_SECTIONS[0];
  }, [selectedDocId]);

  const handleRunSandbox = () => {
    if (!activeDoc.sandboxOutput) return;
    setIsSandboxRunning(true);
    setSandboxLogs([]);
    setActiveTab("sandbox");

    let current = 0;
    const interval = setInterval(() => {
      if (current < activeDoc.sandboxOutput!.length) {
        setSandboxLogs((prev) => [...prev, activeDoc.sandboxOutput![current]]);
        current++;
      } else {
        clearInterval(interval);
        setIsSandboxRunning(false);
      }
    }, 450);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="pt-20 min-h-screen bg-[#07090e] text-[#f0f2f5] flex flex-col font-sans">
      {/* Top Banner */}
      <div className="border-b border-white/[0.08] bg-white/[0.02] px-4 py-3">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <Link to="/landing" className="hover:text-white transition-colors">Agent360</Link>
            <ChevronRight size={12} />
            <span className="text-white font-medium">Documentation</span>
            <ChevronRight size={12} />
            <span className="text-[#ff7a00]">{activeDoc.title}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://qwenpaw.agentscope.io/docs/intro"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <span>QwenPaw Specs</span>
              <ExternalLink size={12} />
            </a>
            <span className="text-neutral-600">•</span>
            <a
              href="https://docs.ai-teammates.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <span>AI Teammates Architecture</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Navigation (AI Teammates Docs Style) */}
        <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
          {/* Search Bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d111a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff7a00]/50"
            />
          </div>

          {/* Navigation Category Tree */}
          <div className="space-y-5">
            {categories.map(([category, docs]) => {
              const visibleDocs = docs.filter((d) => filteredDocs.some((fd) => fd.id === d.id));
              if (visibleDocs.length === 0) return null;

              return (
                <div key={category} className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold px-2">
                    {category}
                  </div>
                  <div className="space-y-0.5">
                    {visibleDocs.map((doc) => {
                      const isSelected = doc.id === activeDoc.id;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => {
                            setSelectedDocId(doc.id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold border border-[#ff7a00]/30"
                              : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="truncate">{doc.title}</span>
                          {doc.badge && (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                                isSelected
                                  ? "bg-[#ff7a00] text-black font-semibold"
                                  : "bg-white/10 text-neutral-400"
                              }`}
                            >
                              {doc.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="rounded-xl border border-white/10 bg-[#0d111a] p-4 text-xs space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#ff7a00]" />
              <span>Need custom agents?</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Explore pre-built enterprise agent templates ready to deploy on private infra.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#ff7a00] hover:underline pt-1"
            >
              Browse Marketplace <ArrowRight size={11} />
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 rounded-2xl border border-white/10 bg-[#0d111a] p-6 sm:p-10 shadow-xl space-y-8">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 py-0.5 rounded-md border border-[#ff7a00]/20">
                {activeDoc.category}
              </span>
              {activeDoc.badge && (
                <span className="text-[11px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neutral-300">
                  {activeDoc.badge}
                </span>
              )}
            </div>
            <h1 className="font-newsreader text-3xl sm:text-5xl font-semibold text-white tracking-tight">
              {activeDoc.title}
            </h1>
            <p className="mt-3 text-base text-neutral-400 leading-relaxed max-w-3xl font-sans">
              {activeDoc.summary}
            </p>
          </div>

          {/* Key Takeaways Box */}
          <div className="rounded-xl border border-[#ff7a00]/25 bg-[#ff7a00]/5 p-5 space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-[#ff7a00] font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Key Architectural Guarantees</span>
            </div>
            <ul className="space-y-1.5 text-xs text-neutral-300 font-sans">
              {activeDoc.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#ff7a00]">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Markdown-style Prose Content */}
          <div className="prose prose-invert max-w-none text-neutral-300 text-sm leading-relaxed space-y-4">
            {activeDoc.content.split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-xl font-semibold text-white mt-6 mb-2 border-b border-white/5 pb-2">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("#### ")) {
                return (
                  <h4 key={idx} className="text-base font-semibold text-neutral-200 mt-4 mb-2">
                    {paragraph.replace("#### ", "")}
                  </h4>
                );
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <ul key={idx} className="space-y-2 my-3 pl-4 list-disc text-neutral-300">
                    {paragraph.split("\n").map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {item.replace("- ", "")}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-neutral-300 leading-relaxed font-sans">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Topology Visualizer for Orchestration / Concepts */}
          {(activeDoc.id === "ai-teammates" || activeDoc.id === "core-concepts") && (
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#ff7a00] font-semibold flex items-center gap-1.5">
                <GitBranch size={14} />
                <span>Supervision Tree Architecture</span>
              </div>
              <AgentTopologyVisualizer />
            </div>
          )}

          {/* Interactive Code & Live Sandbox Execution Area */}
          <div className="rounded-xl border border-white/10 bg-[#04060a] overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-xs font-mono">
              {/* Tab Switcher */}
              <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
                {activeDoc.codeSnippet && (
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "code"
                        ? "bg-[#ff7a00] text-black font-semibold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Code2 size={12} />
                    <span>example.{activeDoc.codeSnippet.language}</span>
                  </button>
                )}
                {activeDoc.sandboxOutput && (
                  <button
                    onClick={() => setActiveTab("sandbox")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "sandbox"
                        ? "bg-[#ff7a00] text-black font-semibold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Terminal size={12} />
                    <span>Try in Sandbox</span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {activeDoc.sandboxPrompt && (
                  <button
                    onClick={handleRunSandbox}
                    disabled={isSandboxRunning}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play size={11} className={isSandboxRunning ? "animate-spin" : ""} />
                    <span>{isSandboxRunning ? "Executing..." : "Run in Sandbox"}</span>
                  </button>
                )}
                {activeDoc.codeSnippet && activeTab === "code" && (
                  <button
                    onClick={() => handleCopyCode(activeDoc.codeSnippet!.code)}
                    className="hover:text-white text-neutral-400 transition-colors flex items-center gap-1 cursor-pointer text-xs"
                  >
                    {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedCode ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Tab View */}
            {activeTab === "code" && activeDoc.codeSnippet && (
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
                <code>{activeDoc.codeSnippet.code}</code>
              </pre>
            )}

            {/* Live Sandbox Execution View */}
            {activeTab === "sandbox" && (
              <div className="p-4 space-y-3 font-mono text-xs">
                {activeDoc.sandboxPrompt && (
                  <div className="bg-white/[0.03] border border-white/5 p-2.5 rounded-lg text-neutral-300 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-500 text-[11px] block uppercase">Command</span>
                      <span className="text-emerald-400 font-medium">$ {activeDoc.sandboxPrompt}</span>
                    </div>
                    <Link
                      to="/workspace"
                      className="text-[11px] font-sans text-[#ff7a00] hover:underline flex items-center gap-1"
                    >
                      <span>Open Workspace</span>
                      <ExternalLink size={10} />
                    </Link>
                  </div>
                )}

                <div className="space-y-1.5 min-h-[140px] bg-black/40 p-3 rounded-lg border border-white/5">
                  <div className="text-neutral-500 text-[11px] flex items-center justify-between border-b border-white/5 pb-1 mb-2">
                    <span>Sandboxed Execution Trace (Kernel Container)</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Zero Host Mutation</span>
                    </span>
                  </div>

                  {sandboxLogs.length === 0 && !isSandboxRunning && (
                    <div className="text-neutral-500 py-6 text-center italic">
                      Click "Run in Sandbox" above to trigger verified container execution.
                    </div>
                  )}

                  {sandboxLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start text-[11px] leading-relaxed">
                      <span className="text-neutral-600 mr-2 select-none">{idx + 1}</span>
                      <span className={
                        log.includes("PASS") || log.includes("200 OK") || log.includes("verified")
                          ? "text-emerald-400 font-semibold"
                          : log.includes("error") || log.includes("Forbidden")
                          ? "text-amber-400 font-medium"
                          : "text-neutral-300"
                      }>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/marketplace"
              className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1.5"
            >
              <span>Explore Agent Marketplace</span>
            </Link>

            <Link
              to="/workspace"
              className="text-xs font-medium bg-[#ff7a00] hover:bg-[#ff8f26] text-black px-4 py-2 rounded-full transition-all"
            >
              Launch Control Plane
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
