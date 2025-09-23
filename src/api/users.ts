// src/api/users.ts
import apiClient from "./axios";
import { User } from "./types";

export const usersApi = {
  createUser: async (payload: Partial<User>) => {
    const resp = await apiClient.post("/users", payload);
    return resp.data;
  },

  listUsers: async (params?: { page?: number; limit?: number; role?: string; search?: string }) => {
    const resp = await apiClient.get("/users", { params });
    return resp.data;
  },

  getMe: async () => {
    const resp = await apiClient.get("/users/me");
    return resp.data;
  },

  getUser: async (userId: string) => {
    const resp = await apiClient.get(`/users/${userId}`);
    return resp.data;
  },

  updateUser: async (userId: string, patch: Partial<User>) => {
    const resp = await apiClient.patch(`/users/${userId}`, patch);
    return resp.data;
  },

  deactivateUser: async (userId: string) => {
    const resp = await apiClient.delete(`/users/${userId}`);
    return resp.data;
  },
};
