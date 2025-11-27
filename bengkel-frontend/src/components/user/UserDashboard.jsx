import React, { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon,
  ClockIcon,
  CheckBadgeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { bookingService } from '../../services/bookingService';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingService.getBookings();
      if (response.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: ClockIcon,
      confirmed: CalendarDaysIcon,
      completed: CheckBadgeIcon,
      cancelled: XCircleIcon
    };
    return icons[status] || ClockIcon;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      in_progress: 'text-orange-600 bg-orange-100',
      completed: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">
            Dashboard Saya
          </h1>
          <p className="text-gray-600">
            Kelola booking dan riwayat servis kendaraan Anda
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl font-bold text-primary-700 mb-2">
              {bookings.length}
            </div>
            <div className="text-gray-600">Total Booking</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-gray-600">Confirmed</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {bookings.filter(b => b.status === 'completed').length}
            </div>
            <div className="text-gray-600">Selesai</div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-primary-700 mb-6">
            Riwayat Booking Terbaru
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(booking.status)}`}>
                        <StatusIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-primary-700">
                          {booking.booking_code}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.service_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.booking_date} • {booking.booking_time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-primary-700">
                        {booking.estimated_cost}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDaysIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Belum ada booking
              </h3>
              <p className="text-gray-500 mb-4">
                Mulai dengan melakukan booking servis pertama Anda
              </p>
              <button className="bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-colors">
                Booking Servis Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;