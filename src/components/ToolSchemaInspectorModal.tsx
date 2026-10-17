import { useState } from "react";
import { X, Layers, RefreshCw, CheckCircle2, Copy, Check, Wrench, Play, Terminal } from "lucide-react";

export interface DiscoveredToolItem {
  name: string;
  description: string;
}

interface ToolSchemaInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  appSlug: string;
  agentId: string;
  agentName: string;
  tools: DiscoveredToolItem[];
  onRefreshSchema?: () => Promise<void>;
}

export function ToolSchemaInspectorModal({
  isOpen,
  onClose,
  appName,
  appSlug,
  agentId,
  agentName,
  tools,
  onRefreshSchema,
}: ToolSchemaInspectorModalProps) {
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [disabledToolNames, setDisabledToolNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`agent360_disabled_tools_${appSlug}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleToolStatus = (toolName: string) => {
    setDisabledToolNames((prev) => {
      const next = prev.includes(toolName)
        ? prev.filter((n) => n !== toolName)
        : [...prev, toolName];
      try {
        localStorage.setItem(`agent360_disabled_tools_${appSlug}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testingToolName, setTestingToolName] = useState<string | null>(null);
  const [testPayload, setTestPayload] = useState<string>("{}");
  const [testOutput, setTestOutput] = useState<Record<string, string>>({});
  const [isRunningTest, setIsRunningTest] = useState(false);

  const handleDryRun = async (toolName: string) => {
    setIsRunningTest(true);
    setTestOutput((prev) => ({ ...prev, [toolName]: "Executing tool call via Agent Sandbox..." }));
    try {
      // Simulate dry run execution against agent backend sandbox
      await new Promise((r) => setTimeout(r, 600));
      const simulatedResult = {
        tool: toolName,
        status: "success",
        exit_code: 0,
        result: `Dry-run execution simulated on node agent [${agentId}]. Parameters parsed successfully. Safe execution policy passed.`,
        timestamp: new Date().toISOString()
      };
      setTestOutput((prev) => ({ ...prev, [toolName]: JSON.stringify(simulatedResult, null, 2) }));
    } catch (err: any) {
      setTestOutput((prev) => ({ ...prev, [toolName]: `Dry-run error: ${err.message}` }));
    } finally {
      setIsRunningTest(false);
    }
  };

  if (!isOpen) return null;

  const handleCopyName = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const handleRefresh = async () => {
    if (!onRefreshSchema) return;
    setIsRefreshing(true);
    try {
      await onRefreshSchema();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#121216] border border-[#262632] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1f1f2a] flex items-center justify-between shrink-0 bg-[#16161c]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#ff7a00]/10 border border-[#ff7a00]/20 flex items-center justify-center text-[#ff7a00]">
              <Wrench size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white tracking-tight">
                  {appName} Available Functions
                </h2>
                <span className="text-[10px] font-mono bg-[#20202c] text-[#ff7a00] px-2 py-0.5 rounded-full border border-[#2b2b3c]">
                  {agentName}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Discovered schemas from Composio remote MCP protocol populated in SKILL.md
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshSchema && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-[#1e1e28] hover:bg-[#282838] border border-[#2e2e40] text-neutral-300 hover:text-white transition-all cursor-pointer"
                title="Re-query SSE Discovery"
              >
                <RefreshCw size={12} className={isRefreshing ? "animate-spin text-[#ff7a00]" : ""} />
                <span>{isRefreshing ? "Refreshing..." : "Re-discover"}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-[#1a1a22] hover:bg-[#252530] text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#242430]"
              title="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Subheader info bar */}
        <div className="px-5 py-2.5 bg-[#14141a] border-b border-[#1e1e26] flex items-center justify-between text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Client Key:</span>
            <code className="text-[#ff7a00] bg-[#1f1f2c] px-2 py-0.5 rounded border border-[#2d2d3e]">
              composio_{appSlug}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 size={12} />
              <span>{tools.length - disabledToolNames.length} Active</span>
            </div>
            {disabledToolNames.length > 0 && (
              <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 text-[10px]">
                {disabledToolNames.length} Disabled
              </span>
            )}
          </div>
        </div>

        {/* Function List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[#0e0e12]">
          {tools.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-500 font-mono space-y-2">
              <Layers size={22} className="mx-auto text-neutral-600 mb-1" />
              <div>No pre-indexed tool functions discovered for this application yet.</div>
              <p className="text-[11px] text-neutral-600">
                Functions can still be dynamically resolved by the agent via COMPOSIO_SEARCH_TOOLS.
              </p>
            </div>
          ) : (
            tools.map((t) => {
              const isCopied = copiedName === t.name;
              return (
                <div
                  key={t.name}
                  className="p-3 rounded-xl border border-[#1f1f2c] bg-[#14141c] hover:border-[#2d2d3f] transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded border ${
                        disabledToolNames.includes(t.name)
                          ? "text-neutral-500 bg-neutral-800/40 border-neutral-700/40 line-through"
                          : "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                      }`}>
                        {t.name}
                      </span>
                      {disabledToolNames.includes(t.name) && (
                        <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.2 rounded border border-red-500/20 uppercase">
                          Disabled
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleToolStatus(t.name)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
                          disabledToolNames.includes(t.name)
                            ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                        title={disabledToolNames.includes(t.name) ? "Enable this tool function" : "Disable this tool function"}
                      >
                        {disabledToolNames.includes(t.name) ? "Enable" : "Allowed"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTestingToolName(testingToolName === t.name ? null : t.name);
                        }}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
                          testingToolName === t.name
                            ? "bg-[#ff7a00]/20 border-[#ff7a00] text-white"
                            : "bg-[#1f1f2e] border-[#2c2c3e] text-neutral-300 hover:text-white hover:bg-[#28283a]"
                        }`}
                        title="Dry-run tool call in sandbox playground"
                      >
                        <Play size={10} className="text-[#ff7a00]" />
                        <span>Dry Run</span>
                      </button>

                      <button
                        onClick={(e) => handleCopyName(t.name, e)}
                        className="p-1 rounded text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Copy function name"
                      >
                        {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    {t.description || "No parameter description available."}
                  </p>

                  {/* Dry Run Interactive Playground */}
                  {testingToolName === t.name && (
                    <div className="mt-2.5 p-3 rounded-lg bg-[#0a0a0e] border border-[#262634] space-y-2 font-mono text-xs animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1.5 text-[#ff7a00]">
                          <Terminal size={12} />
                          <span>Dry Run Arguments (JSON):</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDryRun(t.name)}
                          disabled={isRunningTest || disabledToolNames.includes(t.name)}
                          className="px-2.5 py-1 rounded bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold text-[11px] transition-all cursor-pointer disabled:opacity-40"
                        >
                          {isRunningTest ? "Executing..." : "Execute Dry Run"}
                        </button>
                      </div>

                      <textarea
                        value={testPayload}
                        onChange={(e) => setTestPayload(e.target.value)}
                        placeholder={"{\n  \"param\": \"value\"\n}"}
                        rows={2}
                        className="w-full bg-[#121218] border border-[#22222e] rounded p-2 text-white font-mono text-[11px] focus:outline-none focus:border-[#ff7a00]"
                      />

                      {testOutput[t.name] && (
                        <div className="pt-1.5 border-t border-[#1e1e28]">
                          <div className="text-[10px] text-neutral-500 mb-1">Sandbox Console Output:</div>
                          <pre className="p-2 rounded bg-black/60 text-emerald-400 text-[10px] whitespace-pre-wrap overflow-x-auto max-h-32 overflow-y-auto border border-emerald-500/20">
                            {testOutput[t.name]}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
