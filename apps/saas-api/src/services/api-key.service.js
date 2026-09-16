import crypto from "crypto";
import * as apiKeyRepositories from "../repositories/api-key.repository.js";

export async function getApiKeys(adminId) {
  const apiKeys = await apiKeyRepositories.getApiKeys(adminId);
  return apiKeys;
}

export async function createApiKey(name, adminId) {
  const rawKey = `live_pk_${crypto.randomBytes(24).toString("hex")}`;
  const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const maskedKey = `live_pk_****${rawKey.slice(-4)}`;

  const newKeyRecord = await apiKeyRepositories.addApiKey(
    adminId,
    name,
    hash,
    maskedKey,
  );

  return { ...newKeyRecord, key: rawKey, isNew: true };
}

export async function deleteApiKey(id, adminId) {
  const deleteCount = await apiKeyRepositories.deleteApiKey(id, adminId);
  return deleteCount;
}

export async function findApiKeyDetails(apiKey) {
  const hash = crypto.createHash("sha256").update(apiKey).digest("hex");
  const apiKeys = await apiKeyRepositories.findByKeyHash(hash);
  if (apiKeys.length === 0) {
    const error = new Error("Invalid API key");
    error.status = 401;
    throw error;
  }

  const key = apiKeys[0];
  return {
    adminId: key.adminId,
    apiKeyId: key.id,
    keyName: key.name,
    maskedKey: key.maskedKey,
  };
}

export async function findAdminByApiKey(apiKey) {
  const details = await findApiKeyDetails(apiKey);
  return details.adminId;
}
