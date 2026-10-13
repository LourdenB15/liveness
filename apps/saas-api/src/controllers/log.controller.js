import * as logServices from "../services/log.service.js";

export async function getLogs(req, res) {
  const adminId = req.user.id;
  const limitParam = req.query.limit;
  const limit =
    limitParam && !isNaN(parseInt(limitParam, 10))
      ? parseInt(limitParam, 10)
      : null;
  try {
    const logs = await logServices.getLogs(adminId, limit);
    res.json(logs);
  } catch (error) {
    console.error("Logs history error:", error);
    res.status(500).json({ error: "Failed to fetch logs." });
  }
}
