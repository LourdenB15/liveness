import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await api.logs.list();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-lg font-bold text-slate-800">Verification Logs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Match Score</th>
              <th className="px-6 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      log.status === "SUCCESS"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {log.userName}
                </td>
                <td className="px-6 py-4 font-mono text-slate-600">
                  {(log.score * 100).toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
