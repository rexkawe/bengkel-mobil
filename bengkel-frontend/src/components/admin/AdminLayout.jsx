import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  UsersIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  ArrowLeftIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'Manajemen Booking', href: '/admin/bookings', icon: CalendarDaysIcon },
    { name: 'Manajemen Layanan', href: '/admin/services', icon: WrenchScrewdriverIcon },
    { name: 'Manajemen Pelanggan', href: '/admin/customers', icon: UsersIcon },
    { name: 'Pengaturan', href: '/admin/settings', icon: CogIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter transition-colors duration-200">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-2xl flex flex-col z-20 transition-colors duration-200">
        <div className="p-8">
          <div className="flex items-center space-x-3 text-blue-600">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              B
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Bengkel Pro</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">ADMINISTRATOR</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}
                <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 m-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
              <UserCircleIcon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@bengkel.com'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeftIcon className="h-3 w-3 mr-1" />
              Website
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-3 w-3 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar could go here if needed */}
        <div className="flex-1 overflow-auto bg-gray-50/50">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;