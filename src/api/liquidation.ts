// src/api/liquidation.ts
import apiClient from "./axios";
import { LiquidationCreateRequest } from "./types";

export const liquidationApi = {
  createLiquidation: async (payload: LiquidationCreateRequest) => {
    const resp = await apiClient.post("/liquidation", payload);
    return resp.data;
  },

  getDistributorSummary: async (distributorId: string) => {
    const resp = await apiClient.get(`/liquidation/distributor/${distributorId}/summary`);
    return resp.data;
  },

  getRetailerDetails: async (retailerId: string) => {
    const resp = await apiClient.get(`/liquidation/retailer/${retailerId}`);
    return resp.data;
  },

  // advanced
  submitEsign: async (id: string, esignUrl: string) => {
    const resp = await apiClient.post(`/liquidation/${id}/esign`, { esignUrl });
    return resp.data;
  },

  verifyEsign: async (id: string, verified: boolean, remarks?: string) => {
    const resp = await apiClient.post(`/liquidation/${id}/verify`, { verified, remarks });
    return resp.data;
  },

  requestReturn: async (id: string, payload: { reason: string; evidence?: any[] }) => {
    const resp = await apiClient.post(`/liquidation/${id}/return/request`, payload);
    return resp.data;
  },

  decideReturn: async (id: string, approve: boolean, remarks?: string) => {
    const resp = await apiClient.post(`/liquidation/${id}/return/decision`, { approve, remarks });
    return resp.data;
  },

  adminOverride: async (id: string, payload: any) => {
    const resp = await apiClient.post(`/liquidation/${id}/override`, payload);
    return resp.data;
  },
};
