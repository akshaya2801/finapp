import { create } from 'zustand';

export interface Ticket {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    ticketId: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    createdAt: string;
}

interface TicketState {
    tickets: Ticket[];
    currentTicket: Ticket | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setTickets: (tickets: Ticket[]) => void;
    setCurrentTicket: (ticket: Ticket | null) => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useTicketStore = create<TicketState>((set) => ({
    tickets: [],
    currentTicket: null,
    messages: [],
    isLoading: false,
    error: null,

    setTickets: (tickets) => set({ tickets }),
    setCurrentTicket: (ticket) => set({ currentTicket: ticket }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));
