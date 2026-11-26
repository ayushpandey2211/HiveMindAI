import api from '../api/axios';

export const sendChatMessage = async (message) => {
  try {
    const response = await api.post('/chat', { message });
    return response.data; // This will return the { final_answer, confidence, sources } object
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
};