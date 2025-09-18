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

 if (response.status === 403) {
  // Token expired, try to refresh
  token = await refreshToken();
  headers['Authorization'] = `Bearer ${token}`;
  options.headers = headers;
  response = await fetch(`${API_BASE_URL}${url}`, options); // Retry the request with the new token
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
};