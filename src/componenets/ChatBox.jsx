import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setCurrentChat } from "../store/slices/chatSlice";
import UserInput from "./UserInput";
import ChatMsg from "./ChatMsg";
import ErrorModal from "./ErrorModal";
import { fetchChatCompletion } from "../services/apiService";
import { functions, scheduleReminder } from "../utils/agentFunctions";
//import config from "../config/env"
import styles from "./ChatBox.module.css";
const ChatBox = () => {
  const dispatch = useDispatch();
  const { chats, currentChat, isAgentActive } = useSelector(
    (state) => state.chat
  );
  const messages = useMemo(
    () => chats[currentChat] || [],
    [chats, currentChat]
  );

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    
    if (!currentChat) {
      const newChatId = uuidv4();
      dispatch(setCurrentChat(newChatId));
    }
  }, [currentChat, dispatch]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = useCallback(async (updatedMessages) => {
    setIsLoading(true);
    setError(null);

    try {
      const functionsConfig = functions;
      const functionCall = isAgentActive ? "auto" : null;

      const result = await fetchChatCompletion(
        updatedMessages,
        functionsConfig,
        functionCall
      );
      console.log(result.success ,"staus")
      if (!result.success) {
        setError(result.error);
        return;
      }
       if (result.message.tool_calls) {
        console.log("start call")
         const args = JSON.parse(result.functionCall.arguments);
         scheduleReminder(args);
         
        const functionResponse = {
          role: "assistant",
          content: 
          `**Reminder scheduled successfully!**\
          -**Task:** ${args.task}\
          -**Time:** ${new Date(args.time).toLocaleString()}\
          -**Email:** ${args.email}\
          You will receive an email reminder at the scheduled time.`,
        };


        dispatch(addMessage(functionResponse));
      } else if (result.message.content) {
        const aiResponse = {
          role: "assistant",
          content: result.message.content,
        };
        dispatch(addMessage(aiResponse));
      }
    } catch (err) {
      console.error("Error in getResponse:", err);
      setError({
        title: "Unexpected Error",
        message: err.message || "An unexpected error occurred",
        type: "generic",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAgentActive,dispatch]);

  return (
        <>
      <div className={styles["chat-container"]}>
        <div className={styles["chat-box"]}>
          {messages?.map((message, index) =>
            message.role !== "system" ? (
              <ChatMsg
                key={index}
                message={message}
                messageIndex={index}
                chatId={currentChat}
                getResponse={getResponse}
              />
            ) : null
          )}

          {isLoading && (
            <div className={`chat-messages assistant ${styles["loading"]}`}>
              <strong>assistant:</strong>
              <div className={styles["typing-indicator"]}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <UserInput getResponse={getResponse} isLoading={isLoading} />
      </div>

      <ErrorModal error={error} onClose={() => setError(null)} />
    </>

  );
};

export default ChatBox;
