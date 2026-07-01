import axios from 'axios';

// Single Axios instance used across the whole app.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// --- Request interceptor ---
// Attach the JWT (if present) to every outgoing request so we never have to
// pass the Authorization header manually from individual components.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor ---
// If any request comes back 401 (token missing/expired), clear the session
// and bounce the user to /login. This keeps auth handling in one place.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Avoid redirect loops if we're already on the login page.
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
