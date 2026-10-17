import { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  RefreshCw,
  Trash2,
  Layers,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { AgentMcpClient, fetchAgentMcpClients } from "../services/agentApi";
import { APPS_CATALOG } from "./ConnectAppsModal";

interface AgentConnectedAppsTabProps {
  agentId: string;
  agentName: string;
  onOpenConnectModal: () => void;
  onRefreshTrigger?: number;
}

export function AgentConnectedAppsTab({
  agentId,
  agentName,
  onOpenConnectModal,
  onRefreshTrigger = 0,
}: AgentConnectedAppsTabProps) {
  const [clients, setClients] = useState<AgentMcpClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "composio" | "native">("all");

  const loadMcpClients = async () => {
    if (!agentId) return;
    setLoading(true);
    try {
      const list = await fetchAgentMcpClients(agentId);
      setClients(list);
    } catch (err) {
      console.error("[AgentConnectedAppsTab] Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMcpClients();
  }, [agentId, onRefreshTrigger]);

  const handleDeleteClient = async (clientKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Disconnect and hot-remove '${clientKey}' from ${agentName}?`)) return;

    setDeletingKey(clientKey);
    try {
      const res = await fetch(`/api/mcp/${encodeURIComponent(clientKey)}`, {
        method: "DELETE",
        headers: {
          "X-Agent-Id": agentId,
        },
      });
      if (res.ok) {
        setClients((prev) => prev.filter((c) => c.key !== clientKey));
      } else {
        alert(`Failed to delete client: status ${res.status}`);
      }
    } catch (err: any) {
      alert(`Error deleting client: ${err.message}`);
    } finally {
      setDeletingKey(null);
    }
  };

  // Match client with known Composio catalog item to get genuine SVG logo
  const resolveAppMeta = (client: AgentMcpClient) => {
    const rawKey = client.key.toLowerCase().replace(/^composio_/, "");
    const matched = APPS_CATALOG.find(
      (a) =>
        a.id.toLowerCase() === rawKey ||
        client.name.toLowerCase().includes(a.id.toLowerCase())
    );

    return {
      name: matched?.name || client.name || client.key,
      description: matched?.description || client.description || "Active agent integration tool",
      logoUrl: matched?.logoUrl || `https://logos.composio.dev/api/${rawKey}`,
      isComposio: client.key.startsWith("composio_") || Boolean(matched),
      matchedId: matched?.id || rawKey,
    };
  };

  const composioClients = clients.filter(
    (c) => c.key.startsWith("composio_") || APPS_CATALOG.some((a) => a.id === c.key)
  );
  const nativeClients = clients.filter(
    (c) => !c.key.startsWith("composio_") && !APPS_CATALOG.some((a) => a.id === c.key)
  );

  const displayedClients =
    filter === "composio"
      ? composioClients
      : filter === "native"
      ? nativeClients
      : clients;

  return (
    <div className="space-y-3.5 text-xs flex flex-col h-full font-sans">
      {/* Top Controls: Counts, Filters, Add Button */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-white tracking-tight">Connected Apps</span>
          <span className="text-[10px] font-mono bg-[#1e1e28] text-neutral-400 px-2 py-0.5 rounded-full border border-[#2b2b3a]">
            {clients.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={loadMcpClients}
            disabled={loading}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-[#16161f] hover:bg-[#20202c] border border-[#242432] transition-colors cursor-pointer"
            title="Refresh connected tools"
          >
            <RefreshCw size={12} className={loading ? "animate-spin text-[#ff7a00]" : ""} />
          </button>

          <button
            onClick={onOpenConnectModal}
            className="flex items-center gap-1 bg-[#ff7a00] hover:bg-[#ff8c1a] text-black font-semibold px-2.5 py-1 rounded-lg text-[11px] shadow-sm transition-all cursor-pointer"
          >
            <Plus size={12} className="stroke-[2.5]" />
            <span>Add app</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs: All, Composio, Native MCP */}
      <div className="flex items-center gap-1 p-1 bg-[#14141a] rounded-xl border border-[#20202a] text-[11px]">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-1 rounded-lg font-medium transition-all cursor-pointer text-center ${
            filter === "all"
              ? "bg-[#242432] text-white shadow-xs"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          All ({clients.length})
        </button>
        <button
          onClick={() => setFilter("composio")}
          className={`flex-1 py-1 rounded-lg font-medium transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
            filter === "composio"
              ? "bg-[#242432] text-[#ff7a00] shadow-xs"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Sparkles size={11} />
          <span>Composio ({composioClients.length})</span>
        </button>
        <button
          onClick={() => setFilter("native")}
          className={`flex-1 py-1 rounded-lg font-medium transition-all cursor-pointer text-center ${
            filter === "native"
              ? "bg-[#242432] text-white shadow-xs"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Infra MCP ({nativeClients.length})
        </button>
      </div>

      {/* Integration Info Banner */}
      <div className="p-2.5 rounded-xl bg-[#14141d] border border-[#222232] text-[11px] text-neutral-400 leading-relaxed flex items-start gap-2">
        <Shield size={13} className="text-emerald-400 shrink-0 mt-0.5" />
        <div>
          Loaded directly from <strong className="text-white font-mono">{agentName}</strong>'s QwenPaw MCP driver card layer. Adding tools hot-patches this agent's runtime.
        </div>
      </div>

      {/* List of Connected Apps */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {loading && clients.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-xs text-neutral-500 font-mono space-y-2">
            <Loader2 size={18} className="animate-spin text-[#ff7a00]" />
            <span>Loading {agentName}'s integrations...</span>
          </div>
        ) : displayedClients.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-xs text-neutral-500 font-mono space-y-3 p-4 border border-dashed border-[#22222e] rounded-2xl">
            <Layers size={22} className="text-neutral-600" />
            <div>No connected apps in this view.</div>
            <button
              onClick={onOpenConnectModal}
              className="text-[#ff7a00] hover:underline cursor-pointer font-sans text-xs font-medium"
            >
              + Connect an application
            </button>
          </div>
        ) : (
          displayedClients.map((client) => {
            const meta = resolveAppMeta(client);
            const isDeleting = deletingKey === client.key;

            return (
              <div
                key={client.key}
                className="group p-2.5 rounded-xl border border-[#20202c] bg-[#14141c] hover:border-[#2f2f42] hover:bg-[#181822] transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                {/* Logo + Names */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="h-8 w-8 rounded-lg bg-[#1f1f2b] border border-[#2b2b3d] flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-xs">
                    <img
                      src={meta.logoUrl}
                      alt={meta.name}
                      className="h-full w-full object-contain filter drop-shadow-xs"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        if (target.parentElement) {
                          target.parentElement.className =
                            "h-8 w-8 rounded-lg bg-neutral-800 text-white flex items-center justify-center text-[11px] font-bold";
                          target.parentElement.textContent = meta.name[0].toUpperCase();
                        }
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white truncate block">
                        {meta.name}
                      </span>
                      {meta.isComposio ? (
                        <span className="text-[9px] font-mono text-[#ff7a00] bg-[#ff7a00]/10 px-1.5 py-0.2 rounded border border-[#ff7a00]/20 shrink-0">
                          Composio
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.2 rounded shrink-0">
                          {client.transport}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5 leading-tight font-mono">
                      key: {client.key}
                    </p>
                  </div>
                </div>

                {/* Right Actions: Status Badge & Trash */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 size={10} />
                    <span>Active</span>
                  </span>

                  <button
                    disabled={isDeleting}
                    onClick={(e) => handleDeleteClient(client.key, e)}
                    className="p-1 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title={`Disconnect ${meta.name}`}
                  >
                    {isDeleting ? (
                      <Loader2 size={12} className="animate-spin text-red-400" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
