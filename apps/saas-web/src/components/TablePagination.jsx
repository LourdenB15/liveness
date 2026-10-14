import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TablePagination({
  totalItems,
  pageSize,
  currentPage,
  onPageSizeChange,
  onPageChange,
}) {
  if (totalItems === 0) return null;

  const isAll = pageSize === "all";
  const effectivePageSize = isAll ? Math.max(totalItems, 1) : pageSize;
  const totalPages = isAll
    ? 1
    : Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startRecord =
    totalItems === 0 ? 0 : (safeCurrentPage - 1) * effectivePageSize + 1;
  const endRecord = isAll
    ? totalItems
    : Math.min(safeCurrentPage * effectivePageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 sm:flex-row">
      {/* Left: Rows per page selector */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
        <span className="font-mono text-[11px] text-slate-500 uppercase">
          Show:
        </span>
        <div className="inline-flex items-center rounded-md border border-slate-200 bg-white p-0.5 shadow-2xs">
          {[10, 20, "all"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onPageSizeChange(size)}
              className={`cursor-pointer rounded px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                pageSize === size
                  ? "bg-[#2f5bf5] text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {size === "all" ? "All" : size}
            </button>
          ))}
        </div>
        <span className="hidden font-mono text-[11px] text-slate-400 sm:inline">
          entries
        </span>
      </div>

      {/* Center: Showing X to Y of Z */}
      <div className="font-mono text-xs text-slate-500">
        Showing{" "}
        <strong className="font-bold text-slate-800">{startRecord}</strong>–
        <strong className="font-bold text-slate-800">{endRecord}</strong> of{" "}
        <strong className="font-bold text-slate-800">{totalItems}</strong>
      </div>

      {/* Right: Page navigation buttons */}
      {!isAll && totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
            disabled={safeCurrentPage <= 1}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - safeCurrentPage) <= 1
                );
              })
              .map((page, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && page - prev > 1;
                return (
                  <div key={page} className="flex items-center">
                    {showEllipsis && (
                      <span className="px-1.5 font-mono text-xs text-slate-400">
                        …
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onPageChange(page)}
                      className={`h-8 min-w-8 cursor-pointer rounded-md px-2 font-mono text-xs font-semibold transition-colors ${
                        safeCurrentPage === page
                          ? "bg-[#2f5bf5] text-white shadow-2xs"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}
          </div>

          <button
            type="button"
            onClick={() =>
              onPageChange(Math.min(totalPages, safeCurrentPage + 1))
            }
            disabled={safeCurrentPage >= totalPages}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            title="Next page"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
