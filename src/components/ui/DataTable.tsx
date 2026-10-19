import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: React.ReactNode;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search records...",
  searchFilter,
  pageSize = 10,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search query or filters.",
  actions,
  isLoading = false,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filter
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

  // 2. Sort
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

  // 3. Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
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

  return (
    <div className="space-y-4">
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <SearchInput
            value={query}
            onChange={(q) => {
              setQuery(q);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
          />
        </div>
        {actions && <div className="flex items-center gap-2 self-end sm:self-auto">{actions}</div>}
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#22222c] bg-white dark:bg-[#14141a] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#22222e] bg-slate-50/80 dark:bg-[#161620] text-slate-500 dark:text-neutral-400 font-mono uppercase tracking-wider text-[11px] select-none">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => handleSort(col.accessorKey, col.sortable)}
                    className={`px-4 py-3 font-semibold ${
                      col.sortable !== false && col.accessorKey
                        ? "cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                        : ""
                    } ${col.className || ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable !== false && col.accessorKey && (
                        <span className="text-slate-400 dark:text-neutral-500">
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
            <tbody className="divide-y divide-slate-100 dark:divide-[#1e1e28]">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-slate-400 dark:text-neutral-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 border-2 border-[#f8a87c] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8">
                    <EmptyState title={emptyTitle} description={emptyDescription} />
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, rowIdx) => (
                  <tr
                    key={item.id ?? rowIdx}
                    className="hover:bg-slate-50 dark:hover:bg-[#181822]/60 transition-colors group"
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`px-4 py-3.5 text-slate-700 dark:text-neutral-200 ${col.className || ""}`}>
                        {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey] ?? "—") : null}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!isLoading && sortedData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-[#22222e] bg-slate-50/50 dark:bg-[#161620]/50 text-xs text-slate-500 dark:text-neutral-400 gap-3">
            <div className="font-mono text-[11px]">
              Showing <span className="font-semibold text-slate-900 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> to{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>{" "}
              of <span className="font-semibold text-slate-900 dark:text-white">{sortedData.length}</span> records
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a38] bg-white dark:bg-[#181822] hover:bg-slate-100 dark:hover:bg-[#20202c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-neutral-300"
              >
                <ChevronLeft size={14} />
              </button>

              <span className="px-2 font-mono text-[11px]">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a38] bg-white dark:bg-[#181822] hover:bg-slate-100 dark:hover:bg-[#20202c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-neutral-300"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
