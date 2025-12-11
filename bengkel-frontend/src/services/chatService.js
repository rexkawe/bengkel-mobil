import api from './api';

export const chatService = {
  async getMessages(sessionId) {
    const response = await api.get('/chat/messages', {
      params: { session_id: sessionId }
    });
    return response.data;
  },

  async sendMessage(messageData) {
    const response = await api.post('/chat/send', messageData);
    return response.data;
  },

  async getUnreadCount(sessionId) {
    const response = await api.get('/chat/unread-count', {
      params: { session_id: sessionId }
    });
    return response.data;
  },

  async markAsRead(messageId) {
    const response = await api.put(`/chat/messages/${messageId}/read`);
    return response.data;
  }
};