export const loadChatsFromStorage = () => {
  try {
    const stored = localStorage.getItem("chats");
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to load chats from storage:", error);
    return {};
  }
};

export const saveChatsToStorage = (chats) => {
  try {
    localStorage.setItem("chats", JSON.stringify(chats));
  } catch (error) {
    console.error("Failed to save chats to storage:", error);
  }
};