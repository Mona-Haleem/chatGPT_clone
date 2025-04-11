import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import UserInput from "./UserInput";
import ChatMsg from "./ChatMsg";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setCurrentChat } from "../store/slices/chatSlice";
import { functions } from "../utils/agentFunctions";
import { scheduleReminder } from "../utils/agentFunctions";
import { API_KEY } from "../utils/Secret";
const ChatBox = () => {
  const chats = useSelector((state) => state.chat.chats);
  const currentChat = useSelector((state) => state.chat.currentChat);
  const messages = useSelector((state) => state.chat.chats[currentChat]);
  const dispatch = useDispatch();
  const isAgentMsg = useSelector((state) => state.chat.activeAgent);
  console.log(isAgentMsg);
  useEffect(() => {
    if (!currentChat) {
      const newChatId = uuidv4();
      dispatch(setCurrentChat(newChatId));
    }
  }, [currentChat, chats, dispatch]);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const getResponse = async (updatedMessages) => {
    let requestdata = { model: "gpt-4o-mini", messages: updatedMessages };
    console.log(requestdata);

    if (isAgentMsg) {
      requestdata = { ...requestdata, functions, function_call: "auto" };
    }
    console.log(requestdata);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(requestdata),
        }
      );

      const data = await response.json();
      const fnCall = data.choices[0].message.function_call;

      if (fnCall) {
        const args = JSON.parse(fnCall.arguments);
        console.log(args);
        scheduleReminder(args);
      }

      const aiResponse = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      if (isAgentMsg && !aiResponse.content && fnCall){
        const args = JSON.parse(fnCall.arguments);

        aiResponse.content = ` 
          Email details:
          Task: ${args.task}
          Time: ${args.time}
          Recipient: ${args.email}
        `;}

      if (aiResponse.content) dispatch(addMessage(aiResponse));
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages &&
          messages.map(
            (message, index) =>
              message.role !== "system" && (
                <ChatMsg key={index} message={message} messageIndex={index} chatId={currentChat}  getResponse={getResponse}/>
              )
          )}
      </div>
      <UserInput getResponse={getResponse} />
    </div>
  );
};

export default ChatBox;
