// src/services/mockApi.js

const KEYS = {
  ADMIN: "liveness_admin",
  USERS: "liveness_users",
  LOGS: "liveness_logs",
  API_KEYS: "liveness_api_keys",
};

const INITIAL_DATA = {
  [KEYS.USERS]: [
    { id: "1", name: "John Doe", enrolledAt: new Date().toISOString() },
    { id: "2", name: "Jane Smith", enrolledAt: new Date().toISOString() },
  ],
  [KEYS.LOGS]: [
    {
      id: "1",
      userName: "John Doe",
      timestamp: new Date().toISOString(),
      score: 0.95,
      status: "SUCCESS",
    },
    {
      id: "2",
      userName: "Jane Smith",
      timestamp: new Date().toISOString(),
      score: 0.88,
      status: "SUCCESS",
    },
  ],
  [KEYS.API_KEYS]: [
    {
      id: "1",
      name: "Default Key",
      key: "live_pk_mock_123456789",
      createdAt: new Date().toISOString(),
    },
  ],
};

const storage = {
  get: (key) => JSON.parse(localStorage.getItem(key)),
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  init: () => {
    Object.entries(INITIAL_DATA).forEach(([key, value]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
  },
};

storage.init();

export const mockApi = {
  auth: {
    login: async (username, password) => {
      if (username === "admin" && password === "admin") {
        const admin = { id: "admin", username: "admin" };
        storage.set(KEYS.ADMIN, admin);
        return admin;
      }
      throw new Error("Invalid credentials");
    },
    logout: async () => storage.set(KEYS.ADMIN, null),
    getCurrentUser: () => storage.get(KEYS.ADMIN),
  },

  users: {
    list: async () => storage.get(KEYS.USERS),
    delete: async (id) => {
      const users = storage.get(KEYS.USERS).filter((u) => u.id !== id);
      storage.set(KEYS.USERS, users);
      return true;
    },
  },

  logs: {
    list: async () => storage.get(KEYS.LOGS),
  },

  apiKeys: {
    list: async () => storage.get(KEYS.API_KEYS),
    create: async (name) => {
      const keys = storage.get(KEYS.API_KEYS);
      const newKey = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        key: `live_pk_mock_${Math.random().toString(36).substr(2, 16)}`,
        createdAt: new Date().toISOString(),
      };
      storage.set(KEYS.API_KEYS, [...keys, newKey]);
      return newKey;
    },
    delete: async (id) => {
      const keys = storage.get(KEYS.API_KEYS).filter((k) => k.id !== id);
      storage.set(KEYS.API_KEYS, keys);
      return true;
    },
  },

  stats: {
    getOverview: async () => {
      const users = storage.get(KEYS.USERS);
      const logs = storage.get(KEYS.LOGS);
      return {
        totalUsers: users.length,
        totalChecks: logs.length,
        passRate:
          logs.length > 0
            ? (logs.filter((l) => l.status === "SUCCESS").length /
                logs.length) *
              100
            : 0,
      };
    },
  },
};
