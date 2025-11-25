import config from "../config/env";
import { parseApiError } from "../utils/InfoMsg";
export const fetchChatCompletion = async (
  messages,
  functions = null,
  functionCall = null
) => {
  if (!config.openai.apiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  const requestBody = {
    model: config.openai.model,
    messages: messages,
  };

  if (functions) {
    requestBody.tools = functions;
    requestBody.tool_choice = functionCall || "auto";
  }

  try {
    const response = await fetch(`${config.api.url}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openai.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.error?.message || `HTTP ${response.status}`
      );
      throw { error, response };
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from API");
    }
    const toolCalls = data.choices[0].message?.tool_calls
    return {
      success: true,
      message: data.choices[0].message,
      functionCall: toolCalls?toolCalls[0].function :undefined,
    };
  } catch (err) {
    const errorInfo = parseApiError(err.error || err, err.response);

    return {
      success: false,
      error: errorInfo,
      originalError: err,
    };
  }
};

// export const uploadFileToOpenAI = async (file, purpose = "assistants") => {
//   if (!config.openai.apiKey) {
//     throw new Error("OpenAI API key is not configured");
//   }

//   const formData = new FormData();
//   formData.append("purpose", purpose);
//   formData.append("file", file);

//   try {
//     const response = await fetch(`${config.api.url}/files`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${config.openai.apiKey}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.error?.message || "File upload failed");
//     }

//     const data = await response.json();

//     return {
//       success: true,
//       fileId: data.id,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: parseApiError(error),
//       originalError: error,
//     };
//   }
// };

export const checkApiHealth = () => {
  const issues = [];

  if (!config.openai.apiKey) {
    issues.push("OpenAI API key is missing");
  }

  if (
    !config.emailjs.serviceId ||
    !config.emailjs.templateId ||
    !config.emailjs.publicKey
  ) {
    issues.push("EmailJS configuration is incomplete");
  }

  return {
    healthy: issues.length === 0,
    issues,
  };
};

export default {
  fetchChatCompletion,
 // uploadFileToOpenAI,
  checkApiHealth,
};
