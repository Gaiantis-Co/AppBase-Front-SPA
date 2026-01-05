import axios from 'axios';
import notify from './toast';

const api = axios.create({
    // @ts-ignore
    baseURL: (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:8001',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

// Interceptor para agregar Bearer token a todas las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Ocurrió un error inesperado';

        if (status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        } else if (status === 403) {
            notify.error('No tienes permisos para realizar esta acción');
        } else if (status === 422) {
            const errors = error.response.data.errors;
            if (errors) {
                // Mostrar primer error de validación
                const firstError = Object.values(errors)[0];
                notify.warning(Array.isArray(firstError) ? firstError[0] : message);
            } else {
                notify.warning(message);
            }
        } else if (status >= 500) {
            notify.error('Error en el servidor. Inténtalo más tarde.');
        } else if (error.code === 'ECONNABORTED' || !status) {
            notify.error('No se pudo conectar con el servidor');
        }

        return Promise.reject(error);
    }
);

export default api;
