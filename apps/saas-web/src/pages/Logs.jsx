import {
  Activity,
  Clock,
  Fingerprint,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await api.logs.list();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Audit Logs
        </h1>
        <p className="mt-1 font-medium text-slate-500">
          Detailed history of verification requests
        </p>
      </div>

      <div className="overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                <th className="px-8 py-5">Result</th>
                <th className="px-8 py-5">Subject</th>
                <th className="px-8 py-5">Confidence</th>
                <th className="px-8 py-5">Analysis</th>
                <th className="px-8 py-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="group transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-[10px] font-black tracking-wider uppercase ${
                        log.status === "SUCCESS"
                          ? "bg-emerald-100 text-emerald-700"
                          : log.status === "ENROLLED"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-red-100 text-red-700"
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
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      {log.userName}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 max-w-25 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${log.status === "SUCCESS" || log.status === "ENROLLED" ? "bg-emerald-500" : "bg-red-500"}`}
                          style={{ width: `${log.score * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-black text-slate-600">
                        {(log.score * 100).toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {log.antiSpoofing ? (
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                            Depth
                          </span>
                          <span
                            className={`text-xs font-bold ${log.antiSpoofing.depthVariance < 0.0015 ? "text-red-600" : "text-emerald-600"}`}
                          >
                            {log.antiSpoofing.depthVariance.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex flex-col border-l border-slate-100 pl-4">
                          <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                            Texture
                          </span>
                          <span
                            className={`text-xs font-bold ${log.antiSpoofing.laplacianVariance < 0.003 ? "text-red-600" : "text-emerald-600"}`}
                          >
                            {log.antiSpoofing.laplacianVariance.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-300 italic">
                        No metadata
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right font-semibold text-slate-500">
                    <div className="flex items-center justify-end gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-300" />
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <Activity className="mb-4 h-12 w-12 text-slate-100" />
                      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                        No activity logs found
                      </p>
                    </div>
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
