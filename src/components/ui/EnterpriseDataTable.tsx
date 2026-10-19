import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Columns,
  Download,
  Maximize2,
  Minimize2,
  X,
  SlidersHorizontal,
  Check
} from "lucide-react";
import { EmptyState } from "./EmptyState";

export type DensityMode = "compact" | "normal" | "comfortable";

export interface Column<T> {
  id?: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  width?: string;
  defaultVisible?: boolean;
}

export interface EnterpriseDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: React.ReactNode;
  isLoading?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  tableKey?: string; // used for persisting column visibility in localStorage
  onRowClick?: (item: T) => void;
  selectedItemId?: any;
  enableExport?: boolean;
  exportFileName?: string;
}

export function EnterpriseDataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search records...",
  searchFilter,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search query or filters.",
  actions,
  isLoading = false,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 25,
  tableKey = "admin_table",
  onRowClick,
  selectedItemId,
  enableExport = true,
  exportFileName = "export",
}: EnterpriseDataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [density, setDensity] = useState<DensityMode>("compact");
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // Column visibility state (persisted per tableKey)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`skyer_tbl_cols_${tableKey}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<string, boolean> = {};
    columns.forEach((col, idx) => {
      const key = col.id || String(col.accessorKey) || `col_${idx}`;
      initial[key] = col.defaultVisible !== false;
    });
    return initial;
  });

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(`skyer_tbl_cols_${tableKey}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // 1. Filtered Data
  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    if (searchFilter) {
      return data.filter((item) => searchFilter(item, query.trim()));
    }
    const q = query.toLowerCase();
    return data.filter((item) => {
      return Object.values(item).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === "object") return JSON.stringify(val).toLowerCase().includes(q);
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [data, query, searchFilter]);

  // 2. Sorted Data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let comparison = 0;
      if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // 3. Paginated Data
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key?: keyof T, sortable?: boolean) => {
    if (!key || sortable === false) return;
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!sortedData.length) return;
    const activeCols = columns.filter((col, idx) => {
      const key = col.id || String(col.accessorKey) || `col_${idx}`;
      return visibleColumns[key] !== false;
    });

    const headers = activeCols.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(",");
    const rows = sortedData.map((row) =>
      activeCols
        .map((col) => {
          const val = col.accessorKey ? row[col.accessorKey] : "";
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exportFileName}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeColumns = columns.filter((col, idx) => {
    const key = col.id || String(col.accessorKey) || `col_${idx}`;
    return visibleColumns[key] !== false;
  });

  // Cell padding based on density
  const cellPaddingClass =
    density === "compact"
      ? "py-2 px-3 text-[11px]"
      : density === "comfortable"
      ? "py-4 px-4 text-xs"
      : "py-3 px-3.5 text-xs";

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-white dark:bg-[#121217] border border-slate-200 dark:border-[#22222c] rounded-2xl overflow-hidden shadow-2xl">
      {/* Table Toolbar (Compact Tier) */}
      <div className="h-13 px-4 bg-slate-50 dark:bg-[#161620] border-b border-slate-200 dark:border-[#22222e] flex items-center justify-between gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a1a24] border border-slate-200 dark:border-[#282836] text-xs text-slate-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:border-[#f8a87c] transition-colors font-sans"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {actions}

          {/* Density Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-[#1a1a24] p-0.5 rounded-lg border border-slate-200 dark:border-[#282836]">
            {(["compact", "normal", "comfortable"] as DensityMode[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDensity(d)}
                className={`px-2 py-1 rounded text-[10px] font-mono capitalize transition-all cursor-pointer ${
                  density === d ? "bg-[#f8a87c] text-black font-bold" : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white"
                }`}
                title={`Mật độ hiển thị: ${d}`}
              >
                {d === "compact" ? "Đặc" : d === "normal" ? "Vừa" : "Rộng"}
              </button>
            ))}
          </div>

          {/* Column Toggle Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#282836] bg-slate-100 dark:bg-[#1a1a24] hover:bg-slate-100 dark:hover:bg-[#222230] text-slate-700 dark:text-neutral-300 text-xs flex items-center gap-1.5 cursor-pointer"
              title="Tùy chỉnh cột hiển thị"
            >
              <Columns size={13} />
              <span className="hidden md:inline text-[11px]">Cột</span>
            </button>

            {isColumnDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-slate-50/80 dark:bg-[#181822] border border-slate-200 dark:border-[#2c2c3c] rounded-xl shadow-2xl p-2 z-50 space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-500 dark:text-neutral-400 border-b border-slate-200 dark:border-[#282836] mb-1 flex items-center justify-between">
                  <span>Hiển thị cột</span>
                  <button onClick={() => setIsColumnDropdownOpen(false)} className="text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white">
                    <X size={12} />
                  </button>
                </div>
                {columns.map((col, idx) => {
                  const key = col.id || String(col.accessorKey) || `col_${idx}`;
                  const isChecked = visibleColumns[key] !== false;
                  return (
                    <label
                      key={key}
                      onClick={() => toggleColumnVisibility(key)}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#222230] cursor-pointer text-slate-800 dark:text-neutral-200"
                    >
                      <span>{col.header}</span>
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isChecked ? "bg-[#f8a87c] border-[#f8a87c] text-black" : "border-[#3e3e50]"}`}>
                        {isChecked && <Check size={10} strokeWidth={3} />}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Export CSV */}
          {enableExport && (
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={!sortedData.length}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#282836] bg-slate-100 dark:bg-[#1a1a24] hover:bg-slate-100 dark:hover:bg-[#222230] text-slate-700 dark:text-neutral-300 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              title="Xuất file CSV"
            >
              <Download size={13} />
              <span className="hidden md:inline text-[11px]">Xuất CSV</span>
            </button>
          )}

          {/* Total Counter Badge */}
          <div className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 pl-1 hidden lg:block whitespace-nowrap">
            <span className="text-slate-900 dark:text-white font-semibold">{sortedData.length}</span> kết quả
          </div>
        </div>
      </div>

      {/* Main Table Scrollport (Full Height Flex-1) */}
      <div className="flex-1 overflow-auto min-h-0 relative select-text">
        <table className="w-full text-left border-collapse">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-[#161620] border-b border-slate-200 dark:border-[#22222e] text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 shadow-sm">
            <tr>
              {activeColumns.map((col, idx) => (
                <th
                  key={idx}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => handleSort(col.accessorKey, col.sortable)}
                  className={`py-2.5 px-3 font-semibold select-none ${
                    col.sortable !== false && col.accessorKey
                      ? "cursor-pointer hover:text-slate-900 dark:text-white transition-colors"
                      : ""
                  } ${col.headerClassName || col.className || ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable !== false && col.accessorKey && (
                      <span className="text-neutral-500">
                        {sortKey === col.accessorKey ? (
                          sortDirection === "asc" ? (
                            <ChevronUp size={13} className="text-[#f8a87c]" />
                          ) : (
                            <ChevronDown size={13} className="text-[#f8a87c]" />
                          )
                        ) : (
                          <ChevronsUpDown size={12} className="opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 dark:divide-[#1e1e28] font-sans">
            {isLoading ? (
              <tr>
                <td colSpan={activeColumns.length} className="py-20 text-center text-neutral-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-7 w-7 border-2 border-[#f8a87c] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono">Đang tải dữ liệu platform...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={activeColumns.length} className="py-16">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => {
                const isSelected = selectedItemId !== undefined && (item.id === selectedItemId || item.orderCode === selectedItemId);
                return (
                  <tr
                    key={item.id ?? item.orderCode ?? rowIdx}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors group ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${
                      isSelected
                        ? "bg-[#f8a87c]/10 border-l-2 border-l-[#f8a87c]"
                        : "hover:bg-slate-50/80 dark:bg-[#181822]/70"
                    }`}
                  >
                    {activeColumns.map((col, colIdx) => (
                      <td key={colIdx} className={`${cellPaddingClass} ${col.className || ""}`}>
                        {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey] ?? "—") : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer (Fixed Tier) */}
      {!isLoading && sortedData.length > 0 && (
        <div className="h-11 px-4 bg-white dark:bg-[#14141c] border-t border-slate-200 dark:border-[#22222e] flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-neutral-400 shrink-0">
          {/* Page Info */}
          <div className="font-mono text-[11px] flex items-center gap-2">
            <span>
              Dòng <strong className="text-slate-900 dark:text-white">{(currentPage - 1) * pageSize + 1}</strong> -{" "}
              <strong className="text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, sortedData.length)}</strong> / {sortedData.length}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="hidden sm:inline text-neutral-500">Hiển thị:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-100 dark:bg-[#1a1a24] border border-slate-200 dark:border-[#282836] rounded-md px-2 py-0.5 text-slate-900 dark:text-white focus:outline-none"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} dòng
                  </option>
                ))}
              </select>
            </div>

            {/* Nav Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md border border-[#2a2a38] bg-slate-50/80 dark:bg-[#181822] hover:bg-slate-100 dark:hover:bg-[#222230] text-slate-700 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft size={14} />
              </button>

              <span className="px-2 font-mono text-[11px] text-slate-900 dark:text-white">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md border border-[#2a2a38] bg-slate-50/80 dark:bg-[#181822] hover:bg-slate-100 dark:hover:bg-[#222230] text-slate-700 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Trang tiếp theo"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
