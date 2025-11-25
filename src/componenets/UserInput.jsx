import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, toggleActiveAgent } from "../store/slices/chatSlice";
import config from "../config/env";
import styles from "./UserInput.module.css";
//import { uploadFileToOpenAI } from "../services/apiService";
const UserInput = ({ getResponse, isLoading }) => {
  const dispatch = useDispatch();
  const {
    currentChat,
    chats,
    activeAgent: isAgentActive,
  } = useSelector((state) => state.chat);
  const messages = useMemo(
    () => chats[currentChat] || [],
    [chats, currentChat]
  );

  const [uploadedImg, setUploadedImg] = useState(null);
  //const [uploadedFileId, setUploadedFileId] = useState(null);
  //  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const input = useRef();
  const file = useRef();

  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedImg(event.target.result);
          // setUploadedFileId(null);
        };
        reader.readAsDataURL(file);
        return;
      }else{
        throw Error("Only image files are suported in Production")
      }
      // setUploading(true);
      // const result = await uploadFileToOpenAI(file, "assistants");
      // if (result.success) {
      //   setUploadedFileId(result.fileId);
      //   setUploadedImg(null);
      // } else {
      //   setUploadError(result.error.message);
      // }

      // setUploading(false);
    },
    [setUploadedImg]
    //[setUploadedFileId, setUploading, setUploadedImg, setUploadError]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const userInput = input.current.value.trim();
      if (!userInput || isLoading) return;

      if (userInput.length > config.app.maxMessageLength) {
        alert(
          `Message is too long. Maximum ${config.app.maxMessageLength} characters allowed.`
        );
        return;
      }

      let userMessage;

      if (uploadedImg) {
        userMessage = {
          role: "user",
          content: [
            { type: "text", text: userInput },
            {
              type: "image_url",
              image_url: { url: uploadedImg },
            },
          ],
        };
      }
      //else if (uploadedFileId) {
      //   userMessage = {
      //     role: "user",
      //     content: [
      //       { type: "file", file: { file_id: uploadedFileId } },
      //       { type: "text", text: userInput },
      //     ],
      //   };
      // }
      else {
        userMessage = {
          role: "user",
          content: userInput,
        };
      }

      // Add message and get response
      dispatch(addMessage(userMessage));
      await getResponse([config.app.systemMessage, ...messages, userMessage]);

      // Reset form
      input.current.value = "";
      file.current.value = "";
       setUploadedImg(null);
      //setUploadedFileId(null);
      //  setUploadError(null);
    },
    [
      uploadedImg,
      //     uploadedFileId,
      dispatch,
      getResponse,
      isLoading,
      messages,
      //   uploading,
      setUploadedImg,
      //  setUploadError,
      // setUploadedFileId,
    ]
  );

  const clearUpload = () => {
    setUploadedImg(null);
    // setUploadedFileId(null);
    setUploadError(null);
    //file.current.value = "";
  };

  return (
    <form className={styles["user-input"]} onSubmit={handleSubmit}>
      <div className={styles["input-preview-container"]}>
        <div className={styles["agent-toggle"]}>
          <input
            type="checkbox"
            id="agent"
            checked={isAgentActive}
            onChange={() => dispatch(toggleActiveAgent())}
            disabled={isLoading}
          />
          <label htmlFor="agent" title="Enable AI agent with function calling">
            🤖 Agent Mode
          </label>
        </div>

        {uploadedImg && (
          <div className={styles["upload-preview"]}>
            <button
              type="button"
              onClick={clearUpload}
              className={styles["clear-upload-btn"]}
              aria-label="Remove image"
            >
              ×
            </button>
            <img
              src={uploadedImg}
              alt="Upload preview"
              className={styles["preview-image"]}
            />
          </div>
        )}

        {/* {uploadedFileId && (
          <div className={styles["upload-preview file-preview"]}>
            <button
              type="button"
              onClick={clearUpload}
              className={styles["clear-upload-btn"]}
              aria-label="Remove file"
            >
              ×
            </button>
            <span className="file-icon">📎</span>
            <span className={styles["file-label"]}>File attached</span>
          </div>
        )} */}

        {/* {uploading && (
          <div className={styles["upload-preview uploading"]}>
            <span className={styles["loading-spinner"]}></span>
            <span>Uploading...</span>
          </div>
        )} */}

        {uploadError && (
          <div className={styles["upload-error"]}>
            <span>⚠️ {uploadError}</span>
            <button
              type="button"
              onClick={clearUpload}
              className={styles["error-dismiss"]}
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className={styles["input-controls"]}>
        <input
          type="file"
          ref={file}
          style={{ display: "none" }}
          onChange={handleFileUpload}
          accept="image/*"//,.pdf,.txt,.doc,.docx"
          disabled={isLoading}
        />

        <input
          type="text"
          ref={input}
          placeholder={
            isLoading
              ? "Generating response..."
              : // : uploading
                // ? "Uploading file..."
                "Type a message..."
          }
          disabled={isLoading}
          maxLength={config.app.maxMessageLength}
          aria-label="Message input"
        />

        <button
          type="button"
          onClick={() => file.current.click()}
          disabled={isLoading}
          className={styles["upload-btn"]}
          title="Upload file or image"
        >
          📎 Upload
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className={styles["send-btn"]}
        >
          {isLoading ? "..." : isAgentActive ? "🤖 Ask Agent" : "Send"}
        </button>
      </div>
    </form>
  );
};

export default UserInput;
