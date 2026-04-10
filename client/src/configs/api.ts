import axios from 'axios';

/** Used with split Vercel URLs: browsers often omit cross-site session cookies; JWT in Authorization fixes that. */
export const AUTH_TOKEN_KEY = 'thumblify_auth_token';

const rawBase =
    import.meta.env.VITE_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:3000';

const api = axios.create({
    baseURL: rawBase,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;