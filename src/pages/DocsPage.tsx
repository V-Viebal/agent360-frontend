import { SeoHead } from "../components/SeoHead";
import { useTranslation } from "../i18n/LanguageContext";
import { useState, useMemo, useRef, useEffect } from "react";
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
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { DOCS_SECTIONS, DocSection } from "../data/docsContent";
import { AgentTopologyVisualizer } from "../components/AgentTopologyVisualizer";


// Robust Markdown Block & Inline Formatter for Docs
function renderInlineMarkdown(rawText: string) {
  if (!rawText) return "";
  const parts = rawText.split(/(\b|\B)(?=\*\*|`|\*)/g);
  // Simpler and safer regex for inline markdown
  const tokenRegex = /(\*\*.*?\*\*|`.*?`|\*[^*]+?\*)/g;
  const tokens = rawText.split(tokenRegex);
  if (tokens.length === 1) return rawText;

  return tokens.map((part, pIdx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={pIdx} className="font-semibold text-neutral-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={pIdx} className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-[#181822] border border-neutral-200 dark:border-[#262634] font-mono text-[12px] text-[#f8a87c] mx-0.5 font-medium">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2 && !part.startsWith("**")) {
      return (
        <em key={pIdx} className="italic text-neutral-800 dark:text-neutral-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

interface ParsedBlock {
  type: "h1" | "h2" | "h3" | "h4" | "ul" | "ol" | "p" | "code";
  lang?: string;
  body?: string;
  items?: string[];
  text?: string;
}

function parseMarkdownBlocks(raw: string): ParsedBlock[] {
  const parts = raw.split(/(```[\s\S]*?```)/g);
  const blocks: ParsedBlock[] = [];

  for (const part of parts) {
    if (part.startsWith("```") && part.endsWith("```")) {
      const lines = part.split("\n");
      const lang = lines[0].replace(/^```/, "").trim();
      const body = lines.slice(1, -1).join("\n");
      blocks.push({ type: "code", lang, body });
    } else {
      const lines = part.split("\n");
      let currList: string[] = [];
      let currListType: "ul" | "ol" | null = null;
      let currP: string[] = [];

      const flushP = () => {
        if (currP.length > 0) {
          const t = currP.join(" ").trim();
          if (t) blocks.push({ type: "p", text: t });
          currP = [];
        }
      };

      const flushList = () => {
        if (currList.length > 0 && currListType) {
          blocks.push({ type: currListType, items: [...currList] });
          currList = [];
          currListType = null;
        }
      };

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          flushP();
          flushList();
          continue;
        }

        if (trimmed.startsWith("#### ")) {
          flushP();
          flushList();
          blocks.push({ type: "h4", text: trimmed.slice(5).trim() });
        } else if (trimmed.startsWith("### ")) {
          flushP();
          flushList();
          blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
        } else if (trimmed.startsWith("## ")) {
          flushP();
          flushList();
          blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
        } else if (trimmed.startsWith("# ")) {
          flushP();
          flushList();
          blocks.push({ type: "h1", text: trimmed.slice(2).trim() });
        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          flushP();
          if (currListType !== "ul") {
            flushList();
            currListType = "ul";
          }
          currList.push(trimmed.slice(2).trim());
        } else if (/^\d+\.\s+/.test(trimmed)) {
          flushP();
          if (currListType !== "ol") {
            flushList();
            currListType = "ol";
          }
          currList.push(trimmed.replace(/^\d+\.\s+/, "").trim());
        } else {
          if (currListType) {
            flushList();
          }
          currP.push(trimmed);
        }
      }
      flushP();
      flushList();
    }
  }

  return blocks;
}

export function DocsPage() {
  const { t } = useTranslation();
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

  const sandboxTimerRef = useRef<number | null>(null);

  // Clean up running sandbox when activeDoc changes
  useEffect(() => {
    if (sandboxTimerRef.current) {
      window.clearInterval(sandboxTimerRef.current);
      sandboxTimerRef.current = null;
    }
    setIsSandboxRunning(false);
    setSandboxLogs(activeDoc.sandboxOutput || []);
  }, [activeDoc.id]);

  const handleRunSandbox = () => {
    const outputs = activeDoc.sandboxOutput;
    if (!outputs || outputs.length === 0) return;

    if (sandboxTimerRef.current) {
      window.clearInterval(sandboxTimerRef.current);
      sandboxTimerRef.current = null;
    }

    setIsSandboxRunning(true);
    setSandboxLogs([]);
    setActiveTab("sandbox");

    let current = 0;
    sandboxTimerRef.current = window.setInterval(() => {
      if (current < outputs.length) {
        const nextLog = outputs[current];
        if (typeof nextLog === "string") {
          setSandboxLogs((prev) => [...prev, nextLog]);
        }
        current++;
      } else {
        if (sandboxTimerRef.current) {
          window.clearInterval(sandboxTimerRef.current);
          sandboxTimerRef.current = null;
        }
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
    <div className="pt-20 min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans">
      <SeoHead
        title={`${activeDoc.title} — Skyer Architecture & AgentCore Documentation`}
        description={activeDoc.summary}
        keywords={`Skyer Docs, ${activeDoc.title}, ${activeDoc.category}, AgentCore Kernel, ACP Protocol, ReMe Memory`}
        canonicalPath="/docs"
        ogType="article"
        breadcrumbs={[
          { name: "Skyer Home", url: "/" },
          { name: "Documentation", url: "/docs" },
          { name: activeDoc.title, url: `/docs#${activeDoc.id}` },
        ]}
        howToSteps={activeDoc.keyTakeaways.map((k, i) => ({
          name: `Architectural Guarantee ${i + 1}`,
          text: k,
        }))}
        aeoSummary={{
          question: `How does ${activeDoc.title} work in Skyer AgentCore?`,
          directAnswer: activeDoc.summary,
          keyFacts: activeDoc.keyTakeaways,
        }}
      />
      {/* Top Banner */}
      <div className="border-b border-[var(--border-subtle)] bg-white/[0.02] px-4 py-3">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Skyer</Link>
            <ChevronRight size={12} />
            <span className="text-neutral-900 dark:text-white font-medium">{t("docs.breadcrumb")}</span>
            <ChevronRight size={12} />
            <span className="text-[#f8a87c]">{activeDoc.title}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <span>{t("docs.specsLink")}</span>
              <ExternalLink size={12} />
            </a>
            <span className="text-neutral-600">•</span>
            <a
              href="https://docs.ai-teammates.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <span>{t("docs.aiTeammatesLink")}</span>
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
              placeholder={t("docs.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#0d111a] border border-neutral-200 dark:border-[var(--border-subtle)] shadow-sm dark:shadow-none text-neutral-900 dark:text-neutral-100 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:border-[#f8a87c]/50"
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
                              ? "bg-[#f8a87c]/15 text-[#f8a87c] font-semibold border border-[#f8a87c]/30"
                              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06]"
                          }`}
                        >
                          <span className="truncate">{doc.title}</span>
                          {doc.badge && (
                            <span
                              title={`${doc.badge} Module`}
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                                isSelected
                                  ? "bg-[#f8a87c] text-black font-semibold"
                                  : "bg-neutral-200/70 dark:bg-white/10 text-neutral-600 dark:text-neutral-400"
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
          <div className="rounded-xl border border-[var(--border-subtle)] bg-white dark:bg-[#0d111a] p-4 text-xs space-y-2 shadow-sm dark:shadow-none">
            <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#f8a87c]" />
              <span>Need custom agents?</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Explore pre-built enterprise agent templates ready to deploy on private infra.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#f8a87c] hover:underline pt-1"
            >
              {t("docs.browseMarketplace")} <ArrowRight size={11} />
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 rounded-2xl border border-[var(--border-subtle)] bg-white dark:bg-[#0d111a] p-6 sm:p-10 shadow-sm dark:shadow-none text-neutral-900 dark:text-neutral-100 space-y-8">
          {/* Header */}
          <div className="border-b border-[var(--border-subtle)] pb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#f8a87c] bg-[#f8a87c]/10 px-2.5 py-0.5 rounded-md border border-[#f8a87c]/20">
                {activeDoc.category}
              </span>
              {activeDoc.badge && (
                <span className="text-[11px] font-mono bg-white/5 border border-[var(--border-subtle)] px-2 py-0.5 rounded text-neutral-300">
                  {activeDoc.badge}
                </span>
              )}
            </div>
            <h1 className="font-newsreader text-3xl sm:text-5xl font-semibold text-neutral-900 dark:text-white tracking-tight">
              {activeDoc.title}
            </h1>
            <p className="mt-3 text-base text-neutral-400 leading-relaxed max-w-3xl font-sans">
              {activeDoc.summary}
            </p>
          </div>

          {/* Key Takeaways Box */}
          <div className="rounded-xl border border-[#f8a87c]/25 bg-[#f8a87c]/5 p-5 space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-[#f8a87c] font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>{t("docs.keyGuarantees")}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-sans">
              {activeDoc.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#f8a87c]">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Markdown-style Prose Content */}
          <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
            {parseMarkdownBlocks(activeDoc.content).map((block, bIdx) => {
              if (block.type === "h1") {
                return (
                  <h1 key={bIdx} className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-3 pb-2 border-b border-neutral-200 dark:border-white/10 tracking-tight">
                    {block.text}
                  </h1>
                );
              }
              if (block.type === "h2") {
                return (
                  <h2 key={bIdx} className="text-xl font-bold text-neutral-900 dark:text-white mt-7 mb-2.5 pb-1.5 border-b border-neutral-200 dark:border-white/10 tracking-tight">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "h3") {
                return (
                  <h3 key={bIdx} className="text-lg font-bold text-neutral-900 dark:text-white mt-6 mb-2 flex items-center gap-2 tracking-tight">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c]" />
                    <span>{block.text}</span>
                  </h3>
                );
              }
              if (block.type === "h4") {
                return (
                  <h4 key={bIdx} className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-5 mb-1.5 uppercase font-mono tracking-wider">
                    {block.text}
                  </h4>
                );
              }
              if (block.type === "ul" && block.items) {
                return (
                  <ul key={bIdx} className="space-y-2.5 my-3 pl-1 text-neutral-700 dark:text-neutral-300">
                    {block.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2.5 leading-relaxed font-sans">
                        <span className="text-[#f8a87c] shrink-0 text-xs mt-1 select-none font-bold">↳</span>
                        <div className="flex-1">{renderInlineMarkdown(item)}</div>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "ol" && block.items) {
                return (
                  <ol key={bIdx} className="space-y-2.5 my-3 pl-1 text-neutral-700 dark:text-neutral-300">
                    {block.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2.5 leading-relaxed font-sans">
                        <span className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[11px] font-mono font-semibold text-[#f8a87c] flex items-center justify-center shrink-0 mt-0.5 select-none shadow-2xs">
                          {itemIdx + 1}
                        </span>
                        <div className="flex-1 pt-0.5">{renderInlineMarkdown(item)}</div>
                      </li>
                    ))}
                  </ol>
                );
              }
              if (block.type === "code" && block.body) {
                return (
                  <div key={bIdx} className="my-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#07090e] p-4 font-mono text-xs overflow-x-auto shadow-xs">
                    <pre className="text-neutral-800 dark:text-neutral-200 whitespace-pre leading-relaxed">{block.body}</pre>
                  </div>
                );
              }
              if (block.type === "p" && block.text) {
                return (
                  <p key={bIdx} className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans text-sm">
                    {renderInlineMarkdown(block.text)}
                  </p>
                );
              }
              return null;
            })}
          </div>

          {/* Topology Visualizer for Orchestration / Concepts */}
          {(activeDoc.id === "ai-teammates" || activeDoc.id === "core-concepts") && (
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#f8a87c] font-semibold flex items-center gap-1.5">
                <GitBranch size={14} />
                <span>{t("docs.supervisionTree")}</span>
              </div>
              <AgentTopologyVisualizer />
            </div>
          )}

          {/* Interactive Code & Live Sandbox Execution Area */}
          <div className="rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[#080b11] overflow-hidden shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2.5 text-xs font-mono">
              {/* Tab Switcher */}
              <div className="flex items-center gap-1 bg-neutral-200/60 dark:bg-white/5 p-0.5 rounded-lg border border-neutral-300/50 dark:border-white/5">
                {activeDoc.codeSnippet && (
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "code"
                        ? "bg-[#f8a87c] text-black font-semibold shadow"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/40 dark:hover:bg-white/[0.04]"
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
                        ? "bg-[#f8a87c] text-black font-semibold shadow"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/40 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <Terminal size={12} />
                    <span>{t("docs.tryInSandbox")}</span>
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
                    className="hover:text-neutral-900 dark:hover:text-white text-neutral-400 transition-colors flex items-center gap-1 cursor-pointer text-xs"
                  >
                    {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedCode ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Tab View */}
            {activeTab === "code" && activeDoc.codeSnippet && (
              <pre className="p-4 text-xs font-mono text-neutral-800 dark:text-neutral-200 overflow-x-auto leading-relaxed bg-white/60 dark:bg-transparent">
                <code>{activeDoc.codeSnippet.code}</code>
              </pre>
            )}

            {/* Live Sandbox Execution View */}
            {activeTab === "sandbox" && (
              <div className="p-4 space-y-3 font-mono text-xs">
                {activeDoc.sandboxPrompt && (
                  <div className="bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5 p-2.5 rounded-lg text-neutral-800 dark:text-neutral-300 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-neutral-500 text-[11px] block uppercase">Command</span>
                      <span className="text-emerald-400 font-medium">$ {activeDoc.sandboxPrompt}</span>
                    </div>
                    <Link
                      to="/app"
                      className="text-[11px] font-sans text-[#f8a87c] hover:underline flex items-center gap-1"
                    >
                      <span>{t("docs.openWorkspace")}</span>
                      <ExternalLink size={10} />
                    </Link>
                  </div>
                )}

                <div className="space-y-1.5 min-h-[140px] bg-slate-50 dark:bg-black/50 p-3 rounded-lg border border-neutral-200 dark:border-white/5 shadow-xs">
                  <div className="text-neutral-500 dark:text-neutral-400 text-[11px] flex items-center justify-between border-b border-neutral-200 dark:border-white/5 pb-1 mb-2">
                    <span>{t("docs.sandboxedTrace")}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{t("docs.zeroMutation")}</span>
                    </span>
                  </div>

                  {sandboxLogs.length === 0 && !isSandboxRunning && (
                    <div className="text-neutral-500 py-6 text-center italic">
                      Click "Run in Sandbox" above to trigger verified container execution.
                    </div>
                  )}

                  {sandboxLogs.map((log, idx) => {
                    const strLog = String(log || "");
                    const isSuccess = strLog.includes("PASS") || strLog.includes("200 OK") || strLog.includes("verified") || strLog.includes("ONLINE") || strLog.includes("HOÀN TẤT");
                    const isWarn = strLog.includes("error") || strLog.includes("Forbidden") || strLog.includes("cảnh báo") || strLog.includes("Cổng");
                    return (
                      <div key={idx} className="flex items-start text-[11px] leading-relaxed">
                        <span className="text-neutral-500 mr-2 select-none font-mono">{idx + 1}</span>
                        <span className={
                          isSuccess
                            ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                            : isWarn
                            ? "text-amber-600 dark:text-amber-400 font-medium"
                            : "text-neutral-800 dark:text-neutral-300"
                        }>
                          {strLog}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/marketplace"
              className="text-xs font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5"
            >
              <span>{t("docs.exploreMarketplace")}</span>
            </Link>

            <Link
              to="/app"
              className="text-xs font-medium bg-[#f8a87c] hover:bg-[#f5935f] text-black px-4 py-2 rounded-full transition-all"
            >
              Launch Control Plane
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
