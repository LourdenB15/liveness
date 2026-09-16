// src/services/api.js

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");
const ADMIN_KEY = "liveness_admin";
const TOKEN_KEY = "liveness_token";

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    if (response.status === 204) return null;
    let errorMessage = "Request failed";
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // response wasn't JSON
    }

    // Auto-handle expired or unauthorized session (except login/signup where 401 indicates invalid credentials)
    if (
      (response.status === 401 || response.status === 403) &&
      !endpoint.includes("/login") &&
      !endpoint.includes("/signup")
    ) {
      localStorage.removeItem(ADMIN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(
        new CustomEvent("auth:expired", { detail: { message: errorMessage } }),
      );
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  auth: {
    signup: async (username, password, firstName, lastName, email) => {
      const result = await request("/dashboard/signup", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          email,
        }),
      });
      if (result?.token) {
        localStorage.setItem(TOKEN_KEY, result.token);
      }
      const { token: _TOKEN, ...admin } = result || {};
      localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
      window.dispatchEvent(new CustomEvent("auth:login", { detail: admin }));
      return admin;
    },
    login: async (username, password) => {
      const result = await request("/dashboard/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      if (result?.token) {
        localStorage.setItem(TOKEN_KEY, result.token);
      }
      const { token: _TOKEN, ...admin } = result || {};
      localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
      window.dispatchEvent(new CustomEvent("auth:login", { detail: admin }));
      return admin;
    },
    logout: async () => {
      try {
        await request("/dashboard/logout", { method: "POST" });
      } catch (err) {
        console.warn("Logout request failed:", err);
      } finally {
        localStorage.removeItem(ADMIN_KEY);
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new CustomEvent("auth:expired"));
      }
    },
    getCurrentUser: () => {
      try {
        const saved = localStorage.getItem(ADMIN_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch {
        localStorage.removeItem(ADMIN_KEY);
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
    },
    me: () => request("/dashboard/me"),
    forgotPassword: (email) =>
      request("/dashboard/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    resetPassword: (token, newPassword) =>
      request("/dashboard/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      }),
    changePassword: (currentPassword, newPassword) =>
      request("/dashboard/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
    updateProfile: async (firstName, lastName) => {
      const updatedUser = await request("/dashboard/profile", {
        method: "PUT",
        body: JSON.stringify({ firstName, lastName }),
      });
      const saved = JSON.parse(localStorage.getItem(ADMIN_KEY));
      localStorage.setItem(
        ADMIN_KEY,
        JSON.stringify({ ...saved, ...updatedUser }),
      );
      return updatedUser;
    },
  },

  users: {
    list: () => request("/dashboard/users"),
    delete: (id) =>
      request(`/dashboard/users/${id}`, {
        method: "DELETE",
      }),
  },

  logs: {
    list: () => request("/dashboard/logs"),
  },

  apiKeys: {
    list: () => request("/dashboard/api-keys"),
    create: (name) =>
      request("/dashboard/api-keys", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    delete: (id) =>
      request(`/dashboard/api-keys/${id}`, {
        method: "DELETE",
      }),
  },

  stats: {
    getOverview: () => request("/dashboard/stats"),
  },

  system: {
    getHealth: () => {
      const healthUrl = API_BASE_URL.endsWith("/api")
        ? `${API_BASE_URL.slice(0, -4)}/health`
        : `${API_BASE_URL}/health`;
      return fetch(healthUrl).then((res) => res.json());
    },
  },
};
