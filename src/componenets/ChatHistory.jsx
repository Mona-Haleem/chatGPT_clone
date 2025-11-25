import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChat } from "../store/slices/chatSlice";
import styles from "./ChatHistory.module.css";
const getMessagePreview = (message) => {
  if (!message) return "New Chat";

  if (Array.isArray(message.content)) {
    const textContent = message.content.find((item) => item.type === "text");
    return textContent?.text || message.content[0]?.text || "New Chat";
  }

  if (typeof message.content === "string") {
    return message.content.length > 50
      ? message.content.substring(0, 50) + "..."
      : message.content;
  }

  return "New Chat";
};

const ChatHistory = ({showHistory}) => {
  const { chats, currentChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const chatIds = useMemo(
    () => (chats ? Object.keys(chats).reverse() : []),
    [chats]
  );

  return (
    <aside
      className={`${styles["chat-history"]} ${showHistory?styles['open']:""}`}
      role="navigation"
      aria-label="Chat history"
    >
      <div className={styles["chat-history-header"]}>
        <h2>Chat History</h2>
        <button
          onClick={() => dispatch(setCurrentChat(null))}
          className={styles["new-chat-btn"]}
          title="Start new conversation"
          aria-label="New chat"
        >
          + New Chat
        </button>
      </div>

      <section className={styles["chat-list"]}>
        {chatIds.length === 0 ? (
          <div className={styles["empty-state"]}>
            <p>No conversations yet</p>
            <p className={styles["empty-hint"]}>
              Start chatting to create your first conversation
            </p>
          </div>
        ) : (
          <ul role="list">
            {chatIds.map((chatId) => {
              const chat = chats[chatId];
              const firstUserMessage = chat.find((msg) => msg.role === "user");
              const preview = getMessagePreview(firstUserMessage);
              const isActive = currentChat === chatId;

              return (
                <li key={chatId} className={isActive ? styles["active"] : ""}>
                  <button
                    onClick={() => dispatch(setCurrentChat(chatId))}
                    className={styles["chat-item-btn"]}
                    aria-current={isActive ? "page" : undefined}
                    title={preview}
                  >
                    <span className={styles["chat-icon"]}>💬</span>
                    <span className={styles["chat-preview"]}>{preview}</span>
                    {isActive && (
                      <span className={styles["active-indicator"]}>●</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </aside>
  );
};

export default ChatHistory;
