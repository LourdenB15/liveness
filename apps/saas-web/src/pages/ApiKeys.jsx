import { AlertCircle, Ban, Key, Plus, Trash2 } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CreateKeyModal } from "../components/apikeys/CreateKeyModal";
import { DeleteKeyModal } from "../components/apikeys/DeleteKeyModal";
import { NewKeyModal } from "../components/apikeys/NewKeyModal";
import { RevokeKeyModal } from "../components/apikeys/RevokeKeyModal";
import TablePagination from "../components/TablePagination";
import { useApiKeys } from "../hooks/useApiKeys";

export default function ApiKeys() {
  const {
    loading,
    keys,
    paginatedKeys,
    newKeyName,
    setNewKeyName,
    isCreating,
    setIsCreating,
    isSubmitting,
    isDeletingKey,
    isRevokingKey,
    error,
    revokeError,
    deleteError,
    copiedId,
    showKeyModal,
    setShowKeyModal,
    revokeTarget,
    setRevokeTarget,
    deleteTarget,
    setDeleteTarget,
    confirmInput,
    setConfirmInput,
    pageSize,
    currentPage,
    setCurrentPage,
    totalKeys,
    closeCreateModal,
    closeRevokeModal,
    closeDeleteModal,
    handleCreateKey,
    confirmRevokeKey,
    confirmDeleteKey,
    copyToClipboard,
    handlePageSizeChange,
  } = useApiKeys();

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            API Access Keys
          </h1>
          <p className="mt-1 max-w-xl text-sm font-medium text-slate-600">
            Generate and manage API credentials required for integrating
            Liveness Cloud SDK into client applications.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => {
              closeCreateModal();
              setIsCreating(true);
            }}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#2f5bf5] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#204be8]"
          >
            <Plus className="h-4 w-4" />
            Issue New Key
          </button>
        )}
      </div>

      {/* Create Key Modal */}
      <CreateKeyModal
        isOpen={isCreating}
        onClose={closeCreateModal}
        newKeyName={newKeyName}
        onNameChange={setNewKeyName}
        onSubmit={handleCreateKey}
        isSubmitting={isSubmitting}
        error={error}
      />

      {/* Keys Table */}
      {loading ? (
        <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
          <div className="overflow-hidden rounded-[10px] border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
                >
                  <div className="flex w-1/3 items-center gap-2.5">
                    <Skeleton circle height={10} width={10} />
                    <Skeleton height={14} width="70%" />
                  </div>
                  <Skeleton height={24} width={180} borderRadius={4} />
                  <Skeleton height={14} width={100} />
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
                  <th className="px-6 py-3.5">Key Identifier</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Cryptographic Key</th>
                  <th className="px-6 py-3.5">Issued Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedKeys.map((key) => {
                  const isRevoked = Boolean(key.revokedAt);
                  return (
                    <tr
                      key={key.id}
                      className="group transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              isRevoked ? "bg-slate-300" : "bg-[#2f5bf5]"
                            }`}
                          />
                          <span
                            className={`text-xs font-bold sm:text-sm ${
                              isRevoked
                                ? "text-slate-500 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {key.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isRevoked ? (
                          <span className="inline-flex items-center gap-1 rounded-sm border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600 uppercase">
                            Revoked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 uppercase">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex w-fit max-w-xs items-center gap-2 rounded-sm border border-slate-200/60 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-600">
                          <code className="truncate font-bold text-slate-600">
                            {key.key}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {new Date(key.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isRevoked && (
                            <button
                              onClick={() => {
                                setRevokeTarget(key);
                                setConfirmInput("");
                              }}
                              className="cursor-pointer rounded-sm p-1.5 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                              title="Revoke API key"
                              aria-label={`Revoke API key ${key.name}`}
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setDeleteTarget(key);
                              setConfirmInput("");
                            }}
                            className="cursor-pointer rounded-sm p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                            title="Delete API key"
                            aria-label={`Delete API key ${key.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {keys.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-slate-200/60 bg-slate-50">
                          <Key className="h-5 w-5 text-slate-300" />
                        </div>
                        <p className="text-xs font-extrabold tracking-widest text-slate-500 uppercase">
                          No active API keys issued
                        </p>
                        <button
                          onClick={() => {
                            closeCreateModal();
                            setIsCreating(true);
                          }}
                          className="mt-2 cursor-pointer text-xs font-bold text-[#2f5bf5] hover:underline"
                        >
                          Issue your first API key &rarr;
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            totalItems={totalKeys}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Security Warning Box */}
      <div className="flex flex-col items-start gap-3.5 rounded-[10px] border border-amber-200 bg-amber-50/80 p-4 sm:flex-row">
        <div className="shrink-0 rounded-md bg-amber-100 p-2 text-amber-700">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-900">
            Security Best Practices
          </p>
          <p className="mt-0.5 text-xs leading-relaxed font-medium text-amber-800/80">
            Do not commit secret keys to public repositories or expose client
            secret headers in public codebases. Store keys in secure environment
            variables (`.env`).
          </p>
        </div>
      </div>

      {/* New Key Display Modal */}
      <NewKeyModal
        apiKey={showKeyModal}
        copiedId={copiedId}
        onCopy={copyToClipboard}
        onClose={() => setShowKeyModal(null)}
      />

      {/* Revoke Key Modal */}
      <RevokeKeyModal
        target={revokeTarget}
        confirmInput={confirmInput}
        onConfirmChange={setConfirmInput}
        onSubmit={confirmRevokeKey}
        onClose={closeRevokeModal}
        isLoading={isRevokingKey}
        error={revokeError}
      />

      {/* Delete Key Modal */}
      <DeleteKeyModal
        target={deleteTarget}
        confirmInput={confirmInput}
        onConfirmChange={setConfirmInput}
        onSubmit={confirmDeleteKey}
        onClose={closeDeleteModal}
        isLoading={isDeletingKey}
        error={deleteError}
      />
    </div>
  );
}
