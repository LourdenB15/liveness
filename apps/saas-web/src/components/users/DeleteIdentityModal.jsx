import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { createPortal } from "react-dom";

export function DeleteIdentityModal({
  target,
  confirmInput,
  onConfirmChange,
  onSubmit,
  onClose,
}) {
  if (!target) return null;

  return createPortal(
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-200">
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-identity-modal-title"
        className="animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-[10px] border border-rose-100 bg-white shadow-2xl duration-200"
      >
        {/* Prominent Red Accent Top Banner */}
        <div className="h-1 w-full bg-linear-to-r from-rose-500 via-red-500 to-rose-600" />

        <div className="p-6">
          {/* Modal Header */}
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-rose-200/80 bg-rose-50 text-rose-600 shadow-xs">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="delete-identity-modal-title"
                    className="font-heading text-base font-bold tracking-tight text-slate-900"
                  >
                    Delete Identity Profile
                  </h2>
                  <span className="rounded-sm bg-rose-100 px-2 py-0.5 font-mono text-[9px] font-bold text-rose-700 uppercase">
                    Destructive
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  Typed verification required to proceed
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5 rounded-md border border-rose-200/60 bg-rose-50/70 p-3.5 text-xs">
              <p className="leading-relaxed font-medium text-slate-800">
                You are about to delete enrolled biometric identity for{" "}
                <span className="font-bold text-slate-950 underline decoration-rose-400 decoration-2">
                  {target.name}
                </span>
                .
              </p>
              <p className="font-mono text-[11px] text-slate-500">
                Identity ID: {target.id}
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-rose-600">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                This action cannot be undone or reverted.
              </div>
            </div>

            <div>
              <label
                htmlFor="delete-identity-input"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                To confirm, type{" "}
                <span className="rounded-sm border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono font-bold text-slate-900 select-all">
                  {target.name}
                </span>{" "}
                below:
              </label>
              <div className="relative">
                <input
                  id="delete-identity-input"
                  type="text"
                  value={confirmInput}
                  onChange={(e) => onConfirmChange(e.target.value)}
                  placeholder={`Type "${target.name}" to verify`}
                  className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3.5 py-2 font-mono text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  autoFocus
                />
                {confirmInput === target.name && (
                  <CheckCircle2 className="animate-in zoom-in-50 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-emerald-500 duration-150" />
                )}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={confirmInput !== target.name}
                className={`rounded-md px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors ${
                  confirmInput === target.name
                    ? "cursor-pointer bg-rose-600 hover:bg-rose-700"
                    : "cursor-not-allowed bg-slate-300 opacity-60 shadow-none"
                }`}
              >
                Confirm Permanent Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
