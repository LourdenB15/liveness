import { Activity, Shield, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChecks: 0,
    passRate: 0,
  });

  const [systemStatus, setSystemStatus] = useState({
    api: "Checking...",
    database: "Checking...",
  });

  useEffect(() => {
    const user = api.auth.getCurrentUser();
    
    const fetchStats = async () => {
      if (!user) return;
      try {
        const data = await api.stats.getOverview(user.id);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    const fetchHealth = async () => {
      try {
        const health = await api.system.getHealth();
        setSystemStatus({
          api: health.status === "ok" ? "Operational" : "Error",
          database:
            health.database === "connected" ? "Connected" : "Disconnected",
        });
      } catch {
        setSystemStatus({
          api: "Offline",
          database: "Unknown",
        });
      }
    };

    fetchStats();
    fetchHealth();

    const interval = setInterval(fetchHealth, 30000); // Check health every 30s
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Successfully enrolled identities",
    },
    {
      label: "Verification Checks",
      value: stats.totalChecks.toLocaleString(),
      icon: Activity,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      description: "Liveness requests processed",
    },
    {
      label: "Pass Rate",
      value: `${stats.passRate.toFixed(1)}%`,
      icon: Shield,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Successful validation ratio",
    },
  ];

  return (
    <div className="animate-in fade-in space-y-10 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Console Overview
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Real-time performance and system health
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-2 shadow-sm">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs font-bold tracking-wider text-slate-600 uppercase">
            System Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="group rounded-4xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
          >
            <div className="flex items-start justify-between">
              <div
                className={`rounded-2xl ${card.bg} p-4 transition-transform group-hover:scale-110`}
              >
                <card.icon className={`h-7 w-7 ${card.color}`} />
              </div>
              <Zap className="h-5 w-5 text-slate-100 transition-colors group-hover:text-amber-400" />
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                {card.label}
              </p>
              <h3 className="mt-2 text-4xl font-black text-slate-900">
                {card.value}
              </h3>
              <p className="mt-2 text-xs font-medium text-slate-500">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-50 bg-slate-50/30 px-8 py-6">
          <h3 className="text-lg font-bold text-slate-900">
            Infrastructure Health
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`h-3 w-3 rounded-full ${systemStatus.api === "Operational" ? "bg-emerald-500" : "bg-red-500"}`}
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    API Gateway
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Global endpoint availability
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-black tracking-wider uppercase ${
                  systemStatus.api === "Operational"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {systemStatus.api}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`h-3 w-3 rounded-full ${systemStatus.database === "Connected" ? "bg-emerald-500" : "bg-red-500"}`}
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Vector Engine
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Database connectivity & search
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-black tracking-wider uppercase ${
                  systemStatus.database === "Connected"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {systemStatus.database}
              </span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-xs font-bold tracking-widest text-slate-400 uppercase">
            <span>
              Environment:{" "}
              <span className="text-blue-600">{import.meta.env.MODE}</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>
              Region: <span className="text-blue-600">Global-Edge</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
