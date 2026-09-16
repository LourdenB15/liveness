import * as statsRepositories from "../repositories/stats.repository.js";

export async function getStats(adminId, days = 7) {
  const [usersCount, detailed, timeline] = await Promise.all([
    statsRepositories.getUsersCount(adminId),
    statsRepositories.getDetailedStats(adminId),
    statsRepositories.getTimelineStats(adminId, days),
  ]);

  const totalUsers = parseInt(usersCount, 10) || 0;
  const totalChecks = detailed?.totalChecks || 0;
  const passed = detailed?.passedChecks || 0;
  const failed = detailed?.failedChecks || 0;
  const enrolled = detailed?.enrolledChecks || 0;
  const passRate = totalChecks > 0 ? (passed / totalChecks) * 100 : 0;
  const avgConfidence = (detailed?.avgConfidence || 0) * 100;

  return {
    totalUsers,
    totalChecks,
    passRate,
    avgConfidence,
    outcomes: {
      passed,
      failed,
      enrolled,
    },
    timeline: timeline || [],
  };
}
