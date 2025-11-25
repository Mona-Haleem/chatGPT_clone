const getEnvVar = (key, defaultValue = "") => {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
  }

  return value || defaultValue;
};

export const config = {
  openai: {
    apiKey: getEnvVar("VITE_API_KEY"),
    model: "mistral-large-latest",
    maxTokens: 300,
  },
  emailjs: {
    serviceId: getEnvVar("VITE_EMAILJS_SERVICE_ID"),
    templateId: getEnvVar("VITE_EMAILJS_TEMPLATE_ID"),
    publicKey: getEnvVar("VITE_EMAILJS_PUBLIC_KEY"),
  },
  api: {
    url: "https://api.mistral.ai/v1",
  },
  app: {
    maxMessageLength: 4000,
    systemMessage: {
      role: "system",
      content:
        "Keep your answers to maximum of 300 words and format the answers into markdown format",
    },
  },
};
export const validateConfig = () => {
  const missing = [];
  
  if (!config.openai.apiKey) missing.push('VITE_OPENAI_API_KEY');
  if (!config.emailjs.serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
  if (!config.emailjs.templateId) missing.push('VITE_EMAILJS_TEMPLATE_ID');
  if (!config.emailjs.publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');
  
  return {
    isValid: missing.length === 0,
    missing
  };
};

export default config;