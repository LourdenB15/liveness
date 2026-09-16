import * as statsServices from "../services/stats.service.js";

export async function getStats(req, res) {
  const adminId = req.user.id;
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 90);
  try {
    const stats = await statsServices.getStats(adminId, days);
    return res.json({ ...stats });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
}
