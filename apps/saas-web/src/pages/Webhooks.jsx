import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Plus,
  Trash2,
  Webhook,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { z } from "zod";
import { api } from "../services/api";

const webhookSchema = z.object({
  url: z.string().url("Invalid webhook URL"),
});

export default function Webhooks() {
  const [loadingWebhooks, setLoadingWebhooks] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [webhooks, setWebhooks] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchWebhooks();
    fetchLogs();
  }, []);

  const fetchWebhooks = async () => {
    setLoadingWebhooks(true);
    try {
      const data = await api.webhooks.list();
      setWebhooks(data);
    } catch (error) {
      console.error("Failed to fetch webhooks", error);
    } finally {
      setLoadingWebhooks(false);
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const data = await api.webhooks.logs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch webhook logs", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const closeCreateModal = () => {
    setIsCreating(false);
    setNewUrl("");
    setError("");
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setConfirmInput("");
  };

  const handleCreateWebhook = async (e) => {
    e.preventDefault();
    setError("");

    const validation = webhookSchema.safeParse({ url: newUrl });
    if (!validation.success) {
      return setError(validation.error.issues[0].message);
    }

    try {
      await api.webhooks.create(newUrl);
      closeCreateModal();
      fetchWebhooks();
      fetchLogs();
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDeleteWebhook = async (e) => {
    e.preventDefault();
    if (!deleteTarget || confirmInput !== deleteTarget.url) return;
    try {
      await api.webhooks.delete(deleteTarget.id);
      closeDeleteModal();
      fetchWebhooks();
      fetchLogs();
    } catch (err) {
      console.error("Failed to delete webhook", err);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Webhooks & Callbacks
          </h1>
          <p className="mt-1 max-w-xl text-sm font-medium text-slate-600">
            Subscribe to automated HTTPS POST verification events and real-time
            liveness session completion payloads.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => {
              closeCreateModal();
              setIsCreating(true);
            }}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-extrabold text-white shadow-2xs transition-all hover:bg-blue-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Webhook Endpoint
          </button>
        )}
      </div>

      {/* Create Webhook Pop-Up Modal (React Portal) */}
      {isCreating &&
        createPortal(
          <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
            <div
              className="fixed inset-0 cursor-pointer"
              onClick={closeCreateModal}
            />
            <div className="animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl duration-200">
              {/* Modal Header & Close Button */}
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 shadow-2xs">
                    <Webhook className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Add Webhook Endpoint
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      Subscribe to real-time verification events
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={handleCreateWebhook}
                className="flex flex-col gap-4"
              >
                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-extrabold tracking-wider text-slate-700 uppercase">
                    HTTPS Endpoint URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://api.yourdomain.com/webhooks/liveness"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 font-mono text-xs font-bold text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
                    autoFocus
                  />
                  <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                    Must be an active, publicly accessible HTTPS endpoint.
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-xl bg-blue-600 px-5 py-2 text-xs font-black text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
                  >
                    Save Webhook
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* Active Endpoints Table */}
      {loadingWebhooks ? (
        <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
                >
                  <div className="flex w-1/3 items-center gap-2.5">
                    <Skeleton circle height={10} width={10} />
                    <Skeleton height={14} width="80%" />
                  </div>
                  <Skeleton height={24} width={180} borderRadius={6} />
                  <Skeleton height={16} width={60} borderRadius={6} />
                </div>
              ))}
            </div>
          </div>
        </SkeletonTheme>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <th className="px-6 py-3.5">Endpoint URL</th>
                  <th className="px-6 py-3.5">Signing Secret</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {webhooks.map((webhook) => (
                  <tr
                    key={webhook.id}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-2 w-2 shrink-0 rounded-full ${webhook.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                        />
                        <span className="max-w-xs truncate font-mono text-xs font-bold text-slate-900 sm:text-sm">
                          {webhook.url}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex max-w-xs items-center justify-between gap-3 rounded-md border border-slate-200/60 bg-slate-50 px-3 py-1 transition-colors group-hover:border-slate-300">
                        <code className="truncate font-mono text-xs font-bold text-slate-600">
                          {webhook.secret}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(webhook.secret, webhook.id)
                          }
                          className={`shrink-0 cursor-pointer rounded-md p-1 transition-all ${
                            copiedId === webhook.id
                              ? "bg-emerald-100 text-emerald-700"
                              : "text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                          }`}
                          title="Copy to clipboard"
                        >
                          {copiedId === webhook.id ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase ${
                          webhook.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {webhook.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setDeleteTarget(webhook);
                          setConfirmInput("");
                        }}
                        className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                        title="Remove Webhook"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {webhooks.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200/60 bg-slate-50 text-slate-400">
                          <Webhook className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                          No webhooks registered
                        </p>
                        <button
                          onClick={() => {
                            closeCreateModal();
                            setIsCreating(true);
                          }}
                          className="mt-2 cursor-pointer text-xs font-bold text-blue-600 hover:underline"
                        >
                          Register your first webhook endpoint &rarr;
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delivery Logs Section */}
      <div className="space-y-3 pt-2">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">
            Delivery Attempts & Invocations
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Recent automated payload delivery history to your configured HTTPS
            endpoints.
          </p>
        </div>

        {loadingLogs ? (
          <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
                  >
                    <Skeleton height={14} width={120} />
                    <Skeleton height={14} width="30%" />
                    <Skeleton height={20} width={50} borderRadius={6} />
                    <Skeleton height={14} width={80} />
                  </div>
                ))}
              </div>
            </div>
          </SkeletonTheme>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-150 text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <th className="px-6 py-3.5">Event Type</th>
                    <th className="px-6 py-3.5">Target Endpoint</th>
                    <th className="px-6 py-3.5">Status Code</th>
                    <th className="px-6 py-3.5">Latency</th>
                    <th className="px-6 py-3.5 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="group cursor-pointer transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">
                        {log.event}
                      </td>
                      <td className="max-w-xs truncate px-6 py-4 font-mono text-xs font-medium text-slate-600">
                        {log.url}
                      </td>
                      <td className="px-6 py-4">
                        {log.statusCode ? (
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${
                              log.statusCode >= 200 && log.statusCode < 300
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-rose-200 bg-rose-50 text-rose-700"
                            }`}
                          >
                            {log.statusCode}
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700"
                            title={log.errorMessage}
                          >
                            Error
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                        {log.latencyMs ? `${log.latencyMs}ms` : "-"}
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-medium text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-10 text-center text-xs font-bold text-slate-400"
                      >
                        No webhook deliveries logged yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Webhook Delivery Payload Inspector Modal (React Portal) */}
      {selectedLog &&
        createPortal(
          <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
            <div
              className="fixed inset-0 cursor-pointer"
              onClick={() => setSelectedLog(null)}
            />
            <div className="animate-in zoom-in-95 relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl duration-200">
              {/* Header */}
              <div className="mb-4 flex shrink-0 items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
                    <Webhook className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Webhook Event Delivery Detail
                    </h3>
                    <p className="font-mono text-xs font-medium text-slate-400">
                      Event: {selectedLog.event}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="space-y-4 overflow-y-auto pr-1 text-xs">
                <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4 font-mono">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-400">
                      Target URL:
                    </span>
                    <span className="max-w-xs truncate font-bold text-slate-900">
                      {selectedLog.url}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-400">
                      Status Code:
                    </span>
                    <span className="font-bold text-emerald-600">
                      {selectedLog.statusCode || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-400">Latency:</span>
                    <span className="font-bold text-slate-800">
                      {selectedLog.latencyMs}ms
                    </span>
                  </div>
                </div>

                <div>
                  <span className="mb-1.5 block text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    Payload Inspection JSON
                  </span>
                  <pre className="overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-900 p-4 font-mono text-[11px] text-slate-300">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-4 flex shrink-0 items-center justify-end border-t border-slate-100 pt-4">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Information Box */}
      <div className="flex flex-col items-start gap-3.5 rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:flex-row">
        <div className="shrink-0 rounded-lg bg-blue-100 p-2 text-blue-600">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-blue-900">
            Signed Event Payloads
          </h4>
          <p className="mt-0.5 text-xs leading-relaxed font-medium text-blue-800/70">
            All webhook requests include an `X-Liveness-Signature` header.
            Verify this HMAC signature with your Signing Secret to prevent
            spoofing or unauthorized payload injection.
          </p>
        </div>
      </div>

      {/* GitHub-Style Delete Webhook Confirmation Modal (React Portal) */}
      {deleteTarget &&
        createPortal(
          <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
            <div
              className="fixed inset-0 cursor-pointer"
              onClick={closeDeleteModal}
            />
            <div className="animate-in zoom-in-95 relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl duration-200">
              {/* Modal Header */}
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 shadow-2xs">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Remove Webhook Endpoint
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      This action requires typed verification
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={confirmDeleteWebhook}
                className="flex flex-col gap-4"
              >
                <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-xs">
                  <p className="leading-relaxed font-medium text-slate-700">
                    This will unsubscribe endpoint{" "}
                    <code className="inline-block max-w-xs truncate align-bottom font-mono font-bold text-slate-900">
                      {deleteTarget.url}
                    </code>{" "}
                    from automated event delivery.
                  </p>
                  <p className="mt-2 font-bold text-rose-600">
                    Your server will stop receiving real-time notifications.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    To confirm, type{" "}
                    <strong className="font-mono font-bold text-slate-900 select-all">
                      {deleteTarget.url}
                    </strong>{" "}
                    below:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      placeholder={deleteTarget.url}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 font-mono text-xs font-bold text-slate-900 shadow-2xs transition-all placeholder:text-slate-300 focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:outline-none"
                      autoFocus
                    />
                    {confirmInput === deleteTarget.url && (
                      <CheckCircle2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={confirmInput !== deleteTarget.url}
                    className={`rounded-xl px-5 py-2 text-xs font-black text-white transition-all ${
                      confirmInput === deleteTarget.url
                        ? "cursor-pointer bg-rose-600 shadow-md shadow-rose-500/20 hover:bg-rose-700 active:scale-95"
                        : "cursor-not-allowed bg-slate-300 opacity-60"
                    }`}
                  >
                    Remove Webhook
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
