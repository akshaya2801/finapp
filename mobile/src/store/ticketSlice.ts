import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Ticket {
  id: string;
  userId: string;
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface TicketState {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  loading: boolean;
  error: string | null;
  filter: 'all' | 'open' | 'in_progress' | 'resolved' | 'closed';
  draftTickets: Partial<Ticket>[];
}

const initialState: TicketState = {
  tickets: [],
  selectedTicket: null,
  loading: false,
  error: null,
  filter: 'all',
  draftTickets: [],
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setLoading: (state: TicketState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: TicketState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTickets: (state: TicketState, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
      state.loading = false;
    },
    setSelectedTicket: (state: TicketState, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload;
    },
    addTicket: (state: TicketState, action: PayloadAction<Ticket>) => {
      state.tickets.unshift(action.payload);
    },
    updateTicketStatus: (state: TicketState, action: PayloadAction<{ ticketId: string; status: string }>) => {
      const ticket = state.tickets.find((t: Ticket) => t.id === action.payload.ticketId);
      if (ticket) {
        ticket.status = action.payload.status as any;
      }
      if (state.selectedTicket && state.selectedTicket.id === action.payload.ticketId) {
        state.selectedTicket.status = action.payload.status as any;
      }
    },
    setFilter: (state: TicketState, action: PayloadAction<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>) => {
      state.filter = action.payload;
    },
    saveDraft: (state: TicketState, action: PayloadAction<Partial<Ticket>>) => {
      state.draftTickets.push(action.payload);
    },
    removeDraft: (state: TicketState, action: PayloadAction<number>) => {
      state.draftTickets.splice(action.payload, 1);
    },
    clearDrafts: (state: TicketState) => {
      state.draftTickets = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setTickets,
  setSelectedTicket,
  addTicket,
  updateTicketStatus,
  setFilter,
  saveDraft,
  removeDraft,
  clearDrafts,
} = ticketSlice.actions;
export default ticketSlice.reducer;
