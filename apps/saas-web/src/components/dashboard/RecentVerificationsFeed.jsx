import {
  ArrowRight,
  ArrowUpRight,
  Fingerprint,
  Key,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../../utils/formatRelativeTime";

export function RecentVerificationsFeed({ loading, recentLogs }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-slate-200/80 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-heading text-sm font-bold text-slate-900">
            Recent Verifications
          </h2>
          <p className="text-xs text-slate-500">
            Live feed of incoming verification and enrollment requests
          </p>
        </div>
        <Link
          to="/logs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2f5bf5] transition-colors hover:text-[#204be8]"
        >
          <span>View all logs</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
              >
                <Skeleton height={20} width={80} borderRadius={4} />
                <Skeleton height={14} width={120} />
                <Skeleton height={14} width={60} />
                <Skeleton height={14} width={70} />
              </div>
            ))}
          </div>
        </SkeletonTheme>
      ) : recentLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <p className="text-xs font-bold text-slate-700">
            No verifications recorded yet
          </p>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            When your web or mobile app runs liveness checks with your API key,
            records will appear here in real time.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Link
              to="/docs"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2f5bf5] hover:text-[#204be8]"
            >
              <span>Read SDK Setup Guide</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                <th className="px-5 py-3">Result</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">API Key</th>
                <th className="px-5 py-3">Confidence</th>
                <th className="px-5 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <tr
                  key={log.id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3.5">
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
                      {log.status === "SUCCESS"
                        ? "Passed"
                        : log.status === "ENROLLED"
                          ? "Enrolled"
                          : "Failed"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-slate-200/60 bg-slate-50 text-slate-500">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="truncate text-xs font-semibold text-slate-800">
                        {log.userName || "Anonymous"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {log.apiKeyName ? (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-700">
                        <Key className="h-3 w-3 shrink-0 text-slate-400" />
                        <span className="max-w-25 truncate font-medium sm:max-w-32.5">
                          {log.apiKeyName}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                    {log.score != null
                      ? `${(log.score * 100).toFixed(1)}%`
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-xs text-slate-500">
                    {formatRelativeTime(log.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
