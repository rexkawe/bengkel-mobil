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
  },

  async getCustomerStats() {
    const response = await api.get('/admin/customers/stats');
    return response.data;
  },

  async getCustomers(params = {}) {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },

  async createCustomer(data) {
    const response = await api.post('/admin/customers', data);
    return response.data;
  },

  async updateCustomer(id, data) {
    const response = await api.put(`/admin/customers/${id}`, data);
    return response.data;
  },

  async deleteCustomer(id) {
    const response = await api.delete(`/admin/customers/${id}`);
    return response.data;
  },

  // System Settings
  async getSettings() {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  async updateSettings(data) {
    const response = await api.post('/admin/settings', data);
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/admin/profile/update', data);
    return response.data;
  }
};