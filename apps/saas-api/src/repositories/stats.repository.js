import pool from "../db.js";

export async function getUsersCount(adminId) {
  const usersCount = await pool.query(
    "SELECT COUNT(*) FROM users WHERE admin_id = $1",
    [adminId],
  );
  return usersCount.rows[0].count;
}

export async function getLogsCount(adminId) {
  const logsCount = await pool.query(
    "SELECT COUNT(*) FROM verification_logs WHERE admin_id = $1",
    [adminId],
  );
  return logsCount.rows[0].count;
}

export async function getSuccessLogsCount(adminId) {
  const successLogsCount = await pool.query(
    "SELECT COUNT(*) FROM verification_logs WHERE admin_id = $1 AND status = 'SUCCESS'",
    [adminId],
  );
  return successLogsCount.rows[0].count;
}

export async function getDetailedStats(adminId) {
  const result = await pool.query(
    `SELECT 
       COUNT(*)::int AS "totalChecks",
       COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END)::int AS "passedChecks",
       COUNT(CASE WHEN status = 'FAILURE' THEN 1 END)::int AS "failedChecks",
       COUNT(CASE WHEN status = 'ENROLLED' THEN 1 END)::int AS "enrolledChecks",
       COALESCE(AVG(CASE WHEN status = 'SUCCESS' THEN score END), 0)::float AS "avgConfidence"
     FROM verification_logs
     WHERE admin_id = $1`,
    [adminId],
  );
  return result.rows[0];
}

export async function getTimelineStats(adminId, days = 7) {
  const intervalDays = Math.max(days - 1, 1).toString();
  const result = await pool.query(
    `WITH date_series AS (
       SELECT generate_series(
         CURRENT_DATE - ($2::text || ' days')::interval,
         CURRENT_DATE,
         '1 day'::interval
       )::date AS day
     )
     SELECT 
       TO_CHAR(ds.day, 'YYYY-MM-DD') AS "date",
       TO_CHAR(ds.day, 'Mon DD') AS "label",
       COUNT(vl.id)::int AS "total",
       COUNT(CASE WHEN vl.status = 'SUCCESS' THEN 1 END)::int AS "passed",
       COUNT(CASE WHEN vl.status = 'FAILURE' THEN 1 END)::int AS "failed",
       COUNT(CASE WHEN vl.status = 'ENROLLED' THEN 1 END)::int AS "enrolled"
     FROM date_series ds
     LEFT JOIN verification_logs vl 
       ON vl.timestamp::date = ds.day AND vl.admin_id = $1
     GROUP BY ds.day
     ORDER BY ds.day ASC`,
    [adminId, intervalDays],
  );
  return result.rows;
}
