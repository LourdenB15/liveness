// src/services/api.js

const API_BASE_URL = "http://localhost:3000/api";
const ADMIN_KEY = "liveness_admin";

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 204) return null;
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  auth: {
    login: async (username, password) => {
      const admin = await request("/dashboard/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
      return admin;
    },
    logout: async () => {
      localStorage.removeItem(ADMIN_KEY);
    },
    getCurrentUser: () => {
      const saved = localStorage.getItem(ADMIN_KEY);
      return saved ? JSON.parse(saved) : null;
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
};
