import React, { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Building2,
  Bot,
  Layers,
  Wrench,
  Lock,
  Search,
  Maximize2,
  Minimize2,
  CheckCircle2,
  XCircle,
  Sparkles,
  X,
} from "lucide-react";
import { Iam360PermissionTreeNode } from "../services/iam360CellsApi";

interface Iam360PermissionTreeViewProps {
  rootNode: Iam360PermissionTreeNode;
  title?: string;
  subtitle?: string;
  defaultExpandDepth?: number;
  onSelectNode?: (node: Iam360PermissionTreeNode) => void;
  selectedNodeId?: string;
  compact?: boolean;
}

function collectDefaultExpanded(node: Iam360PermissionTreeNode, depth: number, maxDepth: number, acc: Set<string>) {
  if (depth < maxDepth) {
    acc.add(node.id);
    for (const child of node.children || []) {
      collectDefaultExpanded(child, depth + 1, maxDepth, acc);
    }
  }
}

function collectAllIds(node: Iam360PermissionTreeNode, acc: Set<string>) {
  acc.add(node.id);
  for (const child of node.children || []) {
    collectAllIds(child, acc);
  }
}

function filterTree(node: Iam360PermissionTreeNode, q: string): Iam360PermissionTreeNode | null {
  if (!q) return node;
  const matchSelf =
    node.label.toLowerCase().includes(q) ||
    node.subtitle.toLowerCase().includes(q) ||
    node.badge.toLowerCase().includes(q) ||
    node.source.toLowerCase().includes(q);

  const filteredChildren: Iam360PermissionTreeNode[] = [];
  for (const child of node.children || []) {
    const f = filterTree(child, q);
    if (f) filteredChildren.push(f);
  }

  if (matchSelf || filteredChildren.length > 0) {
    return {
      ...node,
      children: matchSelf && filteredChildren.length === 0 ? node.children : filteredChildren,
    };
  }
  return null;
}

export function Iam360PermissionTreeView({
  rootNode,
  title = "Sơ đồ Cây Phân Quyền (Personal → Organization Cell Hierarchy)",
  subtitle = "Cấu trúc phân cấp từ Identity Cell cá nhân của Agent tới Organization Cell, ReBAC Role Tuples, Cerbos ABAC và Baseline Guardrails.",
  defaultExpandDepth = 2,
  onSelectNode,
  selectedNodeId,
  compact = false,
}: Iam360PermissionTreeViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    collectDefaultExpanded(rootNode, 0, defaultExpandDepth, set);
    return set;
  });

  // Ensure root is expanded when rootNode changes
  React.useEffect(() => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      collectDefaultExpanded(rootNode, 0, defaultExpandDepth, next);
      return next;
    });
  }, [rootNode.id, defaultExpandDepth]);

  const filteredRoot = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return filterTree(rootNode, q);
  }, [rootNode, searchQuery]);

  const handleExpandAll = () => {
    const all = new Set<string>();
    collectAllIds(rootNode, all);
    setExpandedIds(all);
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set([rootNode.id]));
  };

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getAccentBadgeClasses = (accent: string, effect: string) => {
    if (effect === "DENY" || accent === "rose") {
      return "bg-rose-500/15 text-rose-500 dark:text-[#fda4af] border-rose-500/30";
    }
    switch (accent) {
      case "peach":
        return "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border-[#f8a87c]/35";
      case "mint":
        return "bg-emerald-500/15 text-emerald-600 dark:text-[#86efac] border-emerald-500/30";
      case "lavender":
        return "bg-purple-500/15 text-purple-600 dark:text-[#c4b5fd] border-purple-500/30";
      case "sky":
        return "bg-sky-500/15 text-sky-600 dark:text-[#93c5fd] border-sky-500/30";
      default:
        return "bg-slate-500/15 text-slate-600 dark:text-neutral-300 border-slate-500/30";
    }
  };

  const getLevelIcon = (level: string, effect: string) => {
    if (effect === "DENY" || level === "guardrail") {
      return <Lock size={14} className="text-rose-400 shrink-0" />;
    }
    switch (level) {
      case "identity":
        return <Bot size={14} className="text-[#f8a87c] shrink-0" />;
      case "organization_cell":
        return <Building2 size={14} className="text-emerald-400 shrink-0" />;
      case "role_authority":
        return <ShieldCheck size={14} className="text-purple-400 shrink-0" />;
      case "capability_group":
        return <Layers size={14} className="text-sky-400 shrink-0" />;
      default:
        return <Wrench size={13} className="text-emerald-400 shrink-0" />;
    }
  };

  const renderTreeNode = (node: Iam360PermissionTreeNode, depth: number) => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = searchQuery.trim().length > 0 || expandedIds.has(node.id);
    const isSelected = selectedNodeId === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={(e) => {
            if (onSelectNode) {
              onSelectNode(node);
            }
            if (hasChildren) {
              toggleNode(node.id, e);
            }
          }}
          className={`group flex items-start justify-between gap-2.5 rounded-xl px-2.5 py-2 transition-all cursor-pointer border ${
            isSelected
              ? "bg-[#f8a87c]/15 border-[#f8a87c]/45 shadow-xs"
              : "bg-white/60 dark:bg-[#14141d]/90 hover:bg-slate-100/90 dark:hover:bg-[#1b1b27] border-slate-200/70 dark:border-[#222230]"
          }`}
        >
          <div className="flex items-start gap-2 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleNode(node.id, e)}
                className="mt-0.5 h-4 w-4 rounded flex items-center justify-center text-neutral-400 hover:text-[#f8a87c] hover:bg-white/10 transition-colors shrink-0"
                aria-label={isExpanded ? "Collapse branch" : "Expand branch"}
              >
                {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
            ) : (
              <span className="mt-1.5 ml-1.5 mr-1 h-1.5 w-1.5 rounded-full bg-neutral-400/50 dark:bg-neutral-600 shrink-0" />
            )}

            <div className="mt-0.5">{getLevelIcon(node.level, node.effect)}</div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                  {node.label}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${getAccentBadgeClasses(
                    node.accent,
                    node.effect
                  )}`}
                >
                  {node.badge}
                </span>
                {node.effect === "ALLOW" && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-emerald-500 dark:text-[#86efac]">
                    <CheckCircle2 size={11} />
                    <span>ALLOW</span>
                  </span>
                )}
                {node.effect === "DENY" && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-rose-500 dark:text-[#fda4af]">
                    <XCircle size={11} />
                    <span>DENY</span>
                  </span>
                )}
              </div>
              {!compact && node.subtitle && (
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed mt-0.5">
                  {node.subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 shrink-0 pt-0.5">
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-slate-100 dark:bg-[#101017] px-2 py-0.5 rounded border border-slate-200/70 dark:border-[#222230]">
              {node.source}
            </span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 pl-3 mt-1.5 space-y-1.5 border-l border-dashed border-slate-300 dark:border-[#2a2a3a]">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-[#11141d] border border-slate-200 dark:border-[#222533] p-3.5 sm:p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#f8a87c] shrink-0" />
            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              {title}
            </h4>
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleExpandAll}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#181b26] hover:bg-slate-100 dark:hover:bg-[#222636] border border-slate-200 dark:border-[#282c3e] text-[11px] font-mono text-slate-700 dark:text-neutral-300 flex items-center gap-1 cursor-pointer transition-colors"
            title="Mở rộng toàn bộ nhánh quyền"
          >
            <Maximize2 size={11} className="text-[#f8a87c]" />
            <span>Mở hết</span>
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#181b26] hover:bg-slate-100 dark:hover:bg-[#222636] border border-slate-200 dark:border-[#282c3e] text-[11px] font-mono text-slate-700 dark:text-neutral-300 flex items-center gap-1 cursor-pointer transition-colors"
            title="Thu gọn cây quyền"
          >
            <Minimize2 size={11} />
            <span>Thu gọn</span>
          </button>
        </div>
      </div>

      {/* Tree Filter & Legend Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 bg-white dark:bg-[#0d0f17] border border-slate-200 dark:border-[#242838] rounded-xl px-3 py-1.5 flex-1">
          <Search size={13} className="text-neutral-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Lọc nhanh nhánh quyền (vd: owner, cell:gm, erpnext, read_file, baseline)..."
            className="w-full bg-transparent text-xs font-mono text-slate-800 dark:text-white placeholder-neutral-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-full bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30">
            👑 Owner / Root
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-[#86efac] border border-emerald-500/30">
            ✓ Allowed / MCP
          </span>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-[#c4b5fd] border border-purple-500/30">
            ◆ ReBAC / Tools
          </span>
          <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 dark:text-[#fda4af] border border-rose-500/30">
            ✕ Baseline Deny
          </span>
        </div>
      </div>

      {/* Tree Viewport */}
      <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
        {filteredRoot ? (
          renderTreeNode(filteredRoot, 0)
        ) : (
          <div className="py-8 text-center text-xs font-mono text-neutral-500">
            Không tìm thấy nhánh quyền nào khớp với từ khoá "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}
