import * as apiKeyServices from "../services/api-key.service.js";
import { z } from "zod";

const apiKeySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Key name is required")
    .max(255, "Key name must not exceed 255 characters"),
});

export async function getApiKeys(req, res) {
  const adminId = req.user.id;

  try {
    const apiKeys = await apiKeyServices.getApiKeys(adminId);
    res.json(apiKeys);
  } catch (error) {
    console.error("API keys error:", error);
    res.status(500).json({ error: "Failed to fetch API keys." });
  }
}

export async function createApiKey(req, res) {
  const validation = apiKeySchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const { name } = validation.data;
  const adminId = req.user.id;
  try {
    const newKeyRecord = await apiKeyServices.createApiKey(name, adminId);
    res.status(201).json({ ...newKeyRecord });
  } catch (error) {
    console.error("API key creation error:", error);
    if (error.status === 403) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create API key." });
  }
}

const uuidSchema = z.string().uuid("Invalid API key ID format");

export async function revokeApiKey(req, res) {
  const validation = uuidSchema.safeParse(req.params.id);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const id = validation.data;
  const adminId = req.user.id;
  try {
    const revokedKey = await apiKeyServices.revokeApiKey(id, adminId);
    if (!revokedKey) {
      return res
        .status(404)
        .json({ error: "API key not found or already revoked." });
    }
    res.json(revokedKey);
  } catch (error) {
    console.error("API key revoke error:", error);
    res.status(500).json({ error: "Failed to revoke API key." });
  }
}

export async function deleteApiKey(req, res) {
  const validation = uuidSchema.safeParse(req.params.id);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const id = validation.data;
  const adminId = req.user.id;
  try {
    const deleteCount = await apiKeyServices.deleteApiKey(id, adminId);
    if (deleteCount === 0) {
      return res.status(404).json({ error: "API key not found." });
    }
    res.status(204).send();
  } catch (error) {
    console.error("API key delete error:", error);
    res.status(500).json({ error: "Failed to delete API key." });
  }
}
