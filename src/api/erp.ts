// src/api/erp.ts
import apiClient from "./axios";

export const erpApi = {
  push: async (payload: any, sharedSecret?: string) => {
    // ERP pushes directly (server-to-server). If called from frontend for testing, include header (not recommended in prod)
    const headers: any = {};
    if (sharedSecret) headers["x-erp-secret"] = sharedSecret;
    const resp = await apiClient.post("/erp/push", payload, { headers });
    return resp.data;
  },

  triggerSync: async () => {
    const resp = await apiClient.post("/erp/sync");
    return resp.data;
  },

  jobs: async () => {
    const resp = await apiClient.get("/erp/jobs");
    return resp.data;
  },
};
