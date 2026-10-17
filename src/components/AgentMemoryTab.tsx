import React, { useState, useEffect } from "react";
import { Brain, Sparkles, Plus, Trash2, Edit2, Check, X, Shield, RefreshCw } from "lucide-react";

interface MemoryItem {
  id: string;
  category: "fact" | "preference" | "rule" | "project";
  content: string;
  learnedAt: string;
}

interface AgentMemoryTabProps {
  agentId: string;
  agentName: string;
  agentSlug: string;
}

const DEFAULT_MEMORIES: Record<string, MemoryItem[]> = {
  default: [
    {
      id: "mem-1",
      category: "rule",
      content: "Always provide verifiable terminal receipts and exit codes for actions.",
      learnedAt: "2 days ago",
    },
    {
      id: "mem-2",
      category: "preference",
      content: "Prefer non-mutating inspections before proposing code changes.",
      learnedAt: "Yesterday",
    },
    {
      id: "mem-3",
      category: "project",
      content: "Main production server is Host 2nd (agent360.antares.vn) running Docker Compose.",
      learnedAt: "3 days ago",
    },
    {
      id: "mem-4",
      category: "fact",
      content: "Primary database is PostgreSQL and object storage is MinIO on Node 5th.",
      learnedAt: "Last week",
    },
  ],
};

export function AgentMemoryTab({ agentId, agentName, agentSlug }: AgentMemoryTabProps) {
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`agent360_memory_${agentSlug}`);
      return saved ? JSON.parse(saved) : DEFAULT_MEMORIES.default;
    } catch {
      return DEFAULT_MEMORIES.default;
    }
  });

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<MemoryItem["category"]>("fact");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const saveMemories = (items: MemoryItem[]) => {
    setMemories(items);
    try {
      localStorage.setItem(`agent360_memory_${agentSlug}`, JSON.stringify(items));
    } catch {}
  };

  const handleAddMemory = () => {
    if (!newContent.trim()) return;
    const newItem: MemoryItem = {
      id: `mem-${Date.now()}`,
      category: newCategory,
      content: newContent.trim(),
      learnedAt: "Just now",
    };
    saveMemories([newItem, ...memories]);
    setNewContent("");
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    saveMemories(memories.filter((m) => m.id !== id));
  };

  const handleSaveEdit = (id: string) => {
    if (!editContent.trim()) return;
    saveMemories(
      memories.map((m) => (m.id === id ? { ...m, content: editContent.trim(), learnedAt: "Edited just now" } : m))
    );
    setEditingId(null);
  };

  const filtered = memories.filter((m) => filterCategory === "all" || m.category === filterCategory);

  const getCategoryBadge = (cat: MemoryItem["category"]) => {
    switch (cat) {
      case "rule":
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 uppercase">Rule</span>;
      case "preference":
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">Pref</span>;
      case "project":
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">Project</span>;
      case "fact":
      default:
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">Fact</span>;
    }
  };

  return (
    <div className="space-y-3 text-xs font-sans pb-4">
      {/* Header Info Banner */}
      <div className="p-3 rounded-xl bg-[#14141c] border border-[#22222e] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Brain size={13} className="text-[#ff7a00]" />
            <span>Persistent Memory (MEMORY.md)</span>
          </span>
          <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            {memories.length} entries
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Facts and rules learned across conversations that persist into {agentName}&apos;s system prompt.
        </p>
      </div>

      {/* Filter and Add Button */}
      <div className="flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-1 bg-[#121218] p-1 rounded-lg border border-[#20202c] text-[10px] font-mono">
          {(["all", "rule", "preference", "project", "fact"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                filterCategory === cat ? "bg-[#ff7a00] text-black font-semibold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ff7a00]/15 hover:bg-[#ff7a00]/25 text-[#ff7a00] border border-[#ff7a00]/30 text-[10px] font-mono cursor-pointer transition-colors"
        >
          <Plus size={11} />
          <span>Add</span>
        </button>
      </div>

      {/* Add New Memory Drawer */}
      {isAdding && (
        <div className="p-3 rounded-xl bg-[#181824] border border-[#ff7a00]/30 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
            <span>New Knowledge Entry</span>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="bg-[#121218] border border-[#2a2a3a] rounded px-2 py-0.5 text-[10px] text-white focus:outline-none"
            >
              <option value="fact">Fact</option>
              <option value="rule">Rule (Mandate)</option>
              <option value="preference">Preference</option>
              <option value="project">Project Context</option>
            </select>
          </div>
          <textarea
            autoFocus
            rows={2}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Type what this agent should always remember..."
            className="w-full bg-[#101016] border border-[#262638] rounded-lg p-2 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none font-sans"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 rounded text-[10px] text-neutral-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddMemory}
              disabled={!newContent.trim()}
              className="px-3 py-1 rounded bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold text-[10px] cursor-pointer disabled:opacity-40 transition-colors"
            >
              Save Memory
            </button>
          </div>
        </div>
      )}

      {/* Memory items list */}
      <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-[#121218] border border-[#20202c] hover:border-[#2a2a3c] transition-colors space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              {getCategoryBadge(item.category)}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-neutral-500">{item.learnedAt}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditContent(item.content);
                  }}
                  className="p-1 rounded text-neutral-500 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  title="Edit entry"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded text-neutral-500 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                  title="Delete entry"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>

            {editingId === item.id ? (
              <div className="space-y-1.5 pt-1">
                <textarea
                  rows={2}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-[#181822] border border-[#ff7a00] rounded-lg p-2 text-xs text-white focus:outline-none resize-none font-sans"
                />
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(item.id)}
                    className="p-1 rounded bg-emerald-500 text-black cursor-pointer"
                  >
                    <Check size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[12px] text-neutral-200 leading-relaxed font-sans">{item.content}</p>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-6 text-neutral-500 font-mono text-[11px] border border-dashed border-[#20202c] rounded-xl">
            No memories under this category.
          </div>
        )}
      </div>
    </div>
  );
}
