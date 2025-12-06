import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Attachment {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
}

export interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  text: string;
  attachments: Attachment[];
  createdAt: string;
}

interface MessageState {
  messages: { [ticketId: string]: Message[] };
  loading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  messages: {},
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setLoading: (state: MessageState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: MessageState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMessages: (state: MessageState, action: PayloadAction<{ ticketId: string; messages: Message[] }>) => {
      state.messages[action.payload.ticketId] = action.payload.messages;
      state.loading = false;
    },
    addMessage: (state: MessageState, action: PayloadAction<{ ticketId: string; message: Message }>) => {
      if (!state.messages[action.payload.ticketId]) {
        state.messages[action.payload.ticketId] = [];
      }
      state.messages[action.payload.ticketId].push(action.payload.message);
    },
    clearMessages: (state: MessageState, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
    },
    clearAllMessages: (state: MessageState) => {
      state.messages = {};
    },
  },
});

export const { setLoading, setError, setMessages, addMessage, clearMessages, clearAllMessages } = messageSlice.actions;
export default messageSlice.reducer;
