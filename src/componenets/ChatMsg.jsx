import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { useDispatch, useSelector } from "react-redux";
import { editMessage } from "../store/slices/chatSlice";
import styles from "./ChatMsg.module.css"
const renderMessageContent = (content) => {
  const html = DOMPurify.sanitize(marked(content));
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const ChatMsg = function ({ message, messageIndex, chatId, getResponse }) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.chats[chatId]);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  let normalizedMessage = useMemo(() => {
    if (Array.isArray(message.content)) {
      const textContent = message.content.find((item) => item.type === "text");
      const imageContent = message.content.find(
        (item) => item.type === "image_url"
      );
      const fileContent = message.content.find((item) => item.type === "file");

      return {
        role: message.role,
        content: textContent?.text || "",
        image: imageContent?.image_url?.url,
        file: !!fileContent,
      };
    }
    return message;
  }, [message]);

  const handleEditClick = () => {
    setEditText(normalizedMessage.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editText.trim()) {
      return;
    }

    const updatedMessage = {
      ...message,
      content: editText.trim(),
    };

    dispatch(
      editMessage({
        chatId,
        messageIndex,
        newMessage: updatedMessage,
      })
    );

    const messagesUpToEdit = messages.slice(0, messageIndex + 1);
    messagesUpToEdit[messageIndex] = updatedMessage;
    getResponse(messages.slice(0,messageIndex+1));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText("");
  };

  return (
    <div className={`chat-messages ${normalizedMessage.role}`}>
      <div className={styles["message-header"]}>
        <strong>
          {normalizedMessage.role === "user" ? "You" : "Assistant"}:
        </strong>
      </div>
      <div className={styles["message-content"]}>
        {normalizedMessage.image && (
          <img
            src={normalizedMessage.image}
            alt="Uploaded content"
            className={styles["msg-image"]}
            loading="lazy"
          />
        )}

        {normalizedMessage.file && (
          <span className="file-icon" title="File attached">
            🔗
          </span>
        )}
        {isEditing ? (
          <div className={styles["edit-message-container"]}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className={styles["edit-textarea"]}
              rows={4}
              autoFocus
              aria-label="Edit message"
            />

            <div className={styles["edit-actions"]}>
              <button
                type="button"
                onClick={handleSave}
                className={styles["save-btn"]}
                aria-label="Save changes"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={styles["cancel-btn"]}
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={styles["message-text"]}>
            {renderMessageContent(normalizedMessage.content)}
            {normalizedMessage.role === "user" && (
              <button
                type="button"
                onClick={handleEditClick}
                className={styles["edit-btn"]}
                title="Edit and regenerate"
                aria-label="Edit message"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMsg;
