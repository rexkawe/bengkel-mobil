import api from './api';

export const serviceService = {
  async getServices() {
    const response = await api.get('/services');
    return response.data;
  },

  async getService(id) {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/services/categories/all');
    return response.data;
  },

  async getServicesByCategory(category) {
    const response = await api.get(`/services/category/${category}`);
    return response.data;
  },

  // Admin Methods
  async createService(data) {
    // Note: Route is inside /admin prefix group in backend
    const response = await api.post('/admin/services', data);
    return response.data;
  },

  async updateService(id, data) {
    const response = await api.put(`/admin/services/${id}`, data);
    return response.data;
  },

  async deleteService(id) {
    const response = await api.delete(`/admin/services/${id}`);
    return response.data;
  },

  async toggleServiceStatus(id) {
    const response = await api.put(`/admin/services/${id}/toggle`);
    return response.data;
  }
};