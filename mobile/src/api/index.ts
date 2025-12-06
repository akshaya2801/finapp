import axiosInstance from '../utils/axios';

export const authAPI = {
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    axiosInstance.post('/auth/register', data),

  login: (email: string, password: string) =>
    axiosInstance.post('/auth/login', { email, password }),

  refresh: (refreshToken: string) =>
    axiosInstance.post('/auth/refresh', { refreshToken }),
};

export const ticketAPI = {
  createTicket: (data: {
    category: string;
    title: string;
    description: string;
    priority?: string;
  }) => axiosInstance.post('/tickets', data),

  getTickets: (status?: string) =>
    axiosInstance.get('/tickets', { params: status ? { status } : {} }),

  getTicketById: (ticketId: string) =>
    axiosInstance.get(`/tickets/${ticketId}`),

  updateTicketStatus: (ticketId: string, status: string) =>
    axiosInstance.put(`/tickets/${ticketId}/status`, { status }),
};

export const messageAPI = {
  getMessages: (ticketId: string) =>
    axiosInstance.get(`/messages/ticket/${ticketId}`),

  sendMessage: (ticketId: string, text: string) =>
    axiosInstance.post(`/messages/${ticketId}`, { text }),
};

export const attachmentAPI = {
  uploadFile: (formData: FormData) =>
    axiosInstance.post('/attachments/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteAttachment: (attachmentId: string) =>
    axiosInstance.delete(`/attachments/${attachmentId}`),
};

export const deviceAPI = {
  registerDevice: (deviceId: string, fcmToken?: string) =>
    axiosInstance.post('/devices/register', { deviceId, fcmToken }),
};
