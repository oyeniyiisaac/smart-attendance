import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smart-backend-1-q3fb.onrender.com';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem('adminToken');
        const studentToken = localStorage.getItem('token');
        const token = adminToken || studentToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
