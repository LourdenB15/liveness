import { AlertCircle, Check, Copy, Key } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function NewKeyModal({ apiKey, copiedId, onCopy, onClose }) {
  useEffect(() => {
    if (!apiKey) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [apiKey, onClose]);

  if (!apiKey) return null;

  return createPortal(
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="key-generated-modal-title"
        className="animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-[10px] border border-slate-200/80 bg-white p-6 shadow-2xl duration-200"
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#2f5bf5]">
          <Key className="h-5 w-5" />
        </div>

        <h2
          id="key-generated-modal-title"
          className="font-heading text-lg font-bold text-slate-900"
        >
          API Key Generated Successfully
        </h2>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Your key for <strong className="text-slate-800">{apiKey.name}</strong>{" "}
          is ready.
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-slate-200/80 bg-slate-50 p-3 font-mono text-xs font-bold text-slate-800">
          <span className="truncate select-all">{apiKey.key}</span>
          <button
            onClick={() => onCopy(apiKey.key, "modal")}
            className={`rounded-4px flex shrink-0 cursor-pointer items-center justify-center px-3 py-1 text-xs font-semibold transition-all ${
              copiedId === "modal"
                ? "bg-emerald-100 text-emerald-700"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {copiedId === "modal" ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 p-3.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-700" />
          <p className="text-xs leading-relaxed font-semibold text-amber-800">
            Save this key now. It will not be shown again.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full cursor-pointer rounded-md bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-slate-800"
        >
          I have saved this key
        </button>
      </div>
    </div>,
    document.body,
  );
}
