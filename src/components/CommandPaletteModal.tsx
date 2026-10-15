import { useState, useEffect } from "react";
import { InfraAgent } from "../types/agent";
import {
  Search,
  Bot,
  Command,
  X,
  Sparkles,
  BarChart3,
  Server,
  ArrowRight,
} from "lucide-react";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: InfraAgent[];
  onSelectAgent: (agentId: string) => void;
  onOpenAnalytics: () => void;
  onOpenSkills: () => void;
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  agents,
  onSelectAgent,
  onOpenAnalytics,
  onOpenSkills,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or toggle
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.slug.toLowerCase().includes(query.toLowerCase()) ||
      a.roleTag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="bg-[#120f0c] border border-[#2b241e] rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col font-sans">
        {/* Search Input */}
        <div className="px-4 py-3 bg-[#17120e] border-b border-[#2b241e] flex items-center gap-3">
          <Search size={16} className="text-[#d86f4c]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, bot name, or tool..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-neutral-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-1 text-xs">
          {/* Quick Actions */}
          <div className="px-2 py-1 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
            Quick Actions
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenAnalytics();
            }}
            className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-neutral-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left font-mono"
          >
            <span className="flex items-center gap-2">
              <BarChart3 size={13} className="text-amber-400" />
              <span>Open Token Consumption & Cost Analytics</span>
            </span>
            <ArrowRight size={12} className="text-neutral-500" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenSkills();
            }}
            className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-neutral-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left font-mono"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={13} className="text-[#d86f4c]" />
              <span>Browse Skill Pool & Capabilities Catalog</span>
            </span>
            <ArrowRight size={12} className="text-neutral-500" />
          </button>

          {/* Agents Section */}
          <div className="px-2 pt-3 pb-1 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
            Switch Agent ({filteredAgents.length})
          </div>
          {filteredAgents.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                onSelectAgent(a.id);
                onClose();
              }}
              className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-neutral-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <Bot size={14} className="text-[#d86f4c]" />
                <span className="font-medium text-white">{a.name}</span>
                <span className="text-[10px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded">
                  {a.node}
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">{a.model}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
