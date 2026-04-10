import axios from 'axios';

const rawBase =
    import.meta.env.VITE_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:3000';

const api = axios.create({
    baseURL: rawBase,
    withCredentials: true,
});

export default api