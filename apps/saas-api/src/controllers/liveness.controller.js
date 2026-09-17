import * as livenessServices from "../services/liveness.services.js";
import { z } from "zod";

const commonPayload = {
  descriptor: z
    .array(z.number().finite("Descriptor values must be finite numbers"))
    .length(128, "Descriptor must be exactly 128 dimensions"),
  sessionToken: z
    .string()
    .trim()
    .min(1, "Session token is required")
    .max(128, "Session token must not exceed 128 characters"),
  timestamp: z.number(),
  challenges: z
    .array(z.string().trim().max(50))
    .min(1, "Challenges are required")
    .max(10, "Exceeded maximum allowed challenges"),
  integrity: z
    .string()
    .trim()
    .min(1, "Integrity hash is required")
    .max(128, "Integrity hash must not exceed 128 characters"),
};

const enrollSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must not exceed 255 characters"),
  ...commonPayload,
});

const verifySchema = z.object({
  ...commonPayload,
  metric: z.enum(["cosine", "euclidean"]).optional(),
});

const verifyByIdSchema = z.object({
  ...commonPayload,
  targetId: z.string().uuid("targetId must be a valid UUID"),
  metric: z.enum(["cosine", "euclidean"]).optional(),
});

export async function enrollUser(req, res) {
  const validation = enrollSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const { name, descriptor } = validation.data;
  const adminId = req.adminId;
  const apiKeyId = req.apiKeyId || null;
  try {
    const enrolledUser = await livenessServices.enrollUser(
      adminId,
      name,
      descriptor,
      apiKeyId,
    );
    res.status(201).json(enrolledUser);
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ error: "Failed to enroll user." });
  }
}

export async function verifyUser(req, res) {
  const validation = verifySchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const adminId = req.adminId;
  const apiKeyId = req.apiKeyId || null;
  const { descriptor, metric } = validation.data;
  try {
    const responsePayload = await livenessServices.verifyUser(
      descriptor,
      adminId,
      metric,
      apiKeyId,
    );
    res.json(responsePayload);
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Failed to verify identity." });
  }
}

export async function verifyUserById(req, res) {
  const validation = verifyByIdSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const adminId = req.adminId;
  const apiKeyId = req.apiKeyId || null;
  const { descriptor, targetId, metric } = validation.data;
  try {
    const responsePayload = await livenessServices.verifyUserById(
      descriptor,
      targetId,
      adminId,
      metric,
      apiKeyId,
    );
    res.json(responsePayload);
  } catch (error) {
    console.error("1:1 verification error:", error);
    res.status(500).json({ error: "Failed to verify identity." });
  }
}
