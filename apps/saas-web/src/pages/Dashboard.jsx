import { BarChart3, CheckCircle2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChecks: 0,
    passRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await api.stats.getOverview();
      setStats(data);
    };
    fetchStats();
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
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <span className="text-sm font-medium text-slate-600">
              Model Engine
            </span>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Storage Usage
            </span>
            <span className="text-sm font-semibold text-slate-900">
              1.2 GB / 10 GB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
