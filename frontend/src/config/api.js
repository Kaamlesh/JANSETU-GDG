// Centralized API configuration for JanDrishti AI
// Supports Vercel deployment, Render backend, and local Vite dev proxy

const ENV_API_URL = import.meta.env.VITE_API_URL;
const IS_PROD = import.meta.env.PROD;

// Default production backend on Render
const DEFAULT_PROD_API = 'https://jansetu-gdg.onrender.com';

export const API_BASE_URL = (
  ENV_API_URL && ENV_API_URL.trim() !== ''
    ? ENV_API_URL
    : (IS_PROD ? DEFAULT_PROD_API : '')
).replace(/\/$/, '');

/**
 * Normalizes an API route to the full target URL (or relative proxy in dev)
 * e.g. getApiUrl('/api/health') => 'https://jansetu-gdg.onrender.com/api/health' in prod
 */
export const getApiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

export default {
  API_BASE_URL,
  getApiUrl
};
