import axios from 'axios';

/**
 * Shared Axios instance for browser + server requests.
 * In development, Next.js proxies '/api' to the same host.
 */
export const api = axios.create({
  baseURL: '/api',   // Proxy in dev; same origin in prod
  timeout: 8000
}); 