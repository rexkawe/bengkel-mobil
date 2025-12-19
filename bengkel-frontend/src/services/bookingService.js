import api from './api';

export const bookingService = {
  async getBookings() {
    const response = await api.get('/bookings');
    return response.data;
  },

  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getBooking(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async getAvailableTimes(date) {
    const response = await api.get('/bookings/available-times', {
      params: { date }
    });
    return response.data;
  },

  async cancelBooking(id) {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  }
};