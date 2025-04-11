import { API_KEY } from "./Secret";

const headers = {
  "Authorization": `Bearer ${API_KEY}`
};
export async function uploadFile(file,purpose="assistants") {
  console.log(file);
    const formData = new FormData();
    formData.append("purpose", purpose);
    formData.append("file", file);
  
    try {
      const response = await fetch("https://api.openai.com/v1/files", {
        method: "POST",
        headers: headers,
        body: formData
      });
      const data = await response.json();
      console.log("File uploaded:", data);
      return data.id; 
    } catch (error) {
      console.error("Upload error:", error);
    }
  }
  