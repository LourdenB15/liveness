// src/services/api.js

const API_BASE_URL = "http://localhost:3000/api";
const ADMIN_KEY = "liveness_admin";

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
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
    signup: (username, password, firstName, lastName, email) =>
      request("/dashboard/signup", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          email,
        }),
      }),
    login: async (username, password) => {
      const admin = await request("/dashboard/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
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
        window.dispatchEvent(new CustomEvent("auth:expired"));
      }
    },
    getCurrentUser: () => {
      try {
        const saved = localStorage.getItem(ADMIN_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch {
        localStorage.removeItem(ADMIN_KEY);
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

  webhooks: {
    list: () => request("/dashboard/webhooks"),
    create: (url) =>
      request("/dashboard/webhooks", {
        method: "POST",
        body: JSON.stringify({ url }),
      }),
    delete: (id) =>
      request(`/dashboard/webhooks/${id}`, {
        method: "DELETE",
      }),
    logs: () => request("/dashboard/webhooks/logs"),
  },

  stats: {
    getOverview: () => request("/dashboard/stats"),
  },

  billing: {
    getTier: () => request("/dashboard/billing"),
    upgrade: () =>
      request("/dashboard/billing/upgrade", {
        method: "POST",
      }),
  },

  system: {
    getHealth: () => {
      return fetch("http://localhost:3000/health").then((res) => res.json());
    },
  },
};
