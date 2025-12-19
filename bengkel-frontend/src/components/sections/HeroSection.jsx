import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckBadgeIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      navigate('/booking');
    }
  };

  const handleServiceClick = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                Terpercaya sejak 2014
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-primary-700 leading-tight">
                Layanan Bengkel
                <span className="text-blue-600"> Profesional</span>{" "}
                untuk Mobil Anda
              </h1>

              <p className="text-xl text-primary-600 leading-relaxed">
                Pengalaman servis terbaik dengan teknologi modern,
                harga transparan, dan garansi terjamin untuk kendaraan Anda.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                'Servis berkala dengan harga terjangkau',
                'Teknisi bersertifikat dan berpengalaman',
                'Garansi untuk setiap servis',
                'Estimasi biaya real-time'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckBadgeIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <span className="text-primary-600">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleBookingClick}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Pesan Servis Sekarang
              </button>
              <button
                onClick={handleServiceClick}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold text-lg hover:border-blue-700 hover:text-blue-700"
              >
                Lihat Layanan
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { number: '10K+', label: 'Pelanggan Puas' },
                { number: '10+', label: 'Tahun Pengalaman' },
                { number: '24/7', label: 'Layanan Darurat' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{stat.number}</div>
                  <div className="text-sm text-primary-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://i.ibb.co.com/Xfn5tvF8/bengkel.jpg"
                alt="Modern Car Service"
                className="rounded-xl w-full h-96 object-cover"
              />
            </div>

            {/* Floating Card 1 */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-primary-700">Cepat</div>
                  <div className="text-sm text-primary-500">Servis 2 Jam</div>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-primary-700">Garansi</div>
                  <div className="text-sm text-primary-500">7 Hari - 1 Bulan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
