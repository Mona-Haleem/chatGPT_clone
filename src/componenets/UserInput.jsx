import React, {  useEffect, useRef, useState } from "react";  
import { useDispatch, useSelector } from "react-redux";
import { addMessage, toggleActiveAgent } from "../store/slices/chatSlice";
import { uploadFile } from "../utils/fileUpload";
import { tuneModelWithFile } from "../utils/fineTunningTest";

const systemMsg = {role:"system",content:"keep your answers to maximum of 300 words and format the answers into markdown format"}

const UserInput = ({getResponse}) => {    
  const [uploadedImg, setUploadedImg] = useState(null);
  const [uploadedfileId, setUploadedfileId] = useState(null);
  const [loading,setLoading] = useState(false)
  const currentChat = useSelector((state) => state.chat.currentChat);
  const messages = useSelector((state) => state.chat.chats[currentChat])||[];
  console.log(messages)
  const [isTuning,setIsTuning] = useState(false);
  const isAgentMsg = useSelector((state) => state.chat.activeAgent);
  
  const dispatch = useDispatch()
  const input = useRef();
  const file = useRef();
  const handleFileUpload =  (e) => {
    const fileToUpload = e.target.files[0];
    if (fileToUpload) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if(fileToUpload.type.startsWith("image/")){
            setUploadedImg(event.target.result); 
            setUploadedfileId(null);
          }else{
            setLoading(true);
            setUploadedImg(null);
            console.log(fileToUpload)
            try {
              const purpose = isTuning?'fine-tune':'assistants';

              const fileId = await uploadFile(fileToUpload,purpose);
              setUploadedfileId(fileId);
            } catch (error) {
              console.error("File upload failed:", error);
              setIsTuning(false);
            }
            setLoading(false);

          }
        };
        reader.readAsDataURL(fileToUpload); 
    }
};
  const handleSubmit = async(e) => {
    e.preventDefault()
    const useInput = input.current.value.trim() ;
    if (useInput === ''||loading) return;
    let userMessage = {};
        if(uploadedImg){
            userMessage = { role: 'user', content:[
                {"type":'text', "text":useInput},
                { "type": "image_url",
                    "image_url": {
                        "url": uploadedImg,
                    }}
            ]};
          }
        else if(uploadedfileId){
          userMessage = { role: 'user', content:[
            {"type":'file',"file":{ "file_id":uploadedfileId}},
            { "type": "text","text": useInput}
        ]};           
    }else{
        userMessage = { role: 'user', content: useInput};
    }
    console.log(userMessage)
    dispatch(addMessage(userMessage))
    console.log('getting response');
    getResponse([systemMsg,...messages, userMessage]);
    input.current.value = '';
    file.current.value = '';
    setUploadedImg(null);

};

useEffect(() => {
  async function tune() {
    setLoading(true);
    await tuneModelWithFile(uploadedfileId);
    setLoading(false);
    setIsTuning(false);


  }
  if(uploadedfileId && isTuning){
    tune();
  }

},[isTuning,uploadedfileId])

const tuneModel = () => {
  setIsTuning(true);
  file.current.click();
}
  return (
    <form className="user-input" onSubmit={handleSubmit}>
      <div className="inputImgcontainer">
      <input type="checkbox" id="agent" checked={isAgentMsg} onChange={() => dispatch(toggleActiveAgent())} />
      <label htmlFor="agent">Agent</label>
        {uploadedImg && <>
          <span onClick={()=>setUploadedImg(null)} className="close-imgBtn">x</span>
          <img src={uploadedImg} alt="Uploaded content" className="input-image" />
        </>}
        {loading && <span className="loading"></span>}
        {uploadedfileId && <>
          <span onClick={()=>setUploadedfileId(null)} className="close-imgBtn">x</span>
          <span>🔗</span>
        </>
          }
      </div>
      <input type="file" ref={file} style={{display:'none'}} onChange={handleFileUpload}/>
      <input type="text" ref={input} placeholder="Type a message..." />
      <button type="button" onClick={() => file.current.click()}>Upload</button>
      <button disabled={loading}>{isAgentMsg?"ask Agent" :"send"}</button>

    </form>
  );
}

export default UserInput;