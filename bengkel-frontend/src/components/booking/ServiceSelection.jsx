import React, { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { serviceService } from '../../services/serviceService';

const ServiceSelection = () => {
  const { state, dispatch } = useBooking();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceService.getServices();
      if (response.success) {
        setServices(response.data.services);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service) => {
    dispatch({ type: 'SET_SERVICE', payload: service });
  };

  const handleContinue = () => {
    dispatch({ type: 'GO_TO_STEP', payload: 2 });
    navigate('/booking/schedule');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-primary-700 mb-4">
          Pilih Layanan Servis
        </h2>
        <p className="text-xl text-primary-600 max-w-2xl mx-auto">
          Pilih jenis servis yang dibutuhkan untuk kendaraan Anda.
          Kami menyediakan berbagai layanan profesional.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${state.selectedService?.id === service.id
                ? 'border-accent-500 ring-2 ring-accent-200'
                : 'border-gray-200 hover:border-primary-300'
                }`}
              onClick={() => handleSelectService(service)}
            >
              {/* Service Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{service.icon || '🔧'}</div>
                  {state.selectedService?.id === service.id && (
                    <div className="bg-accent-500 text-white p-1 rounded-full">
                      <CheckIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-primary-700 mb-2">
                  {service.name}
                </h3>
                <p className="text-primary-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Price & Duration */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-accent-600">
                    {service.formatted_price || `Rp ${service.price?.toLocaleString()}`}
                  </span>
                  <span className="text-sm text-primary-500 bg-primary-50 px-3 py-1 rounded-full">
                    ⏱️ {service.duration}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <h4 className="font-medium text-primary-700 mb-3">
                  Yang termasuk:
                </h4>
                <ul className="space-y-2">
                  {Array.isArray(service.features) ? service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-primary-600">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  )) : (
                    <li className="text-sm text-gray-500 italic">Lihat detail layanan lengkap</li>
                  )}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="p-6 pt-0">
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${state.selectedService?.id === service.id
                    ? 'bg-accent-500 text-white hover:bg-accent-600'
                    : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                    }`}
                >
                  {state.selectedService?.id === service.id ? 'Terpilih' : 'Pilih Layanan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      {state.selectedService && (
        <div className="flex justify-end mt-8">
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-semibold"
          >
            Lanjutkan ke Jadwal →
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;