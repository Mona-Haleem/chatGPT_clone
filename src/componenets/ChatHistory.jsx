import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChat } from '../store/slices/chatSlice';

const ChatHistory = () => {
  const chats = useSelector(state => state.chat.chats);
  const currentChat = useSelector(state => state.chat.currentChat);
  const dispatch = useDispatch();
  

  return (
    <aside className="chat-history">
      <div className="chat-history-header">
        <h2>Chat History</h2>
        <button onClick={() => dispatch(setCurrentChat(null))}>+</button>
      </div>
      <ul>
        {chats && Object.keys(chats).reverse().map((chatId) => (
          <li key={chatId} className={currentChat == chatId?'selected':''}>
            <button onClick={() => dispatch(setCurrentChat(chatId))}>
              {chats[chatId][1]? (
                    Array.isArray(chats[chatId][0].content) ? (
                      chats[chatId][0].content[0].text || chats[chatId][0].content[1]?.text 
                    ) : (
                      chats[chatId][0].content
                    )
                  ) : (
                    'New Chat'
                  )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ChatHistory;