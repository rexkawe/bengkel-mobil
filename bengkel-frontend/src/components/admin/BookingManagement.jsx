import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    date: ''
  });

  const [selectedBooking, setSelectedBooking] = useState(null);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    fetchBookings(1);
  }, [debouncedSearch, filters.status, filters.date]);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        search: debouncedSearch,
        status: filters.status,
        date: filters.date
      };

      const response = await adminService.getAllBookings(params);
      if (response.success) {
        setBookings(response.data.bookings);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchBookings(newPage);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      if (window.confirm(`Ubah status booking menjadi ${newStatus}?`)) {
        await adminService.updateBookingStatus(id, newStatus);
        fetchBookings(pagination.current_page); // Refresh data
      }
    } catch (error) {
      alert('Gagal memperbarui status');
    }
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
  };

  const closeDetailModal = () => {
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-gray-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Booking</h1>
          <p className="text-gray-500 mt-1">Kelola semua jadwal reservasi pelanggan</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Booking Baru
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-2">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, kode booking, atau plat nomor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-white transition-all"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu (Pending)</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="in_progress">Sedang Dikerjakan</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-600 bg-white"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Memuat data booking...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Info Booking</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pelanggan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kendaraan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jadwal & Biaya</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-blue-600 text-sm">#{booking.booking_code}</div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {booking.created_at}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{booking.customer_phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{booking.service_name}</div>
                          <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 mt-1">
                            {booking.vehicle_plate}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            {booking.booking_date}
                            <span className="text-gray-400 mx-1">•</span>
                            {booking.booking_time}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Rp {Number(booking.final_cost || booking.estimated_cost || 0).toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status === 'in_progress' ? 'Dikerjakan' : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                title="Konfirmasi"
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <CheckCircleIcon className="w-5 h-5" />
                              </button>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(booking.id, 'in_progress')}
                                title="Mulai Pengerjaan"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <ClockIcon className="w-5 h-5" />
                              </button>
                            )}
                            {booking.status === 'in_progress' && (
                              <button
                                onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                title="Selesai"
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <CheckCircleIcon className="w-5 h-5" />
                              </button>
                            )}
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                              <button
                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                title="Batalkan"
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <XCircleIcon className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleViewDetail(booking)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Lihat Detail"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="mx-auto h-24 w-24 text-gray-200">
                          <CalendarIcon />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada booking ditemukan</h3>
                        <p className="mt-1 text-sm text-gray-500">Coba ubah filter pencarian Anda.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="text-sm text-gray-500">
                Menampilkan <span className="font-medium">{(pagination.current_page - 1) * 10 + 1}</span> sampai <span className="font-medium">{Math.min(pagination.current_page * 10, pagination.total)}</span> dari <span className="font-medium">{pagination.total}</span> data
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className={`p-2 rounded-lg border ${pagination.current_page === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className={`p-2 rounded-lg border ${pagination.current_page === pagination.last_page
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-30 transition-opacity backdrop-blur-sm"
              aria-hidden="true"
              onClick={closeDetailModal}
            ></div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">

              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                    Detail Booking #{selectedBooking.booking_code}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Informasi lengkap reservasi</p>
                </div>
                <button
                  onClick={closeDetailModal}
                  className="bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
                >
                  <XCircleIcon className="h-8 w-8" aria-hidden="true" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                {/* Status Banner */}
                <div className={`rounded-xl p-4 mb-6 flex items-center justify-between border ${getStatusColor(selectedBooking.status)} bg-opacity-10 border-opacity-20`}>
                  <div className="flex items-center">
                    <span className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${getStatusColor(selectedBooking.status).replace('bg-opacity-10', 'bg-opacity-20')} bg-white`}>
                      {['completed', 'confirmed'].includes(selectedBooking.status) ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : selectedBooking.status === 'cancelled' ? (
                        <XCircleIcon className="w-6 h-6" />
                      ) : (
                        <ClockIcon className="w-6 h-6" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-medium opacity-80 uppercase tracking-wide">Status Booking</p>
                      <p className="text-lg font-bold capitalize">
                        {selectedBooking.status === 'in_progress' ? 'Sedang Dikerjakan' : selectedBooking.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Data Pelanggan</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Nama Lengkap</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBooking.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Nomor Telepon</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBooking.customer_phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Data Kendaraan</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Model Kendaraan</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBooking.vehicle_model} ({selectedBooking.vehicle_year})</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Nomor Polisi</p>
                        <span className="inline-block bg-gray-200 rounded px-2 py-0.5 text-sm font-mono font-bold text-gray-700 mt-1">
                          {selectedBooking.vehicle_plate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 md:col-span-2">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Detail Layanan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Jenis Layanan</p>
                          <p className="text-base font-bold text-blue-600">{selectedBooking.service_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Keluhan / Catatan</p>
                          <p className="text-sm text-gray-700 italic bg-white p-3 rounded-lg border border-gray-200 mt-1">
                            "{selectedBooking.complaint || 'Tidak ada catatan khusus'}"
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Jadwal Booking</p>
                          <p className="text-sm font-medium text-gray-900 flex items-center mt-1">
                            <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                            {selectedBooking.booking_date}
                          </p>
                          <p className="text-sm font-medium text-gray-900 flex items-center mt-1">
                            <ClockIcon className="w-5 h-5 text-gray-400 mr-2" />
                            {selectedBooking.booking_time}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Estimasi Biaya</p>
                          <p className="text-lg font-bold text-gray-900">
                            Rp {Number(selectedBooking.final_cost || selectedBooking.estimated_cost || 0).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse border-t border-gray-100">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-5 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDetailModal}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
