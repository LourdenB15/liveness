import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Fingerprint,
  Key,
  Search,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TablePagination from "../components/TablePagination";
import { DeleteIdentityModal } from "../components/users/DeleteIdentityModal";
import { useUsers } from "../hooks/useUsers";

export default function Users() {
  const {
    loading,
    filteredUsers,
    paginatedUsers,
    searchTerm,
    deleteTarget,
    setDeleteTarget,
    confirmInput,
    setConfirmInput,
    pageSize,
    currentPage,
    setCurrentPage,
    sortField,
    sortOrder,
    totalFiltered,
    closeDeleteModal,
    confirmDelete,
    isDeletingUser,
    deleteError,
    handleSearchChange,
    handlePageSizeChange,
    handleSortToggle,
  } = useUsers();

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            User Directory
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            View and manage enrolled user profiles and biometric vectors.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 shrink-0 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search identity or ID..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-md border border-slate-200/80 bg-white py-2 pr-4 pl-10 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#2f5bf5] focus:ring-2 focus:ring-[#2f5bf5]/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Directory Table */}
      {loading ? (
        <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
          <div className="overflow-hidden rounded-[10px] border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
                >
                  <div className="flex w-1/3 items-center gap-3">
                    <Skeleton circle height={36} width={36} />
                    <div className="w-full space-y-1">
                      <Skeleton height={14} width="70%" />
                      <Skeleton height={10} width="40%" />
                    </div>
                  </div>
                  <Skeleton height={16} width={120} />
                  <Skeleton height={16} width={100} />
                </div>
              ))}
            </div>
          </div>
        </SkeletonTheme>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  <th className="px-6 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleSortToggle("name")}
                      className="group/sort flex cursor-pointer items-center gap-1.5 transition-colors hover:text-slate-900"
                    >
                      <span>Enrolled Subject</span>
                      {sortField === "name" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5 text-[#2f5bf5]" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 text-[#2f5bf5]" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-300 transition-colors group-hover/sort:text-slate-500" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3.5">Identity ID</th>
                  <th className="px-6 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleSortToggle("apiKey")}
                      className="group/sort flex cursor-pointer items-center gap-1.5 transition-colors hover:text-slate-900"
                    >
                      <span>Origin API Key</span>
                      {sortField === "apiKey" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5 text-[#2f5bf5]" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 text-[#2f5bf5]" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-300 transition-colors group-hover/sort:text-slate-500" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleSortToggle("enrolledAt")}
                      className="group/sort flex cursor-pointer items-center gap-1.5 transition-colors hover:text-slate-900"
                    >
                      <span>Enrolled Date</span>
                      {sortField === "enrolledAt" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5 text-[#2f5bf5]" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 text-[#2f5bf5]" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-300 transition-colors group-hover/sort:text-slate-500" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2f5bf5] text-xs font-bold text-white shadow-2xs">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-3.5">
                          <span className="block text-xs font-bold text-slate-900 transition-colors group-hover:text-[#2f5bf5] sm:text-sm">
                            {user.name}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-600 uppercase">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex w-fit items-center gap-2 rounded-sm border border-slate-200/60 bg-slate-50 px-2.5 py-1 font-mono text-xs font-bold text-slate-600">
                        <Fingerprint className="h-3.5 w-3.5 text-slate-400" />
                        {user.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.apiKeyName ? (
                        <div className="flex items-center gap-1.5">
                          <Key className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {user.apiKeyName}
                            </p>
                            {user.apiKeyMasked && (
                              <p className="font-mono text-[10px] text-slate-400">
                                {user.apiKeyMasked}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(user.enrolledAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setDeleteTarget(user);
                          setConfirmInput("");
                        }}
                        className="cursor-pointer rounded-sm p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="Delete identity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center">
                        <User className="mb-3 h-8 w-8 text-slate-300" />
                        <p className="text-xs font-extrabold tracking-widest text-slate-500 uppercase">
                          No enrolled identities found
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

      {/* Delete Identity Modal */}
      <DeleteIdentityModal
        target={deleteTarget}
        confirmInput={confirmInput}
        onConfirmChange={setConfirmInput}
        onSubmit={confirmDelete}
        onClose={closeDeleteModal}
        isLoading={isDeletingUser}
        error={deleteError}
      />
    </div>
  );
}
