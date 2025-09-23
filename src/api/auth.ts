// src/api/auth.ts
import apiClient from "./axios";
import axios from "axios";

const API_BASE =import.meta.env.VITE_APP_API_BASE || "/api";

/**
 * Simple auth service: stores access token in memory and localStorage as fallback.
 * Note: storing access token in localStorage has XSS risk; you can replace with in-memory store in production.
 */
class AuthService {
  private accessToken: string | null = null;
  private readonly storageKey = "gc_access_token";

  constructor() {
    // hydrate from localStorage (optional)
    const t = typeof window !== "undefined" ? localStorage.getItem(this.storageKey) : null;
    if (t) this.accessToken = t;
  }

  getAccessToken() {
    return this.accessToken;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    try {
      if (typeof window !== "undefined") localStorage.setItem(this.storageKey, token);
    } catch(e) {console.error(e)}
  }

  clearAccessToken() {
    this.accessToken = null;
    try {
      if (typeof window !== "undefined") localStorage.removeItem(this.storageKey);
    } catch(e) {
console.error(e)
    }
  }
}

export const authService = new AuthService();

/**
 * API calls related to auth
 */
export const authApi = {
  login: async (email: string, password: string) => {
    const resp = await axios.post(`${API_BASE}/auth/login`, { email, password }, { withCredentials: true });
    const token = resp?.data?.data?.accessToken;
    const user = resp?.data?.data?.user;
    if (token) authService.setAccessToken(token);
    return { token, user };
  },

  // refresh is handled centrally in axios interceptor via /auth/refresh using cookie
  refresh: async () => {
    const resp = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
    const token = resp?.data?.data?.accessToken;
    if (token) authService.setAccessToken(token);
    return token;
  },

  logout: async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
    } catch (e) {
      console.error(e)
    } finally {
      authService.clearAccessToken();
    }
  },

  revoke: async (refreshToken?: string) => {
    // if you have a refresh token string (rare; cookie flow usually), you may send it
    const resp = await apiClient.post("/auth/revoke", refreshToken ? { refreshToken } : {});
    authService.clearAccessToken();
    return resp.data;
  },

  me: async () => {
    const resp = await apiClient.get("/users/me");
    return resp.data;
  },
};
