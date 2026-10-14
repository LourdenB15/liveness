import { AlertCircle, Key, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function CreateKeyModal({
  isOpen,
  onClose,
  newKeyName,
  onNameChange,
  onSubmit,
  isSubmitting,
  error,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-key-modal-title"
        className="animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-[10px] border border-slate-200/80 bg-white p-6 shadow-2xl duration-200"
      >
        {/* Modal Header & Close Button */}
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#2f5bf5] shadow-2xs">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="create-key-modal-title"
                className="font-heading text-base font-bold text-slate-900"
              >
                Issue New API Key
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Generate secret credentials for your application
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
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="newKeyName"
              className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-700 uppercase"
            >
              Key Label Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="newKeyName"
              type="text"
              required
              aria-required="true"
              placeholder="e.g. Production iOS Mobile App"
              value={newKeyName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#2f5bf5] focus:bg-white focus:ring-2 focus:ring-[#2f5bf5]/20 focus:outline-none"
              autoFocus
            />
            <p className="mt-1.5 text-[11px] font-medium text-slate-400">
              Use a recognizable name to audit usage in logs.
            </p>
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
              disabled={isSubmitting}
              className={`rounded-md px-4 py-2 text-xs font-semibold text-white transition-colors ${
                isSubmitting
                  ? "cursor-not-allowed bg-blue-400 opacity-75"
                  : "cursor-pointer bg-[#2f5bf5] shadow-xs hover:bg-[#204be8]"
              }`}
            >
              {isSubmitting ? "Generating Key..." : "Generate Secret Key"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
