import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Try to refresh the token
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                // Retry the original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;

// API Service Functions
export const authAPI = {
    register: (data: { name: string; email: string; phone: string; password: string }) =>
        apiClient.post('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        apiClient.post('/auth/login', data),

    refresh: (refreshToken: string) =>
        apiClient.post('/auth/refresh', { refreshToken }),
};

export const ticketAPI = {
    getAll: () => apiClient.get('/tickets'),

    getById: (id: string) => apiClient.get(`/tickets/${id}`),

    create: (data: {
        title: string;
        description: string;
        category: string;
        priority: string;
    }) => apiClient.post('/tickets', data),

    updateStatus: (id: string, status: string) =>
        apiClient.patch(`/tickets/${id}/status`, { status }),
};

export const messageAPI = {
    getByTicket: (ticketId: string) =>
        apiClient.get(`/messages/${ticketId}`),

    send: (data: { ticketId: string; content: string }) =>
        apiClient.post('/messages', data),
};

export const attachmentAPI = {
    upload: (ticketId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('ticketId', ticketId);

        return apiClient.post('/attachments/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    download: (filename: string) =>
        apiClient.get(`/attachments/download/${filename}`, {
            responseType: 'blob',
        }),
};

export const profileAPI = {
    get: () => apiClient.get('/profile'),

    update: (data: { name?: string; phone?: string }) =>
        apiClient.put('/profile', data),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        apiClient.post('/profile/change-password', data),
};
