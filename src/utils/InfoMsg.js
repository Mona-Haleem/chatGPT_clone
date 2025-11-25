export const ERROR_MESSAGES = {
  QUOTA_EXCEEDED: {
    title: 'API Quota Exceeded',
    message: 'You have exceeded your current API quota. Please check your OpenAI account billing details or try again later.',
    type: 'quota'
  },
  
  RATE_LIMIT: {
    title: 'Rate Limit Reached',
    message: 'Too many requests. Please wait a moment before trying again.',
    type: 'rate_limit'
  },
  
  INVALID_API_KEY: {
    title: 'Invalid API Key',
    message: 'The API key is invalid or missing. Please check your environment variables.',
    type: 'auth'
  },
  
  NETWORK_ERROR: {
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    type: 'network'
  },
  
  INVALID_REQUEST: {
    title: 'Invalid Request',
    message: 'The request was invalid. Please try rephrasing your message.',
    type: 'validation'
  },
  
  SERVER_ERROR: {
    title: 'Server Error',
    message: 'The server encountered an error. Please try again in a few moments.',
    type: 'server'
  },
  
  TIMEOUT: {
    title: 'Request Timeout',
    message: 'The request took too long. Please try again with a shorter message.',
    type: 'timeout'
  },
  
  FILE_UPLOAD_FAILED: {
    title: 'Upload Failed',
    message: 'Failed to upload the file. Please try again or use a different file.',
    type: 'upload'
  },
  
  EMAIL_SEND_FAILED: {
    title: 'Email Failed',
    message: 'Failed to send the email reminder. Please check your EmailJS configuration.',
    type: 'email'
  },
  
  GENERIC_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    type: 'generic'
  }
};

export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully',
  MESSAGE_SENT: 'Message sent',
  EMAIL_SCHEDULED: 'Reminder scheduled successfully',
  CHAT_CREATED: 'New chat created'
};

export const LOADING_MESSAGES = {
  SENDING: 'Sending message...',
  UPLOADING: 'Uploading file...',
  GENERATING: 'Generating response...',
  PROCESSING: 'Processing...'
};

export const parseApiError = (error, response) => {
  if (response) {
    switch (response.status) {
      case 401:
        return ERROR_MESSAGES.INVALID_API_KEY;
      case 429:
        return ERROR_MESSAGES.QUOTA_EXCEEDED;
      case 500:
      case 502:
      case 503:
        return ERROR_MESSAGES.SERVER_ERROR;
      case 400:
        return ERROR_MESSAGES.INVALID_REQUEST;
    }
  }
  
  if (error.message) {
    const msg = error.message.toLowerCase();
    
    if (msg.includes('quota') || msg.includes('insufficient_quota')) {
      return ERROR_MESSAGES.QUOTA_EXCEEDED;
    }
    
    if (msg.includes('rate limit') || msg.includes('rate_limit_exceeded')) {
      return ERROR_MESSAGES.RATE_LIMIT;
    }
    
    if (msg.includes('network') || msg.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    if (msg.includes('timeout')) {
      return ERROR_MESSAGES.TIMEOUT;
    }
    
    if (msg.includes('api key') || msg.includes('unauthorized')) {
      return ERROR_MESSAGES.INVALID_API_KEY;
    }
  }
  
  return ERROR_MESSAGES.GENERIC_ERROR;
};

export default {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  parseApiError
};