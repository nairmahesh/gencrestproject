// src/api/activities.ts
import apiClient from "./axios";
import { ActivityCreateRequest } from "./types";

export const activitiesApi = {
  createActivity: async (payload: ActivityCreateRequest) => {
    const resp = await apiClient.post("/activities", payload);
    return resp.data;
  },

  listActivities: async (params?: any) => {
    const resp = await apiClient.get("/activities", { params });
    return resp.data;
  },

  getMyActivities: async () => {
    const resp = await apiClient.get("/activities/my");
    return resp.data;
  },

  listExceptionActivities: async (type?: string) => {
    const resp = await apiClient.get("/activities/exceptions", { params: type ? { type } : {} });
    return resp.data;
  },
};
