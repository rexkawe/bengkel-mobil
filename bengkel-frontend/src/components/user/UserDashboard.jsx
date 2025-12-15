import React, { useState, useEffect } from 'react';
import {
  WrenchScrewdriverIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getBookings();
      if (response.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
      setLoading(true);
      try {
        const result = await bookingService.cancelBooking(id);
        if (result.success) {
          alert('Booking berhasil dibatalkan');
          await fetchBookings();
        } else {
          alert(result.message || 'Gagal membatalkan booking');
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert(error.response?.data?.message || 'Terjadi kesalahan saat membatalkan booking');
      } finally {
        setLoading(false);
      }
    }
  };

  // Main active booking (the one displayed in the large card)
  const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status));
  const activeBooking = activeBookings[0];

  // List of other bookings (past OR other active bookings not shown in the main card)
  const otherBookings = bookings.filter(b => b.id !== activeBooking?.id);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'confirmed': return 'Dikonfirmasi';
      case 'in_progress': return 'Sedang Dikerjakan';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Welcome Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Selamat Datang, <span className="text-blue-600">{user?.name}</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Kelola jadwal servis dan perawatan kendaraan Anda
            </p>
          </div>
          <Link
            to="/booking"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Booking Servis Baru
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Active Booking & Vehicle Info */}
            <div className="lg:col-span-2 space-y-8">

              {/* Active Booking Card */}
              {activeBooking ? (
                <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden border border-blue-100 relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <WrenchScrewdriverIcon className="w-48 h-48 text-blue-600" />
                  </div>

                  <div className="p-6 sm:p-8 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center">
                        <div className="w-2 h-8 bg-blue-600 rounded-full mr-3"></div>
                        Servis Sedang Berlangsung
                      </h2>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(activeBooking.status)}`}>
                        {getStatusLabel(activeBooking.status)}
                      </span>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                          <CalendarDaysIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Jadwal Servis</p>
                          <p className="text-lg font-semibold text-gray-900">{activeBooking.booking_date} • {activeBooking.booking_time}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                          <WrenchScrewdriverIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Layanan</p>
                          <p className="text-lg font-semibold text-gray-900">{activeBooking.service_name}</p>
                          <p className="text-sm text-gray-600 mt-1">Estimasi Biaya: {activeBooking.formatted_estimated_cost}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                          <MapPinIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Lokasi Bengkel</p>
                          <p className="text-gray-900 font-medium">TDY Auto Service</p>
                          <p className="text-sm text-gray-500">Jl. H. Muhari, RT.02/rw01, Serua, Kec. Bojongsari, Kota Depok, Jawa Barat 16517</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-sm text-blue-600 italic flex items-center bg-blue-50 p-3 rounded-lg flex-1 mr-4">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        Mohon datang 15 menit sebelum jadwal servis.
                      </p>

                      {['pending', 'confirmed'].includes(activeBooking.status) && (
                        <button
                          onClick={() => handleCancelBooking(activeBooking.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm flex-shrink-0"
                        >
                          Batalkan Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl shadow-blue-900/20 p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <WrenchScrewdriverIcon className="w-16 h-16 mx-auto mb-4 text-blue-100 opacity-80" />
                    <h2 className="text-2xl font-bold mb-2">Kendaraan Anda Sehat?</h2>
                    <p className="text-blue-100 mb-6 max-w-md mx-auto">
                      Jangan lupa servis berkala untuk menjaga performa optimal. Jadwalkan servis sekarang dengan mudah.
                    </p>
                    <Link
                      to="/booking"
                      className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      Booking Sekarang
                    </Link>
                  </div>
                </div>
              )}

              {/* History Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">Daftar Booking Lainnya</h3>
                  <span className="text-sm text-gray-500">{otherBookings.length} Item</span>
                </div>

                {otherBookings.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {otherBookings.map((booking) => (
                      <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          <div className={`w-2 h-16 rounded-full ${getStatusColor(booking.status)} opacity-50`}></div>
                          <div>
                            <p className="font-bold text-gray-900">{booking.service_name}</p>
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                              <CalendarDaysIcon className="w-4 h-4 mr-1" />
                              {booking.booking_date}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {booking.vehicle_plate} • {booking.vehicle_model}
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right flex flex-col items-end">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                          <p className="font-semibold text-gray-900 mb-2">{booking.formatted_final_cost || booking.formatted_estimated_cost}</p>

                          {['pending', 'confirmed'].includes(booking.status) && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-xs text-red-600 hover:text-red-700 font-medium underline"
                            >
                              Batalkan
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <ClockIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>Belum ada riwayat booking lainnya.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Profile & Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3">
                    <UserCircleIcon className="w-12 h-12" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{user?.name}</h3>
                  <p className="text-gray-500">{user?.email}</p>
                </div>

                <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">No. Telepon</span>
                    <span className="font-medium text-gray-900">{user?.phone || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Bergabung</span>
                    <span className="font-medium text-gray-900">Member Setia</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Bantuan & Darurat
                </h3>
                <p className="text-gray-300 text-sm mb-6">
                  Butuh bantuan darurat di jalan? Tim mekanik kami siap membantu Anda.
                </p>
                <a
                  href="https://wa.me/6281288031729"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;