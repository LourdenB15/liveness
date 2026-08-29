import * as livenessRepository from "../repositories/liveness.repository.js";
import { triggerWebhooks } from "../services/webhook.service.js";

export async function enrollUser(adminId, name, descriptor) {
  const enrolledUser = await livenessRepository.addUser(
    adminId,
    name,
    descriptor,
  );

  await livenessRepository.addVerificationLog(
    adminId,
    enrolledUser.id,
    enrolledUser.name,
    1.0,
    "ENROLLED",
  );

  triggerWebhooks(adminId, "user.enrolled", enrolledUser);
  return enrolledUser;
}

export async function verifyUser(
  descriptor,
  threshold,
  adminId,
  metric = "both",
) {
  const cosineThreshold = typeof threshold === "number" ? threshold : 0.95;
  const euclideanThreshold = 0.3;

  const closestMatch = await livenessRepository.findClosestMatch(
    descriptor,
    adminId,
    metric,
  );

  let status = "FAILURE";
  let match = null;

  if (closestMatch.length > 0) {
    match = closestMatch[0];
    const isVerified =
      Number(match.similarity) >= cosineThreshold &&
      Number(match.distance) <= euclideanThreshold;

    if (isVerified) {
      status = "SUCCESS";
    }
  }

  await livenessRepository.addVerificationLog(
    adminId,
    match?.id || null,
    match?.name || "Unknown",
    match?.similarity || 0,
    status,
  );

  const responsePayload = {
    verified: status === "SUCCESS",
    match: match
      ? {
          id: match.id,
          name: match.name,
          similarity: Number(match.similarity),
          distance: Number(match.distance),
        }
      : null,
    status,
    metric,
  };
  triggerWebhooks(adminId, "liveness.verified", responsePayload);
  return responsePayload;
}

export async function verifyUserById(
  descriptor,
  targetId,
  threshold,
  adminId,
  metric = "both",
) {
  const cosineThreshold = typeof threshold === "number" ? threshold : 0.95;
  const euclideanThreshold = 0.3;

  const user = await livenessRepository.findMatchById(
    descriptor,
    targetId,
    adminId,
  );

  let status = "FAILURE";
  let match = null;

  if (user.length > 0) {
    match = user[0];
    const isVerified =
      Number(match.similarity) >= cosineThreshold &&
      Number(match.distance) <= euclideanThreshold;

    if (isVerified) {
      status = "SUCCESS";
    }
  }

  await livenessRepository.addVerificationLog(
    adminId,
    match?.id || null,
    match?.name || "Unknown",
    match?.similarity || 0,
    status,
  );

  const responsePayload = {
    verified: status === "SUCCESS",
    match: match
      ? {
          id: match.id,
          name: match.name,
          similarity: Number(match.similarity),
          distance: Number(match.distance),
        }
      : null,
    status,
    metric,
  };
  triggerWebhooks(adminId, "liveness.verified", responsePayload);
  return responsePayload;
}
