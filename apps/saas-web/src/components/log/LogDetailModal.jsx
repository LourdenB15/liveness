import {
  Activity,
  Code2,
  Fingerprint,
  Key,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";

export function LogDetailModal({ log, onClose }) {
  if (!log) return null;

  return createPortal(
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="log-detail-modal-title"
        className="animate-in zoom-in-95 relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[10px] border border-slate-200/80 bg-white p-6 shadow-2xl duration-200"
      >
        {/* Header */}
        <div className="mb-4 flex shrink-0 items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white shadow-2xs">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="log-detail-modal-title"
                className="font-heading text-base font-bold text-slate-900"
              >
                Telemetry Session Detail
              </h2>
              <p className="font-mono text-xs font-medium text-slate-500">
                ID: {log.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 overflow-y-auto pr-1 text-xs">
          {/* Status & Subject Header Card */}
          <div className="grid grid-cols-1 gap-3 rounded-md border border-slate-100 bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <span className="mb-1 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Subject Name
              </span>
              <span className="text-sm font-bold text-slate-900">
                {log.userName}
              </span>
            </div>
            <div>
              <span className="mb-1 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Session Status
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase ${
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
            </div>
            <div>
              <span className="mb-1 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Origin API Key
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {log.apiKeyName ? (
                  <span className="inline-flex items-center gap-1">
                    <Key className="h-3 w-3 shrink-0 text-slate-400" />
                    <span>
                      {log.apiKeyName}{" "}
                      <span className="font-mono text-[10px] text-slate-400">
                        ({log.apiKeyMasked || ""})
                      </span>
                    </span>
                  </span>
                ) : (
                  "—"
                )}
              </span>
            </div>
          </div>

          {/* Score & Telemetry Breakdown */}
          <div className="space-y-3 rounded-md border border-slate-200/80 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">
                Liveness Match Score
              </span>
              <span className="font-mono font-bold text-slate-900">
                {((log.score || 0) * 100).toFixed(4)}%
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  log.status === "SUCCESS" || log.status === "ENROLLED"
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${(log.score || 0) * 100}%` }}
              />
            </div>
          </div>

          {/* Raw JSON Payload */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                <Code2 className="h-3.5 w-3.5" />
                Raw Telemetry Payload JSON
              </span>
            </div>
            <pre className="overflow-x-auto rounded-md border border-slate-800 bg-[#181a20] p-4 font-mono text-[11px] text-slate-300">
              {JSON.stringify(log, null, 2)}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex shrink-0 items-center justify-end border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
