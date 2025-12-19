import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    total_bookings: 0,
    pending_bookings: 0,
    total_customers: 0,
    revenue_month: 0,
    growth: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Parallel fetch for better performance
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/recent-bookings')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (bookingsRes.data.success) {
        setRecentBookings(bookingsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard. Pastikan server backend berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'booking':
        navigate('/admin/bookings');
        break;
      case 'service':
        navigate('/admin/services');
        break;
      case 'customer':
        navigate('/admin/customers');
        break;
      case 'report':
        // For now, redirect to bookings as report source
        navigate('/admin/bookings');
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statCards = [
    {
      title: 'Total Pendapatan',
      value: `Rp ${Number(stats.revenue_month).toLocaleString('id-ID')}`,
      trend: `${stats.growth > 0 ? '+' : ''}${stats.growth}%`,
      trendUp: stats.growth >= 0,
      icon: CurrencyDollarIcon,
      color: 'from-emerald-500 to-teal-500',
      lightColor: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Total Booking',
      value: stats.total_bookings,
      trend: 'Total Keseluuhan',
      trendUp: true,
      icon: CalendarDaysIcon,
      color: 'from-blue-500 to-indigo-500',
      lightColor: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Pelanggan',
      value: stats.total_customers,
      trend: 'Aktif',
      trendUp: true,
      icon: UsersIcon,
      color: 'from-violet-500 to-purple-500',
      lightColor: 'bg-violet-50 text-violet-600'
    },
    {
      title: 'Menunggu Konfirmasi',
      value: stats.pending_bookings,
      trend: 'Perlu Tindakan',
      trendUp: false,
      icon: ClockIcon,
      color: 'from-amber-500 to-orange-500',
      lightColor: 'bg-amber-50 text-amber-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Selamat Datang, Admin 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Berikut adalah ringkasan aktivitas bengkel hari ini.
        </p>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden group">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.lightColor} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trendUp !== false ? 'text-green-600' : 'text-amber-600'}`}>
                  {stat.trendUp !== false && <ArrowTrendingUpIcon className="w-4 h-4" />}
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Booking Terbaru</h2>
                <p className="text-sm text-gray-500">Transaksi yang baru masuk sistem</p>
              </div>
              <button
                onClick={() => navigate('/admin/bookings')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Lihat Semua
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Booking</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pelanggan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Layanan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          #{booking.booking_code}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                          <div className="text-xs text-gray-500">{booking.date}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {booking.service_name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                          Rp {Number(booking.total_price).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        Belum ada data booking terbaru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions & Service Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleQuickAction('booking')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                title="Buat Booking Baru"
              >
                <CalendarDaysIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Buat Booking</span>
              </button>
              <button
                onClick={() => handleQuickAction('service')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                title="Tambah Layanan Baru"
              >
                <WrenchScrewdriverIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Tambah Layanan</span>
              </button>
              <button
                onClick={() => handleQuickAction('customer')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                title="Data Pelanggan"
              >
                <UsersIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Pelanggan Baru</span>
              </button>
              <button
                onClick={() => handleQuickAction('report')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                title="Lihat Laporan"
              >
                <ChartBarIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Laporan</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Sistem Normal</h3>
                <p className="text-gray-400 text-sm">Semua layanan berjalan baik</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Database</span>
                <span className="text-green-400 font-medium">Connected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">API Server</span>
                <span className="text-green-400 font-medium">Online (24ms)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Synced</span>
                <span className="text-gray-300">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;