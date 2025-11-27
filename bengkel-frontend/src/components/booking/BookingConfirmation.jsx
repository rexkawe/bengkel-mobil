import React from 'react';
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const { state, createBooking, dispatch } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleConfirmBooking = async () => {
    const bookingData = {
      service_id: state.selectedService.id,
      booking_date: state.selectedDate,
      booking_time: state.selectedTime,
      customer_name: state.customerInfo.name,
      customer_phone: state.customerInfo.phone,
      customer_email: state.customerInfo.email,
      vehicle_type: state.customerInfo.carType,
      vehicle_plate: state.customerInfo.carPlate,
      vehicle_model: state.customerInfo.carModel,
      vehicle_year: state.customerInfo.year,
      notes: state.bookingNotes
    };

    const result = await createBooking(bookingData);
    
    if (result.success) {
      // Redirect to success page or show success message
      navigate('/booking/success', { 
        state: { booking: result.data.booking } 
      });
    } else {
      alert(result.message || 'Terjadi kesalahan saat membuat booking');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 3 })}
          className="flex items-center text-primary-600 hover:text-accent-600 mb-6 mx-auto"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Kembali ke Data Kendaraan
        </button>
        
        <h2 className="text-3xl font-bold text-primary-700 mb-4">
          Konfirmasi Booking
        </h2>
        <p className="text-primary-600">
          Periksa kembali detail booking sebelum konfirmasi
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-6">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-8 w-8" />
            <div>
              <h3 className="text-xl font-semibold">Booking Summary</h3>
              <p className="text-primary-100">Detail layanan dan informasi booking</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Service Details */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-primary-700 mb-4">
              Detail Layanan
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{state.selectedService?.icon}</span>
                </div>
                <div>
                  <h5 className="font-semibold text-primary-700">
                    {state.selectedService?.name}
                  </h5>
                  <p className="text-sm text-primary-500">
                    {state.selectedService?.description}
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

          {/* Schedule Details */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-primary-700 mb-4">
              Jadwal Servis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-primary-500">Tanggal</p>
                <p className="font-semibold text-primary-700">
                  {formatDate(state.selectedDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-500">Waktu</p>
                <p className="font-semibold text-primary-700">{state.selectedTime}</p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-primary-700 mb-4">
              Data Pelanggan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-primary-500">Nama</p>
                <p className="font-semibold text-primary-700">
                  {state.customerInfo.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-500">Email</p>
                <p className="font-semibold text-primary-700">
                  {state.customerInfo.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-500">Telepon</p>
                <p className="font-semibold text-primary-700">
                  {state.customerInfo.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-primary-700 mb-4">
              Data Kendaraan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-primary-500">Tipe Kendaraan</p>
                <p className="font-semibold text-primary-700">
                  {state.customerInfo.carType}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-500">Plat Nomor</p>
                <p className="font-semibold text-primary-700 uppercase">
                  {state.customerInfo.carPlate}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-500">Model/Merk</p>
                <p className="font-semibold text-primary-700">
                  {state.customerInfo.carModel}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-500">Tahun</p>
                <p className="font-semibold text-primary-700">
                  {state.customerInfo.year}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {state.bookingNotes && (
            <div>
              <h4 className="text-lg font-semibold text-primary-700 mb-4">
                Catatan Tambahan
              </h4>
              <p className="text-primary-600 bg-gray-50 p-4 rounded-lg">
                {state.bookingNotes}
              </p>
            </div>
          )}

          {/* Total */}
          <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-primary-700">
                Total Biaya Estimasi
              </span>
              <span className="text-2xl font-bold text-accent-600">
                {state.selectedService?.formatted_price}
              </span>
            </div>
            <p className="text-sm text-primary-500 mt-2">
              *Biaya final dapat berubah setelah pemeriksaan kendaraan
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 3 })}
              className="px-6 py-3 border-2 border-primary-300 text-primary-600 rounded-lg hover:border-primary-400 hover:text-primary-700 transition-colors font-semibold"
            >
              Kembali
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={state.isLoading}
              className="px-8 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center space-x-2"
            >
              {state.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Konfirmasi Booking</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;