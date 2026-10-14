import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function DeleteKeyModal({
  target,
  confirmInput,
  onConfirmChange,
  onSubmit,
  onClose,
  isLoading,
  error,
}) {
  useEffect(() => {
    if (!target) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [target, onClose]);

  if (!target) return null;

  return createPortal(
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-key-modal-title"
        className="animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-[10px] border border-slate-200/80 bg-white p-6 shadow-2xl duration-200"
      >
        {/* Modal Header */}
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 shadow-2xs">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="delete-key-modal-title"
                className="font-heading text-base font-bold text-slate-900"
              >
                Delete API Key
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Permanently remove this API key record
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="rounded-md border border-rose-100 bg-rose-50/60 p-3.5 text-xs">
            <p className="leading-relaxed font-medium text-slate-700">
              This will permanently delete API access key{" "}
              <strong className="font-bold text-slate-900">
                {target.name}
              </strong>{" "}
              (
              <code className="font-mono font-bold text-slate-700">
                {target.key}
              </code>
              ).
            </p>
            <p className="mt-2 font-bold text-rose-600">
              This action cannot be undone. Associated historical logs will
              retain unlinked key records.
            </p>
          </div>

          <div>
            <label
              htmlFor="delete-confirm-input"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              To confirm, type{" "}
              <strong className="font-mono font-bold text-slate-900 select-all">
                {target.name}
              </strong>{" "}
              below:
            </label>
            <div className="relative">
              <input
                id="delete-confirm-input"
                type="text"
                value={confirmInput}
                onChange={(e) => onConfirmChange(e.target.value)}
                placeholder={target.name}
                className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3.5 py-2 font-mono text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-300 focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                autoFocus
              />
              {confirmInput === target.name && (
                <CheckCircle2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={confirmInput !== target.name || isLoading}
              className={`rounded-md px-4 py-2 text-xs font-semibold text-white transition-colors ${
                confirmInput === target.name && !isLoading
                  ? "cursor-pointer bg-rose-600 shadow-xs hover:bg-rose-700"
                  : "cursor-not-allowed bg-slate-300 opacity-60"
              }`}
            >
              {isLoading ? "Deleting..." : "Delete Key"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
