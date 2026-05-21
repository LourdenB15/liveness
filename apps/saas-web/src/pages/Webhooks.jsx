import { AlertCircle, Check, Copy, Plus, Trash2, Webhook } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { api } from "../services/api";

const webhookSchema = z.object({
  url: z.string().url("Invalid webhook URL"),
});

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const data = await api.webhooks.list();
      setWebhooks(data);
    } catch (error) {
      console.error("Failed to fetch webhooks", error);
    }
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
      setNewUrl("");
      setIsCreating(false);
      fetchWebhooks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      confirm(
        "Are you sure you want to remove this webhook? You will stop receiving event notifications at this URL.",
      )
    ) {
      try {
        await api.webhooks.delete(id);
        fetchWebhooks();
      } catch (err) {
        console.error("Failed to delete webhook", err);
      }
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Webhooks
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Receive real-time event notifications on your server
          </p>
        </div>
        {!isCreating && (
          <button
            onClick={() => {
              setIsCreating(true);
              setError("");
            }}
            className="flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Webhook
          </button>
        )}
      </div>

      {isCreating && (
        <div className="animate-in zoom-in-95 rounded-4xl border-2 border-blue-100 bg-blue-50/50 p-8 shadow-xl shadow-blue-100/20 duration-200">
          <h3 className="mb-2 text-lg font-black text-blue-900">
            Register Webhook URL
          </h3>
          <p className="mb-6 text-sm font-medium text-blue-700/70">
            Enter the HTTPS URL where you'd like to receive event payloads.
          </p>

          <form onSubmit={handleCreateWebhook} className="flex flex-col gap-4">
            {error && (
              <div className="mb-2 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="text"
                placeholder="https://your-api.com/webhooks/liveness"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 sm:flex-none"
                >
                  Save Webhook
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 sm:flex-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                <th className="px-10 py-6">Endpoint URL</th>
                <th className="px-10 py-6">Signing Secret</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {webhooks.map((webhook) => (
                <tr
                  key={webhook.id}
                  className="group transition-colors hover:bg-slate-50/30"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${webhook.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"}`}
                      />
                      <span className="text-base font-bold text-slate-900">
                        {webhook.url}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex max-w-xs items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 transition-colors group-hover:bg-white">
                      <code className="truncate font-mono text-xs font-bold text-slate-500">
                        {webhook.secret}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(webhook.secret, webhook.id)
                        }
                        className={`rounded-lg p-1.5 transition-all active:scale-90 ${
                          copiedId === webhook.id
                            ? "bg-emerald-100 text-emerald-600"
                            : "text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                        }`}
                        title="Copy to clipboard"
                      >
                        {copiedId === webhook.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase ${
                        webhook.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {webhook.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => handleDelete(webhook.id)}
                      className="rounded-2xl p-3 text-slate-300 transition-all hover:bg-red-50 hover:text-red-600 active:scale-95"
                      title="Remove Webhook"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {webhooks.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-4xl bg-slate-50">
                        <Webhook className="h-8 w-8 text-slate-200" />
                      </div>
                      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                        No webhooks configured
                      </p>
                      <button
                        onClick={() => setIsCreating(true)}
                        className="mt-4 font-bold text-blue-600 hover:underline"
                      >
                        Register your first webhook URL &rarr;
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-start gap-5 rounded-4xl border-2 border-blue-100 bg-blue-50 p-8">
        <div className="rounded-2xl bg-blue-100 p-3">
          <AlertCircle className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h4 className="text-lg font-black text-blue-900">How it works</h4>
          <p className="mt-1 leading-relaxed font-medium text-blue-800/70">
            Whenever a liveness session is completed or a new user is enrolled,
            we will send a POST request to your URL with a signed payload. Use
            your signing secret to verify that the event originated from
            Liveness Cloud.
          </p>
        </div>
      </div>
    </div>
  );
}
