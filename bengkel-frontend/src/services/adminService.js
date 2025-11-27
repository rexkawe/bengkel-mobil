import api from './api';

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  },

  async getRecentBookings() {
    const response = await api.get('/admin/recent-bookings');
    return response.data;
  },

  async getAllBookings(params = {}) {
    const response = await api.get('/admin/all-bookings', { params });
    return response.data;
  },

  async updateBookingStatus(id, status) {
    const response = await api.put(`/admin/bookings/${id}/status`, { status });
    return response.data;
  },

  async getChatStatistics() {
    const response = await api.get('/admin/chat-statistics');
    return response.data;
  }
};