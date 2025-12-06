import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';


export const adminAPI = {
  login: (email: string, password: string) =>
    axios.post(`${API_BASE_URL}/auth/login`, { email, password }),

  getTickets: (token: string, status?: string) =>
    axios.get(`${API_BASE_URL}/tickets`, {
      headers: { Authorization: `Bearer ${token}` },
      params: status ? { status } : {},
    }),

  getTicketById: (ticketId: string, token: string) =>
    axios.get(`${API_BASE_URL}/tickets/${ticketId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateTicketStatus: (ticketId: string, status: string, token: string) =>
    axios.put(
      `${API_BASE_URL}/tickets/${ticketId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  getMessages: (ticketId: string, token: string) =>
    axios.get(`${API_BASE_URL}/messages/ticket/${ticketId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  sendMessage: (ticketId: string, text: string, token: string) =>
    axios.post(
      `${API_BASE_URL}/messages/${ticketId}`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    ),
};
