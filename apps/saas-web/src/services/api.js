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
    list: (adminId) => request(`/dashboard/users?adminId=${adminId}`),
    delete: (id, adminId) =>
      request(`/dashboard/users/${id}?adminId=${adminId}`, {
        method: "DELETE",
      }),
  },

  logs: {
    list: (adminId) => request(`/dashboard/logs?adminId=${adminId}`),
  },

  apiKeys: {
    list: (adminId) => request(`/dashboard/api-keys?adminId=${adminId}`),
    create: (name, adminId) =>
      request("/dashboard/api-keys", {
        method: "POST",
        body: JSON.stringify({ name, adminId }),
      }),
    delete: (id, adminId) =>
      request(`/dashboard/api-keys/${id}?adminId=${adminId}`, {
        method: "DELETE",
      }),
  },

  stats: {
    getOverview: (adminId) => request(`/dashboard/stats?adminId=${adminId}`),
  },

  billing: {
    getTier: (adminId) => request(`/dashboard/billing/${adminId}`),
    upgrade: (adminId) =>
      request("/dashboard/billing/upgrade", {
        method: "POST",
        body: JSON.stringify({ adminId }),
      }),
  },

  system: {
    getHealth: () => {
      // Direct fetch for health since it's not under /api/dashboard
      return fetch("http://localhost:3000/health").then((res) => res.json());
    },
  },
};
