import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  FileText,
  Key,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MetricsGrid } from "../components/dashboard/MetricsGrid";
import { QuickActionsAndStatus } from "../components/dashboard/QuickActionsAndStatus";
import { RecentVerificationsFeed } from "../components/dashboard/RecentVerificationsFeed";
import { VerificationActivityChart } from "../components/dashboard/VerificationActivityChart";
import { VerificationPerformance } from "../components/dashboard/VerificationPerformance";
import { useDashboard } from "../hooks/useDashboard";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState(7);

  const {
    loading,
    stats,
    recentLogs,
    apiKeysCount,
    systemStatus,
    hoveredDay,
    setHoveredDay,
    maxDaily,
    totalInTimeline,
    passedInTimeline,
    failedInTimeline,
    enrolledInTimeline,
    passedCount,
    failedCount,
    totalVerifications,
    verificationPassRate,
    verificationFailRate,
  } = useDashboard(timeRange);

  const cards = [
    {
      label: "Registered Users",
      value: (stats.totalUsers || 0).toLocaleString(),
      description: "Enrolled biometric profiles",
    },
    {
      label: "Verification Volume",
      value: (stats.totalChecks || 0).toLocaleString(),
      description: "All-time verification checks",
    },
    {
      label: "Validation Pass Rate",
      value: `${(stats.passRate || 0).toFixed(1)}%`,
      description: "Passed vs total runs",
    },
    {
      label: "Avg Match Confidence",
      value:
        stats.avgConfidence > 0
          ? `${(stats.avgConfidence || 0).toFixed(1)}%`
          : "—",
      description: "Mean cosine similarity score",
    },
  ];

  const shortcuts = [
    {
      title: "API Keys",
      description:
        apiKeysCount === null
          ? "Manage credentials"
          : `${apiKeysCount} active key${apiKeysCount === 1 ? "" : "s"}`,
      to: "/api-keys",
      icon: Key,
    },
    {
      title: "Identities",
      description: `${stats.totalUsers || 0} registered profile${stats.totalUsers === 1 ? "" : "s"}`,
      to: "/users",
      icon: Users,
    },
    {
      title: "Verification Logs",
      description: "Inspect full audit trail",
      to: "/logs",
      icon: FileText,
    },
    {
      title: "SDK Documentation",
      description: "Integration guide & API routes",
      to: "/docs",
      icon: ExternalLink,
    },
  ];

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Console Overview
          </h1>
          <p className="mt-1 max-w-2xl text-sm font-medium text-slate-600">
            Biometric verification metrics, activity timelines, and platform
            health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time range selector */}
          <div
            role="group"
            aria-label="Time range selector"
            className="flex items-center rounded-md border border-slate-200/80 bg-slate-100/70 p-0.5 text-xs font-semibold text-slate-600"
          >
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                type="button"
                aria-pressed={timeRange === days}
                onClick={() => setTimeRange(days)}
                className={`cursor-pointer rounded-sm px-2.5 py-1 font-mono text-xs transition-all ${
                  timeRange === days
                    ? "bg-white font-bold text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {days}D
              </button>
            ))}
          </div>

          <Link
            to="/api-keys"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            <Key className="h-3.5 w-3.5 text-slate-400" />
            <span>API Keys</span>
          </Link>
          <Link
            to="/docs"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            <span>Docs</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Onboarding callout if 0 keys exist */}
      {!loading && apiKeysCount === 0 && (
        <div className="flex flex-col justify-between gap-3 rounded-[10px] border border-blue-200 bg-blue-50/60 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold text-blue-900">
              Next Step: Create an API Key
            </p>
            <p className="mt-0.5 text-xs text-blue-700">
              Generate your first API key to authenticate liveness checks from
              your web or mobile app.
            </p>
          </div>
          <Link
            to="/api-keys"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#2f5bf5] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#204be8]"
          >
            <span>Create API Key</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Primary KPI Metrics Grid (4 columns) */}
      <MetricsGrid loading={loading} cards={cards} />

      {/* Row 2: Verification Activity Chart & Outcome Distribution Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Verification Activity Histogram */}
        <VerificationActivityChart
          loading={loading}
          stats={stats}
          timeRange={timeRange}
          hoveredDay={hoveredDay}
          setHoveredDay={setHoveredDay}
          maxDaily={maxDaily}
          totalInTimeline={totalInTimeline}
          passedInTimeline={passedInTimeline}
          failedInTimeline={failedInTimeline}
          enrolledInTimeline={enrolledInTimeline}
        />

        {/* Right 1 Col: Verification Performance */}
        <VerificationPerformance
          verificationPassRate={verificationPassRate}
          verificationFailRate={verificationFailRate}
          totalVerifications={totalVerifications}
          passedCount={passedCount}
          failedCount={failedCount}
          totalUsers={stats.totalUsers}
        />
      </div>

      {/* Row 3: Recent Verifications Feed (Left) & Console Shortcuts + Status (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Recent Verifications Feed */}
        <div className="space-y-6 lg:col-span-2">
          <RecentVerificationsFeed loading={loading} recentLogs={recentLogs} />
        </div>

        {/* Right 1 Col: Quick Actions & System Status */}
        <QuickActionsAndStatus
          shortcuts={shortcuts}
          systemStatus={systemStatus}
        />
      </div>
    </div>
  );
}
