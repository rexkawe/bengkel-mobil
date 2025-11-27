import React from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

const VehicleInfoForm = () => {
  const { state, dispatch } = useBooking();
  const { user } = useAuth();

  const carTypes = ['SUV', 'Sedan', 'MPV', 'Hatchback', 'Sport', 'Truck', 'Luxury', 'Electric'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const customerInfo = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      carType: formData.get('carType'),
      carPlate: formData.get('carPlate'),
      carModel: formData.get('carModel'),
      year: formData.get('year')
    };

    dispatch({ type: 'SET_CUSTOMER_INFO', payload: customerInfo });
  };

  // Pre-fill with user data if available
  const defaultName = user?.name || state.customerInfo.name || '';
  const defaultEmail = user?.email || state.customerInfo.email || '';
  const defaultPhone = user?.phone || state.customerInfo.phone || '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 2 })}
          className="flex items-center text-primary-600 hover:text-accent-600 mb-6 mx-auto"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Kembali ke Jadwal
        </button>
        
        <h2 className="text-3xl font-bold text-primary-700 mb-4">
          Data Kendaraan & Pelanggan
        </h2>
        <p className="text-primary-600">
          Isi data kendaraan dan informasi kontak Anda
        </p>
      </div>

      {/* Service Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">{state.selectedService?.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold text-primary-700">
                {state.selectedService?.name}
              </h3>
              <p className="text-sm text-primary-500">
                {state.selectedDate} • {state.selectedTime}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-accent-600">
              {state.selectedService?.formatted_price}
            </p>
            <p className="text-sm text-primary-500">
              {state.selectedService?.duration}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary-700 mb-4">
              Informasi Pelanggan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-600 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={defaultName}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-600 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={defaultEmail}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-600 mb-2">
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={defaultPhone}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="081234567890"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary-700 mb-4">
              Informasi Kendaraan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-600 mb-2">
                  Tipe Kendaraan *
                </label>
                <select
                  name="carType"
                  defaultValue={state.customerInfo.carType}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="">Pilih Tipe Kendaraan</option>
                  {carTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-600 mb-2">
                  Plat Nomor *
                </label>
                <input
                  type="text"
                  name="carPlate"
                  defaultValue={state.customerInfo.carPlate}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent uppercase"
                  placeholder="B 1234 ABC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-600 mb-2">
                  Model/Merk *
                </label>
                <input
                  type="text"
                  name="carModel"
                  defaultValue={state.customerInfo.carModel}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Toyota Avanza, Honda Civic, dll."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-600 mb-2">
                  Tahun *
                </label>
                <select
                  name="year"
                  defaultValue={state.customerInfo.year}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="">Pilih Tahun</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-primary-600 mb-2">
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={state.bookingNotes}
              onChange={(e) => dispatch({ type: 'SET_BOOKING_NOTES', payload: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              placeholder="Masukkan catatan khusus tentang kendaraan atau servis yang diinginkan..."
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 2 })}
            className="px-6 py-3 border-2 border-primary-300 text-primary-600 rounded-lg hover:border-primary-400 hover:text-primary-700 transition-colors font-semibold"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-semibold"
          >
            Lanjutkan ke Konfirmasi →
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleInfoForm;