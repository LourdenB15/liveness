import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useDashboard(timeRange) {
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChecks: 0,
    passRate: 0,
    avgConfidence: 0,
    outcomes: {
      passed: 0,
      failed: 0,
      enrolled: 0,
    },
    timeline: [],
  });

  const [recentLogs, setRecentLogs] = useState([]);
  const [apiKeysCount, setApiKeysCount] = useState(null);

  const [systemStatus, setSystemStatus] = useState({
    api: "Checking...",
    database: "Checking...",
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const [statsData, healthData, logsData, keysData] = await Promise.all([
          api.stats.getOverview(timeRange).catch(() => ({
            totalUsers: 0,
            totalChecks: 0,
            passRate: 0,
            avgConfidence: 0,
            outcomes: { passed: 0, failed: 0, enrolled: 0 },
            timeline: [],
          })),
          api.system
            .getHealth()
            .catch(() => ({ status: "error", database: "disconnected" })),
          api.logs.list().catch(() => []),
          api.apiKeys.list().catch(() => []),
        ]);

        if (!isMounted) return;

        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalChecks: statsData.totalChecks || 0,
          passRate: statsData.passRate || 0,
          avgConfidence: statsData.avgConfidence || 0,
          outcomes: statsData.outcomes || { passed: 0, failed: 0, enrolled: 0 },
          timeline: statsData.timeline || [],
        });

        setSystemStatus({
          api: healthData.status === "ok" ? "Operational" : "Offline",
          database:
            healthData.database === "connected" ? "Connected" : "Disconnected",
        });

        setRecentLogs(Array.isArray(logsData) ? logsData.slice(0, 6) : []);
        setApiKeysCount(
          Array.isArray(keysData)
            ? keysData.filter((k) => !k.revokedAt).length
            : 0,
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();

    const interval = setInterval(loadDashboardData, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [timeRange]);

  // Calculations for Activity Timeline
  const maxDaily = Math.max(
    ...(stats.timeline || []).map((t) => t.total || 0),
    1,
  );
  const totalInTimeline = (stats.timeline || []).reduce(
    (acc, d) => acc + (d.total || 0),
    0,
  );
  const passedInTimeline = (stats.timeline || []).reduce(
    (acc, d) => acc + (d.passed || 0),
    0,
  );
  const failedInTimeline = (stats.timeline || []).reduce(
    (acc, d) => acc + (d.failed || 0),
    0,
  );
  const enrolledInTimeline = (stats.timeline || []).reduce(
    (acc, d) => acc + (d.enrolled || 0),
    0,
  );

  // Calculations for Verification Performance & Breakdown
  const passedCount = stats.outcomes?.passed || 0;
  const failedCount = stats.outcomes?.failed || 0;
  const totalVerifications = passedCount + failedCount;

  const verificationPassRate =
    totalVerifications > 0
      ? ((passedCount / totalVerifications) * 100).toFixed(1)
      : "0.0";
  const verificationFailRate =
    totalVerifications > 0
      ? ((failedCount / totalVerifications) * 100).toFixed(1)
      : "0.0";

  return {
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
  };
}
