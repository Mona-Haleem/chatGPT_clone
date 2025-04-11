import React, { useState } from "react";
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useDispatch, useSelector } from "react-redux";
import { editMessage } from "../store/slices/chatSlice";

const renderMessageContent = (content) => {
    const html = DOMPurify.sanitize(marked(content));
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const ChatMsg = function({message, messageIndex, chatId,getResponse}){
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState('');
    const messages = useSelector((state) => state.chat.chats[chatId]);

    if (Array.isArray(message.content))
        message = (message.content[0].type == 'text')?{
            role: message.role,
            image:message.content[1].image_url.url,
            content:message.content[0].text
        }:{
            role: message.role,
            content:message.content[1].text,
            file:true
        }

        const handleEditClick = () => {
            setEditText(message.content);
            setIsEditing(true);
        };
    
        const handleSave = () => {
            dispatch(editMessage({
                chatId,
                messageIndex,
                newMessage: {
                    ...message,
                    content: editText
                }
            }));
            getResponse(messages)
            setIsEditing(false);
        };
    
        
    return(
        <div className={`chat-messages ${message.role}`} >
            <strong>{message.role}:</strong>
            <div>
            {message.image &&
                (<img
                    src={message.image} 
                    alt="Uploaded content"
                    className="msg-image"
                />)}
                {message.file && <span className="fileIcon">🔗</span>}
                {isEditing ? (
                    <div className="editeMsg">
                        <textarea
                        
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                        />
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                ) : (
                    <>
                        {renderMessageContent(message.content)}
                        {message.role === 'user' && ( 
                            <button onClick={handleEditClick} className="edit-btn">✏️ Edit</button>
                        )}
                    </>
                )}
            </div>
        </div> 
       
    );
}

export default ChatMsg;