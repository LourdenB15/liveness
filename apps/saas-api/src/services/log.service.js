import * as logsRepositories from "../repositories/log.repository.js";

export async function getLogs(adminId, limit = null) {
  const logs = await logsRepositories.getLogs(adminId, limit);
  return logs;
}
