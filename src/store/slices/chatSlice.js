import { createSlice } from "@reduxjs/toolkit";
import { loadChatsFromStorage, saveChatsToStorage } from "../../services/storageService";

const initialState = {
  chats: loadChatsFromStorage(),
  currentChat: "",
  activeAgent: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
      saveChatsToStorage(state.chats);
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    editMessage: (state, action) => {
      const { chatId, messageIndex, newMessage } = action.payload;
      if (!state.chats[chatId]) {
        console.warn(`Chat ${chatId} not found`);
        return;
      }

      if (!state.chats[chatId][messageIndex]) {
        console.warn(`Message at index ${messageIndex} not found`);
        return;
      }

      state.chats = {
        ...state.chats,
        [chatId]: state.chats[chatId]
          .map((msg, i) => (i === messageIndex ? newMessage : msg))
          .slice(0, messageIndex + 1),
      };

      saveChatsToStorage(state.chats);
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const chatId = state.currentChat;

      if (!chatId) {
        console.warn("Cannot add message: no active chat");
        return;
      }

      if (!state.chats[chatId]) {
        state.chats[chatId] = [];
      }
      state.chats = {
        ...state.chats,
        [chatId]: [...state.chats[chatId], message],
      };
      localStorage.setItem("chats", JSON.stringify(state.chats));
    },
    deleteChat: (state, action) => {
      const chatId = action.payload;

      const { [chatId]: _removed, ...remainingChats } = state.chats;
      state.chats = remainingChats;

      if (state.currentChat === chatId) {
        state.currentChat = null;
      }

      saveChatsToStorage(state.chats);
    },

    toggleActiveAgent: (state) => {
      state.activeAgent = !state.activeAgent;
    },
    clearAllChats: (state) => {
      state.chats = {};
      state.currentChat = null;
      saveChatsToStorage({});
    },
  },
});

export const {
  setChats,
  setCurrentChat,
  addMessage,
  editMessage,
  deleteChat,
  toggleActiveAgent,
  clearAllChats,
} = chatSlice.actions;
export default chatSlice.reducer;
