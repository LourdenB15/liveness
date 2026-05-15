import { Copy, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    const data = await api.apiKeys.list();
    setKeys(data);
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    await api.apiKeys.create(newKeyName);
    setNewKeyName("");
    setIsCreating(false);
    fetchKeys();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to revoke this API key?")) {
      await api.apiKeys.delete(id);
      fetchKeys();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">API Keys</h3>
          <p className="text-sm text-slate-500">
            Manage your keys to authenticate with the Liveness API.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Key
        </button>
      </div>

      {isCreating && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <form onSubmit={handleCreateKey} className="flex gap-4">
            <input
              type="text"
              placeholder="Enter key name (e.g., Production)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Generate
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Key</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {key.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center font-mono text-xs text-slate-500">
                      <span className="max-w-[150px] truncate">{key.key}</span>
                      <button
                        onClick={() => copyToClipboard(key.key)}
                        className="ml-2 rounded p-1 hover:bg-slate-200 transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(key.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {keys.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No API keys found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
