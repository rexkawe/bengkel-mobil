import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  CalendarDaysIcon,
  UserIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: ''
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { value: 'in_progress', label: 'In Progress', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    { value: 'completed', label: 'Completed', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' }
  ];

  useEffect(() => {
    loadBookings();
  }, [filters]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllBookings(filters);
      if (response.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await adminService.updateBookingStatus(bookingId, newStatus);
      if (response.success) {
        loadBookings(); // Reload data
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      date: '',
      search: ''
    });
  };

  const getStatusStyle = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? `${option.bgColor} ${option.textColor}` : 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-700 mb-2">
                Manajemen Booking
              </h1>
              <p className="text-gray-600">
                Kelola semua booking dari pelanggan
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Booking</p>
              <p className="text-2xl font-bold text-primary-600">{bookings.length}</p>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Booking</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset Filter
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Booking
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari kode, nama, atau telepon..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Booking
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Semua Status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Booking
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
            </div>

            {/* Filter Actions */}
            <div className="flex items-end space-x-2">
              <button
                onClick={loadBookings}
                className="flex-1 bg-accent-500 text-white py-2 px-4 rounded-lg hover:bg-accent-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Terapkan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Booking</h3>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Memuat data booking...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && bookings.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <CalendarDaysIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada booking</h3>
                <p className="text-gray-500">Tidak ada booking yang sesuai dengan filter yang dipilih.</p>
              </div>
            </div>
          )}

          {/* Bookings Table */}
          {!isLoading && bookings.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Layanan & Kendaraan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jadwal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      {/* Booking Info */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                            <div className="text-sm font-semibold text-primary-700">
                              {booking.booking_code}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {booking.created_at}
                          </div>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.customer_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.customer_phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Service & Vehicle Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                            <WrenchScrewdriverIcon className="h-4 w-4 text-accent-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.service_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.vehicle_plate} • {booking.estimated_cost}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{booking.booking_date}</div>
                        <div className="text-sm text-gray-500">{booking.booking_time}</div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                          className={`text-xs px-3 py-1 rounded-full border-0 font-medium cursor-pointer transition-colors ${getStatusStyle(booking.status)}`}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Booking"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {!isLoading && bookings.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Menampilkan <span className="font-medium">{bookings.length}</span> booking
                </p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    Sebelumnya
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;