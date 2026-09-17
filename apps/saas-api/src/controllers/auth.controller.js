import { z } from "zod";
import * as authServices from "../services/auth.service.js";

const passwordComplexitySchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(72, "Password must not exceed 72 characters")
  .regex(/[A-Z]/, "Password must have at least 1 upper case.")
  .regex(/[a-z]/, "Password must have at least 1 lower case.")
  .regex(/[0-9]/, "Password must have at least 1 number.");

const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(255, "Username must not exceed 255 characters"),
  password: passwordComplexitySchema,
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(255, "First name must not exceed 255 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(255, "Last name must not exceed 255 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters"),
});

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(255, "Username must not exceed 255 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must not exceed 72 characters"),
});

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: passwordComplexitySchema,
});

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Password is required")
    .max(72, "Password must not exceed 72 characters"),
  newPassword: passwordComplexitySchema,
});

export async function signup(req, res) {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }

  const { username, password, firstName, lastName, email } = validation.data;

  try {
    const result = await authServices.signup(
      username,
      password,
      firstName,
      lastName,
      email,
    );

    const { token, ...admin } = result;
    const sameSitePolicy = process.env.COOKIE_SAME_SITE || "lax";

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSitePolicy,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json(admin);
  } catch (error) {
    if (error.code === "23505") {
      if (error.detail.includes("username")) {
        return res.status(409).json({ error: "Username already exists" });
      }
      if (error.detail.includes("email")) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create administrator account" });
  }
}

export async function login(req, res) {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }

  const { username, password } = validation.data;

  try {
    const result = await authServices.login(username, password);
    const { token, ...admin } = result;
    const sameSitePolicy = process.env.COOKIE_SAME_SITE || "lax";
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSitePolicy,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json(admin);
  } catch (error) {
    console.error("Login error:", error);
    if (error.status === 401) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "An error occurred during login" });
  }
}

export async function forgotPassword(req, res) {
  const validation = forgotPasswordSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const { email } = validation.data;
  try {
    await authServices.forgotPassword(email);
  } catch (error) {
    console.error("Forgot password error:", error);
  }
  res.json({
    message: "If that email is registered, a reset link has been sent.",
  });
}

export async function resetPassword(req, res) {
  const validation = resetPasswordSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const { token, newPassword } = validation.data;
  try {
    await authServices.resetPassword(token, newPassword);
    res.status(204).send();
  } catch (error) {
    console.error("Reset password error:", error);
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to reset password." });
  }
}

export async function changePassword(req, res) {
  const adminId = req.user.id;
  const validation = changePasswordSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const { currentPassword, newPassword } = validation.data;
  try {
    await authServices.changePassword(adminId, currentPassword, newPassword);
    res.status(204).send();
  } catch (error) {
    console.error("Error changing password:", error);
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to change password." });
  }
}

const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(255, "First name must not exceed 255 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(255, "Last name must not exceed 255 characters"),
});

export async function updateProfile(req, res) {
  const adminId = req.user.id;
  const validation = updateProfileSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }
  const { firstName, lastName } = validation.data;
  try {
    const updatedAdmin = await authServices.updateProfile(
      adminId,
      firstName,
      lastName,
    );
    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update profile." });
  }
}

export async function logout(req, res) {
  const sameSitePolicy = process.env.COOKIE_SAME_SITE || "lax";
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: sameSitePolicy,
  });
  res.status(204).send();
}

export async function me(req, res) {
  try {
    const admin = await authServices.getCurrentUser(req.user.id);
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching current user:", error);
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch current user." });
  }
}
