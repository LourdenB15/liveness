import { ArrowRight, Server } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActionsAndStatus({ shortcuts, systemStatus }) {
  return (
    <div className="space-y-6 lg:col-span-1">
      {/* Console Shortcuts */}
      <div className="rounded-[10px] border border-slate-200/80 bg-white p-5 shadow-xs">
        <h2 className="font-heading mb-3.5 text-sm font-bold text-slate-900">
          Console Shortcuts
        </h2>
        <div className="divide-y divide-slate-100">
          {shortcuts.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className="group flex items-center justify-between py-2.5 transition-colors first:pt-0 last:pb-0 hover:text-[#2f5bf5]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200/70 bg-slate-50 text-slate-500 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-[#2f5bf5]">
                  <action.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 transition-colors group-hover:text-[#2f5bf5]">
                    {action.title}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {action.description}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#2f5bf5]" />
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="rounded-[10px] border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-heading flex items-center gap-2 text-sm font-bold text-slate-900">
            <Server className="h-4 w-4 text-[#2f5bf5]" />
            System Status
          </h2>
          <span className="font-mono text-[11px] font-semibold text-slate-500">
            {import.meta.env.MODE.toUpperCase()}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  systemStatus.api === "Operational"
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                }`}
              />
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  API Server
                </p>
                <p className="text-[10px] text-slate-500">Node.js / Express</p>
              </div>
            </div>
            <span
              className={`rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                systemStatus.api === "Operational"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {systemStatus.api}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  systemStatus.database === "Connected"
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                }`}
              />
              <div>
                <p className="text-xs font-semibold text-slate-900">Database</p>
                <p className="text-[10px] text-slate-500">PostgreSQL</p>
              </div>
            </div>
            <span
              className={`rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                systemStatus.database === "Connected"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {systemStatus.database}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
