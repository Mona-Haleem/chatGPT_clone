import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chats: JSON.parse(localStorage.getItem('chats')) || {},
    currentChat: null,
    activeAgent: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
            localStorage.setItem('chats', JSON.stringify(state.chats)); 
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        editMessage: (state, action) => {
            const { chatId, messageIndex, newMessage } = action.payload;
            if (state.chats[chatId] && state.chats[chatId][messageIndex]) {
                state.chats = {...state.chats,[chatId]:state.chats[chatId].map((msg,i) => i == messageIndex?newMessage:msg).slice(0,messageIndex+1)}; 
                localStorage.setItem('chats', JSON.stringify(state.chats));
            }
        },
        addMessage: (state, action) => {
            const message = action.payload;
            const chatId = state.currentChat;
            if (!state.chats[chatId]) {
                state.chats[chatId] = [];
            }
            state.chats = {...state.chats,[chatId]:[...state.chats[chatId],message]};
            localStorage.setItem('chats', JSON.stringify(state.chats));
            console.log(state.chats[chatId]);
        },
        toggleActiveAgent: (state, action) => {
            state.activeAgent = !state.activeAgent;
        },
    }
});

export const { setChats, setCurrentChat, addMessage ,toggleActiveAgent,editMessage} = chatSlice.actions;
export default chatSlice.reducer;
