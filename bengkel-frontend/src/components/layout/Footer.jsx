import React from 'react';
import { 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon,
  EnvelopeIcon 
} from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-primary-600 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <img
                  src="https://i.ibb.co.com/KjLPMgbC/logo-bengkel.jpg"
                  alt="TDY Auto Service Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <h2 className="text-xl font-bold">TDY Auto Service</h2>
            </div>
            <p className="text-primary-100 mb-4 max-w-md">
              Layanan bengkel mobil modern dengan teknologi terkini untuk 
              memberikan pengalaman servis yang terbaik untuk kendaraan Anda.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-accent-400" />
                <span className="text-primary-100">081288031729</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-5 w-5 text-accent-400" />
                <span className="text-primary-100">servicetdyauto@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Beranda', 'Layanan', 'Tentang Kami', 'Kontak'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-primary-100 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Jam Operasional</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-accent-400" />
                <div>
                  <p className="text-primary-100">Senin - Jumat</p>
                  <p className="text-primary-100">08:00 - 18:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-accent-400" />
                <div>
                  <p className="text-primary-100">Sabtu</p>
                  <p className="text-primary-100">08:00 - 16:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-500 mt-8 pt-8 text-center">
          <p className="text-primary-200">
            © 2014 TDY Auto Service Bengkel Modern. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;