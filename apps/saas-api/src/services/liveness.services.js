import * as livenessRepository from "../repositories/liveness.repository.js";

export async function enrollUser(adminId, name, descriptor, apiKeyId = null) {
  const enrolledUser = await livenessRepository.addUser(
    adminId,
    name,
    descriptor,
    apiKeyId,
  );

  await livenessRepository.addVerificationLog(
    adminId,
    enrolledUser.id,
    enrolledUser.name,
    1.0,
    "ENROLLED",
    apiKeyId,
  );

  return enrolledUser;
}

export const COSINE_SIMILARITY_THRESHOLD = 0.95;
export const EUCLIDEAN_DISTANCE_THRESHOLD = 0.3;

export async function verifyUser(
  descriptor,
  adminId,
  metric = "both",
  apiKeyId = null,
) {
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
      Number(match.similarity) >= COSINE_SIMILARITY_THRESHOLD &&
      Number(match.distance) <= EUCLIDEAN_DISTANCE_THRESHOLD;

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
    apiKeyId,
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
  return responsePayload;
}

export async function verifyUserById(
  descriptor,
  targetId,
  adminId,
  metric = "both",
  apiKeyId = null,
) {
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
      Number(match.similarity) >= COSINE_SIMILARITY_THRESHOLD &&
      Number(match.distance) <= EUCLIDEAN_DISTANCE_THRESHOLD;

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
    apiKeyId,
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
  return responsePayload;
}
