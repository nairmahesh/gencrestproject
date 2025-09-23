// apiService.ts

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import * as T from '../interfaces';

class GencrestApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:6001') {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Sets the JWT Bearer token for all subsequent requests.
   * Call this after a successful login.
   * @param token The JWT access token.
   */
  public setAuthToken(token: string | null): void {
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  // --- Helper to extract data from response ---
  private responseBody<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  // =================================================================
  // ---                         Auth                              ---
  // =================================================================

  public async login(data: T.AuthLoginRequest): Promise<T.AuthLoginResponse> {
    const response = await this.axiosInstance.post<T.AuthLoginResponse>('/api/auth/login', data);
    return this.responseBody(response);
  }

  public async refreshToken(): Promise<T.AuthRefreshResponse> {
    const response = await this.axiosInstance.post<T.AuthRefreshResponse>('/api/auth/refresh');
    return this.responseBody(response);
  }

  public async logout(): Promise<void> {
    await this.axiosInstance.post('/api/auth/logout');
  }

  public async revokeToken(): Promise<void> {
    await this.axiosInstance.post('/api/auth/revoke');
  }

  // =================================================================
  // ---                         Users                             ---
  // =================================================================

  public async createUser(data: T.UserCreateRequest): Promise<T.UserResponse> {
    const response = await this.axiosInstance.post<T.UserResponse>('/api/users', data);
    return this.responseBody(response);
  }

  public async listUsers(): Promise<T.UserResponse[]> {
    const response = await this.axiosInstance.get<T.UserResponse[]>('/api/users');
    return this.responseBody(response);
  }

  public async getCurrentUser(): Promise<T.UserResponse> {
    const response = await this.axiosInstance.get<T.UserResponse>('/api/users/me');
    return this.responseBody(response);
  }

  public async getUser(userId: string): Promise<T.UserResponse> {
    const response = await this.axiosInstance.get<T.UserResponse>(`/api/users/${userId}`);
    return this.responseBody(response);
  }

  public async updateUser(userId: string, data: T.UserUpdateRequest): Promise<void> {
    await this.axiosInstance.patch(`/api/users/${userId}`, data);
  }

  // =================================================================
  // ---                         Plans                             ---
  // =================================================================

  public async createPlan(data: T.PlanCreateRequest): Promise<void> {
    await this.axiosInstance.post('/api/plans', data);
  }

  public async listPlans(): Promise<T.PlanResponse[]> {
    const response = await this.axiosInstance.get<T.PlanResponse[]>('/api/plans');
    return this.responseBody(response);
  }
  
  public async getMyPlans(): Promise<any> { // Note: Response type not defined in spec
      const response = await this.axiosInstance.get('/api/plans/my');
      return this.responseBody(response);
  }

  public async getAssignedPlans(): Promise<any> { // Note: Response type not defined in spec
      const response = await this.axiosInstance.get('/api/plans/assigned');
      return this.responseBody(response);
  }

  public async approveRejectPlan(planId: string, approvalData: any): Promise<void> { // Note: Request body not defined in spec
      await this.axiosInstance.patch(`/api/plans/${planId}/approve`, approvalData);
  }
  
  public async getPendingApprovals(): Promise<any> { // Note: Response type not defined in spec
      const response = await this.axiosInstance.get('/api/plans/pending');
      return this.responseBody(response);
  }

  // =================================================================
  // ---                      Activities                           ---
  // =================================================================

  public async createActivity(data: T.ActivityCreateRequest): Promise<T.ActivityResponse> {
      const response = await this.axiosInstance.post<T.ActivityResponse>('/api/activities', data);
      return this.responseBody(response);
  }

  public async listActivities(): Promise<any> { // Note: Response type not defined in spec
      const response = await this.axiosInstance.get('/api/activities');
      return this.responseBody(response);
  }
  
  public async getMyActivities(): Promise<any> { // Note: Response type not defined in spec
      const response = await this.axiosInstance.get('/api/activities/my');
      return this.responseBody(response);
  }

  public async getExceptionActivities(): Promise<any> { // Note: Response type not defined in spec
      const response = await this.axiosInstance.get('/api/activities/exceptions');
      return this.responseBody(response);
  }

  // =================================================================
  // ---                      Liquidation                          ---
  // =================================================================

  public async createLiquidation(data: T.LiquidationCreateRequest): Promise<T.LiquidationResponse> {
      const response = await this.axiosInstance.post<T.LiquidationResponse>('/api/liquidation', data);
      return this.responseBody(response);
  }

  public async submitEsignProof(id: string, proofData: any): Promise<void> { // Note: Request body not defined in spec
      await this.axiosInstance.post(`/api/liquidation/${id}/esign`, proofData);
  }
  
  public async verifyEsign(id: string): Promise<void> {
      await this.axiosInstance.post(`/api/liquidation/${id}/verify`);
  }

  public async requestReturn(id: string): Promise<void> {
      await this.axiosInstance.post(`/api/liquidation/${id}/return/request`);
  }

  public async decideReturn(id: string, decisionData: any): Promise<void> { // Note: Request body not defined in spec
      await this.axiosInstance.post(`/api/liquidation/${id}/return/decision`, decisionData);
  }

  public async adminOverride(id: string): Promise<void> {
      await this.axiosInstance.post(`/api/liquidation/${id}/override`);
  }

  public async getDistributorSummary(distributorId: string): Promise<any> { // Note: Response type not defined in spec
      const response = await this.axiosInstance.get(`/api/liquidation/distributor/${distributorId}/summary`);
      return this.responseBody(response);
  }
  
  public async getRetailerView(retailerId: string): Promise<any> { // Note: Response type not defined in spec
      const response = await this.axiosInstance.get(`/api/liquidation/retailer/${retailerId}`);
      return this.responseBody(response);
  }

  // =================================================================
  // ---                          ERP                              ---
  // =================================================================

  public async pushErpData(data: T.ErpPushRequest): Promise<T.ErpIngestResponse> {
      const response = await this.axiosInstance.post<T.ErpIngestResponse>('/api/erp/push', data);
      return this.responseBody(response);
  }

  public async triggerErpSync(): Promise<void> {
      await this.axiosInstance.post('/api/erp/sync');
  }

  public async listErpJobs(): Promise<any> { // Note: Response type not defined in spec
      const response = await this.axiosInstance.get('/api/erp/jobs');
      return this.responseBody(response);
  }
  
  // =================================================================
  // ---                        Uploads                            ---
  // =================================================================

  public async getPresignedUrl(data: T.PresignedRequest): Promise<T.PresignedResponse> {
      const response = await this.axiosInstance.post<T.PresignedResponse>('/api/uploads/presigned', data);
      return this.responseBody(response);
  }

}

// Export a singleton instance of the service
export const apiService = new GencrestApiService();