import { BarChart3, CheckCircle2, Users } from "lucide-react";
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
    const fetchStats = async () => {
      try {
        const data = await api.stats.getOverview();
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
          database: health.database === "connected" ? "Connected" : "Disconnected",
        });
      } catch (error) {
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
      bg: "bg-blue-100",
    },
    {
      label: "Verification Checks",
      value: stats.totalChecks,
      icon: BarChart3,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Pass Rate",
      value: `${stats.passRate.toFixed(1)}%`,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center">
              <div className={`rounded-lg ${card.bg} p-3`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {card.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-800">System Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <span className="text-sm font-medium text-slate-600">
              API Status
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                systemStatus.api === "Operational"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {systemStatus.api}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <span className="text-sm font-medium text-slate-600">
              Database Connectivity
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                systemStatus.database === "Connected"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {systemStatus.database}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Environment
            </span>
            <span className="text-sm font-semibold text-slate-900 capitalize">
              {import.meta.env.MODE}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
