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
  X,
  AlertTriangle,
  Users,
  Network,
} from "lucide-react";
import { Iam360PermissionTreeNode } from "../services/iam360CellsApi";
import { ToggleSwitch } from "./ui/ToggleSwitch";

interface Iam360PermissionTreeViewProps {
  rootNode: Iam360PermissionTreeNode;
  title?: string;
  subtitle?: string;
  defaultExpandDepth?: number;
  onSelectNode?: (node: Iam360PermissionTreeNode) => void;
  selectedNodeId?: string;
  compact?: boolean;
  onToggleCapabilityNode?: (node: Iam360PermissionTreeNode, nextEnabled: boolean) => void;
  onReconcileDrift?: () => void;
  reconciling?: boolean;
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
  title = "Cây Phân Quyền (Permission Tree)",
  subtitle,
  defaultExpandDepth = 2,
  onSelectNode,
  selectedNodeId,
  compact = false,
  onToggleCapabilityNode,
  onReconcileDrift,
  reconciling = false,
}: Iam360PermissionTreeViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    collectDefaultExpanded(rootNode, 0, defaultExpandDepth, set);
    return set;
  });

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

  const getBadgeStyle = (effect: string) => {
    if (effect === "DENY") {
      return "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
    }
    return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-[#1a1d2b] dark:text-neutral-300 dark:border-[#282d42]";
  };

  const getLevelIcon = (level: string, effect: string) => {
    const cls = effect === "DENY"
      ? "text-rose-500 dark:text-rose-400 shrink-0"
      : "text-slate-400 dark:text-neutral-400 shrink-0";
    if (effect === "DENY" || level === "guardrail") {
      return <Lock size={14} className={cls} />;
    }
    switch (level) {
      case "identity":
        return <Bot size={14} className={cls} />;
      case "organization_cell":
        return <Building2 size={14} className={cls} />;
      case "role_authority":
        return <ShieldCheck size={14} className={cls} />;
      case "capability_group":
        return <Layers size={14} className={cls} />;
      case "principal_leaf":
        return <Users size={13} className={cls} />;
      case "a2a_leaf":
        return <Network size={13} className={cls} />;
      default:
        return <Wrench size={13} className={cls} />;
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
          className={`group flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors cursor-pointer border ${
            node.drift
              ? "bg-amber-50/60 border-amber-300 dark:bg-amber-500/5 dark:border-amber-500/30"
              : isSelected
                ? "bg-slate-100/90 border-slate-300 dark:bg-[#1c1f2e] dark:border-[#323850]"
                : "bg-white hover:bg-slate-50/90 border-slate-200/90 shadow-2xs dark:bg-[#141620] dark:hover:bg-[#191c28] dark:border-[#222534] dark:shadow-none"
          }`}
        >
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleNode(node.id, e)}
                className="mt-0.5 h-4 w-4 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0"
                aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
              >
                {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
            ) : (
              <span
                className={`mt-2 ml-1 mr-0.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                  node.effect === "DENY"
                    ? "bg-rose-500"
                    : node.enabled === false
                      ? "bg-slate-300 dark:bg-neutral-600"
                      : "bg-emerald-500"
                }`}
              />
            )}

            <div className="mt-0.5">{getLevelIcon(node.level, node.effect)}</div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-900 dark:text-neutral-100 leading-snug">
                  {node.label}
                </span>
                {node.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${getBadgeStyle(node.effect)}`}
                  >
                    {node.badge}
                  </span>
                )}
                {node.drift && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25">
                    <AlertTriangle size={10} />
                    <span>Lệch chuẩn</span>
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

          <div className="flex items-center gap-2 shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
            {node.can_toggle && onToggleCapabilityNode && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 hidden sm:inline">
                  {node.enabled ? "Active" : "Disabled"}
                </span>
                <ToggleSwitch
                  checked={node.enabled ?? true}
                  onChange={(next) => onToggleCapabilityNode(node, next)}
                  size="sm"
                  themeColor={themeColor}
                />
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 pl-3 mt-1.5 space-y-1.5 border-l border-slate-200 dark:border-[#252838]">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-slate-50/70 dark:bg-[#11131c] border border-slate-200 dark:border-[#222533] p-3.5 space-y-3">
      {/* Compact Toolbar: Search + Expand/Collapse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 bg-white dark:bg-[#161924] border border-slate-200 dark:border-[#242838] rounded-xl px-3 py-1.5 flex-1 shadow-2xs dark:shadow-none">
          <Search size={13} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Tìm trong ${title.toLowerCase()} (vd: mcp, erpnext, owner, a2a)...`}
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              aria-label="Xoá tìm kiếm"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {rootNode.drift && onReconcileDrift && (
            <button
              type="button"
              disabled={reconciling}
              onClick={onReconcileDrift}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-90 shadow-2xs"
              title="Đồng bộ lại cấu hình chuẩn"
            >
              <AlertTriangle size={12} />
              <span>{reconciling ? "Đang đồng bộ..." : "Khôi phục chuẩn"}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleExpandAll}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 dark:bg-[#161924] dark:hover:bg-[#1f2332] dark:border-[#262a3b] text-slate-700 dark:text-neutral-300 cursor-pointer transition-colors shadow-2xs dark:shadow-none"
            title="Mở rộng toàn bộ"
            aria-label="Mở rộng toàn bộ"
          >
            <Maximize2 size={13} />
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 dark:bg-[#161924] dark:hover:bg-[#1f2332] dark:border-[#262a3b] text-slate-700 dark:text-neutral-300 cursor-pointer transition-colors shadow-2xs dark:shadow-none"
            title="Thu gọn toàn bộ"
            aria-label="Thu gọn toàn bộ"
          >
            <Minimize2 size={13} />
          </button>
        </div>
      </div>

      {/* Tree Viewport */}
      <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
        {filteredRoot ? (
          renderTreeNode(filteredRoot, 0)
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-neutral-500">
            Không tìm thấy nhánh quyền nào khớp với "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}
