import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smart-backend-1-q3fb.onrender.com';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Route-Aware Token Injection
api.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem('adminToken');
        const studentToken = localStorage.getItem('token') || localStorage.getItem('studentToken');

        const isAdminRoute = config.url && (config.url.startsWith('/admin') || config.url.includes('/admin/'));

        const token = isAdminRoute
            ? (adminToken || studentToken)
            : (studentToken || adminToken);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Safe 401 Token Expiration Redirection
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath.includes('signin') || currentPath.includes('login') || currentPath.includes('signup') || currentPath.includes('forgot');

            if (!isAuthPage) {
                if (currentPath.startsWith('/admin')) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    window.location.href = '/admin/login';
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('studentToken');
                    window.location.href = '/signin';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
