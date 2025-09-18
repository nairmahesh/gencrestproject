const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const getAuthToken = () => {
 return localStorage.getItem('accessToken');
};

const refreshToken = async () => {
 const currentRefreshToken = localStorage.getItem('refreshToken');
 if (!currentRefreshToken) {
  throw new Error('No refresh token available');
 }

 const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({ refreshToken: currentRefreshToken }),
 });

 if (!response.ok) {
  // Handle session expiry, e.g., redirect to login
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
  throw new Error('Session expired');
 }

 const data = await response.json();
 localStorage.setItem('accessToken', data.accessToken);
 localStorage.setItem('refreshToken', data.refreshToken);
 return data.accessToken;
};


const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
 let token = getAuthToken();

 // Ensure headers is always an object and explicitly type it
 const headers: Record<string, string> = {
  ...(typeof options.headers === 'object' && !Array.isArray(options.headers) ? options.headers as Record<string, string> : {}),
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
 };
 options.headers = headers;

 let response = await fetch(`${API_BASE_URL}${url}`, options);

 if (response.status === 403 || response.status === 401) { // Handle both forbidden and unauthorized
  try {
    token = await refreshToken();
    headers['Authorization'] = `Bearer ${token}`;
    options.headers = headers;
    response = await fetch(`${API_BASE_URL}${url}`, options); // Retry the request with the new token
  } catch (error) {
    // If refresh fails, redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
 }

 return response;
};

export const api = {
 login: async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify(credentials),
  });
  if (!response.ok) {
   throw new Error('Login failed');
  }
  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
 },

 logout: async () => {
  // We'll also need to call the backend endpoint if it handles token blacklisting
  await fetchWithAuth('/auth/logout', { method: 'POST' });
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
 },

 getUserProfile: async () => {
  const token=getAuthToken();
  if(token===null) return;
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
   method: 'GET',
   headers: {
    'Authorization': `Bearer ${token}`,
   }
  });
  if (!response.ok) {
   throw new Error('Login failed');
  }
  const data = await response.json();
  return data.user;
 },

 getDistributors: async () => {
  const response = await fetchWithAuth('/liquidation/distributors');
  if (!response.ok) {
   throw new Error('Failed to fetch distributors');
  }
  return response.json();
 },

 getMdoSummary: async (month?: string) => {
    let url = '/mdo/activities/summary';
    if (month) {
      url += `?month=${month}`; // e.g., month = "2025-09"
    }
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch MDO summary');
    }
    return response.json();
  },

  getTsmDashboardStats: async () => {
    const response = await fetchWithAuth('/tsm/dashboard');
    if (!response.ok) {
        throw new Error('Failed to fetch TSM dashboard stats');
    }
    return response.json();
  },

  getDistributorDetails: async (distributorId: string) => {
    const response = await fetchWithAuth(`/liquidation/distributors/${distributorId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch distributor details');
    }
    return response.json();
  },

  getRetailersByDistributor: async (distributorId: string) => {
    const response = await fetchWithAuth(`/liquidation/retailers?distributorId=${distributorId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch retailers');
    }
    return response.json();
  },

  updateDistributorStock: async (distributorId: string, payload: any) => {
    const response = await fetchWithAuth(`/liquidation/distributors/${distributorId}/stock`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update stock');
    }
    return response.json();
  },
  
  // --- New functions for Planning and Activity Logging ---

  getPlansForUser: async (userId: string) => {
    const response = await fetchWithAuth(`/planning/user/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch plans');
    }
    return response.json();
  },

  updateMdoActivity: async (activityId: string, payload: any) => {
    const response = await fetchWithAuth(`/mdo/activities/${activityId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to update activity');
    }
    return response.json();
  }
};