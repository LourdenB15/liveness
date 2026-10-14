import {
  Activity,
  AlertCircle,
  Clock,
  Filter,
  Fingerprint,
  Key,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { LogDetailModal } from "../components/log/LogDetailModal";
import TablePagination from "../components/TablePagination";
import { useLogs } from "../hooks/useLogs";

export default function Logs() {
  const {
    loading,
    filteredLogs,
    paginatedLogs,
    searchTerm,
    statusFilter,
    selectedLog,
    setSelectedLog,
    statusDropdownOpen,
    setStatusDropdownOpen,
    pageSize,
    currentPage,
    setCurrentPage,
    totalFiltered,
    totalCount,
    passRate,
    avgScore,
    filterOptions,
    selectedOption,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageSizeChange,
  } = useLogs();

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Verification Logs
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Inspection log of verification attempts, similarity scores, and
            failure reasons.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex w-full flex-col items-center gap-3 sm:flex-row md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search subject..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-md border border-slate-200/80 bg-white py-2 pr-4 pl-10 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#2f5bf5] focus:ring-2 focus:ring-[#2f5bf5]/20 focus:outline-none"
            />
          </div>

          {/* Custom Modern Status Dropdown */}
          <div className="relative w-full sm:w-52">
            <button
              type="button"
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none"
            >
              <div className="flex items-center gap-2 truncate font-mono">
                <span
                  className={`h-2 w-2 rounded-full ${selectedOption.color} shrink-0`}
                />
                <span className="truncate">{selectedOption.label}</span>
              </div>
              <Filter className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            </button>

            {statusDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setStatusDropdownOpen(false)}
                />
                <div className="animate-in zoom-in-95 absolute right-0 z-30 mt-1.5 w-full rounded-[10px] border border-slate-200/80 bg-white p-1.5 shadow-xl duration-150">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleStatusFilterChange(opt.id)}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-all ${
                        statusFilter === opt.id
                          ? "bg-blue-50 font-bold text-[#2f5bf5]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 font-mono">
                        <span className={`h-2 w-2 rounded-full ${opt.color}`} />
                        <span>{opt.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metric Summary Cards */}
      {loading ? (
        <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-[10px] border border-slate-200/80 bg-white p-4 shadow-2xs"
              >
                <Skeleton circle height={44} width={44} />
                <div className="w-full space-y-1">
                  <Skeleton height={10} width="60%" />
                  <Skeleton height={24} width="40%" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonTheme>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-[10px] border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#2f5bf5]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Total Logged Sessions
              </p>
              <p className="font-heading text-xl font-bold text-slate-900">
                {totalCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-[10px] border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Verification Pass Rate
              </p>
              <p className="font-heading text-xl font-bold text-slate-900">
                {passRate}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-[10px] border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-purple-100 bg-purple-50 text-purple-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Avg Liveness Confidence
              </p>
              <p className="font-heading text-xl font-bold text-slate-900">
                {avgScore}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logs Table */}
      {loading ? (
        <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
          <div className="overflow-hidden rounded-[10px] border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
                >
                  <Skeleton height={20} width={80} borderRadius={4} />
                  <div className="flex w-1/4 items-center gap-2.5">
                    <Skeleton circle height={28} width={28} />
                    <Skeleton height={14} width="70%" />
                  </div>
                  <Skeleton height={14} width={80} />
                  <Skeleton height={14} width={120} />
                  <Skeleton height={14} width={60} />
                </div>
              ))}
            </div>
          </div>
        </SkeletonTheme>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-162.5 text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  <th className="px-6 py-3.5">Result</th>
                  <th className="px-6 py-3.5">Subject</th>
                  <th className="px-6 py-3.5">API Key</th>
                  <th className="px-6 py-3.5">Score / Confidence</th>
                  <th className="px-6 py-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="group cursor-pointer transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase ${
                          log.status === "SUCCESS"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : log.status === "ENROLLED"
                              ? "border-purple-200 bg-purple-50 text-purple-700"
                              : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {log.status === "SUCCESS" ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : log.status === "ENROLLED" ? (
                          <Fingerprint className="h-3 w-3" />
                        ) : (
                          <ShieldAlert className="h-3 w-3" />
                        )}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 transition-colors group-hover:text-[#2f5bf5]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-slate-200/60 bg-slate-50 text-slate-500">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate text-xs sm:text-sm">
                          {log.userName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {log.apiKeyName ? (
                        <div className="flex items-center gap-1.5">
                          <Key className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="text-xs font-semibold text-slate-800">
                            {log.apiKeyName}
                          </span>
                          {log.apiKeyMasked && (
                            <span className="font-mono text-[10px] text-slate-400">
                              ({log.apiKeyMasked.slice(-8)})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 sm:w-28">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              log.status === "SUCCESS" ||
                              log.status === "ENROLLED"
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${(log.score || 0) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-600">
                          {((log.score || 0) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-slate-500">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="mb-3 h-8 w-8 text-slate-300" />
                        <p className="text-xs font-extrabold tracking-widest text-slate-500 uppercase">
                          No audit telemetry logs found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            totalItems={totalFiltered}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Log Detail Modal */}
      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
