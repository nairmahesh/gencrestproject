/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/plans.ts
import apiClient from "./axios";
import { PlanCreateRequest } from "./types";

export const plansApi = {
  createPlan: async (payload: PlanCreateRequest) => {
    const resp = await apiClient.post("/plans", payload);
    return resp.data;
  },

  listPlans: async (params?: any) => {
    const resp = await apiClient.get("/plans", { params });
    return resp.data;
  },

  getMyPlans: async () => {
    const resp = await apiClient.get("/plans/my");
    return resp.data;
  },

  getAssignedPlans: async () => {
    const resp = await apiClient.get("/plans/assigned");
    return resp.data;
  },

  approvePlan: async (planId: string, payload: { status: "approved" | "rejected"; remarks?: string }) => {
    const resp = await apiClient.patch(`/plans/${planId}/approve`, payload);
    return resp.data;
  },

  pendingApprovals: async () => {
    const resp = await apiClient.get("/plans/pending");
    return resp.data;
  },
};
