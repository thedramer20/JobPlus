// src/api/auth.api.js — the API calls Navbar depends on
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE });

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  // GET /api/auth/me — returns current user from JWT
  getMe: () => api.get('/auth/me').then(r => r.data),

  // POST /api/auth/login
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(r => r.data),

  // POST /api/auth/register
  register: (data) =>
    api.post('/auth/register', data).then(r => r.data),
};