import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDaysIcon, ClockIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { timeSlots } from '../../data/servicesData';
import { useBooking } from '../../context/BookingContext';

const ScheduleSelection = () => {
  const { state, dispatch } = useBooking();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');

  // ... (existing code)

  const handleNext = () => {
    dispatch({ type: 'GO_TO_STEP', payload: 3 });
    navigate('/booking/vehicle');
  };

  const handleBack = () => {
    dispatch({ type: 'GO_TO_STEP', payload: 1 });
    navigate('/booking');
  };

  // Generate next 7 days
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(formatDate(date));
  };

  const handleTimeSelect = (time) => {
    dispatch({
      type: 'SET_SCHEDULE',
      payload: { date: selectedDate, time }
    });
  };

  const isTimeAvailable = (time) => {
    // Simulasi ketersediaan jadwal
    const busySlots = ['10:00', '14:00']; // Jadwal yang sudah penuh
    return !busySlots.includes(time);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={handleBack}
          className="flex items-center text-primary-600 hover:text-accent-600 mb-6 mx-auto"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Kembali ke Layanan
        </button>

        <h2 className="text-3xl font-bold text-primary-700 mb-4">
          Pilih Jadwal Servis
        </h2>
        <p className="text-primary-600">
          Pilih tanggal dan waktu yang sesuai untuk servis kendaraan Anda
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">{state.selectedService?.icon}</span>
          </div>
          <div>
            <h3 className="font-semibold text-primary-700">
              {state.selectedService?.name}
            </h3>
            <p className="text-sm text-primary-500">
              Rp {state.selectedService?.price.toLocaleString()} • {state.selectedService?.duration}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Date Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CalendarDaysIcon className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-primary-700">Pilih Tanggal</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {getNextDays().map((date, index) => {
              const dateStr = formatDate(date);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${isSelected
                    ? 'border-blue-500 bg-accent-50 text-blue-700'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                    } ${isToday(date) ? 'ring-2 ring-blue-200' : ''}`}
                >
                  <div className="font-semibold">{formatDisplayDate(date)}</div>
                  {isToday(date) && (
                    <div className="text-xs text-blue-600 mt-1">Hari Ini</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <ClockIcon className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-primary-700">Pilih Waktu</h3>
          </div>

          {!selectedDate ? (
            <div className="text-center py-8 text-primary-500">
              Pilih tanggal terlebih dahulu
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((time, index) => {
                const isAvailable = isTimeAvailable(time);
                const isSelected = state.selectedTime === time && state.selectedDate === selectedDate;

                return (
                  <button
                    key={index}
                    onClick={() => isAvailable && handleTimeSelect(time)}
                    disabled={!isAvailable}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${isSelected
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : isAvailable
                        ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-primary-700'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <div className="font-semibold">{time}</div>
                    {!isAvailable && (
                      <div className="text-xs mt-1">Penuh</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Schedule Summary */}
      {state.selectedDate && state.selectedTime && (
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-6 mt-6">
          <h4 className="font-semibold text-blue-700 mb-2">Jadwal Terpilih:</h4>
          <p className="text-blue-600">
            {new Date(state.selectedDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • {state.selectedTime}
          </p>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Lanjutkan ke Data Kendaraan →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleSelection;