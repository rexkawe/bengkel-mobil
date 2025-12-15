import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Beranda', href: '#home' },
    { name: 'Layanan', href: '#services' },
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Hubungi', href: '#contact' },
  ];

  const handleLogout = async () => {
    console.log('Header: Logout clicked');
    await logout();
    setIsMenuOpen(false);
  };

  const handleBookingClick = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setIsMenuOpen(false);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-12 flex items-center justify-center rounded-lg overflow-hidden">
                <img
                  src="https://i.ibb.co.com/KjLPMgbC/logo-bengkel.jpg"
                  alt="TDY Auto Service Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-600">TDY Auto Service</h1>
                <p className="text-xs text-gray-500">Professional Service</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-primary-500 hover:text-accent-500 font-medium transition-colors duration-300"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Desktop Auth & Booking Buttons */}
            <div className="hidden md:flex space-x-4 items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-primary-600">
                    <UserCircleIcon className="h-6 w-6" />
                    <span className="font-medium">
                      Hi, {user?.name}
                    </span>
                  </div>

                  {/* Admin Link */}
                  {user?.role === 'admin' && (
                    <button
                      onClick={handleAdminClick}
                      className="px-4 py-2 text-primary-500 font-medium hover:text-accent-500 transition-colors"
                    >
                      Admin Panel
                    </button>
                  )}

                  {/* User Dashboard Link */}
                  {user?.role === 'customer' && (
                    <button
                      onClick={handleDashboardClick}
                      className="px-4 py-2 text-primary-500 font-medium hover:text-accent-500 transition-colors"
                    >
                      Dashboard
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-primary-500 font-medium hover:text-accent-500 transition-colors"
                  >
                    Logout
                  </button>

                  <button
                    onClick={handleBookingClick}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium"
                  >
                    Booking Servis
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-primary-500 font-medium hover:text-accent-500 transition-colors"
                  >
                    Login
                  </Link>
                  <button
                    onClick={handleBookingClick}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium"
                  >
                    Booking Servis
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-primary-500"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-primary-500 hover:text-accent-500 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              <div className="pt-4 space-y-2 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 py-2 text-primary-500">
                      <UserCircleIcon className="h-5 w-5" />
                      <span>Hi, {user?.name}</span>
                    </div>

                    {user?.role === 'admin' && (
                      <button
                        onClick={handleAdminClick}
                        className="w-full py-2 text-primary-500 font-medium text-left"
                      >
                        Admin Panel
                      </button>
                    )}

                    {user?.role === 'customer' && (
                      <button
                        onClick={handleDashboardClick}
                        className="w-full py-2 text-primary-500 font-medium text-left"
                      >
                        Dashboard
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full py-2 text-primary-500 font-medium text-left"
                    >
                      Logout
                    </button>
                    <button
                      onClick={handleBookingClick}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-center"
                    >
                      Booking Servis
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-2 text-primary-500 hover:text-accent-500 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <button
                      onClick={handleBookingClick}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-center"
                    >
                      Booking Servis
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;