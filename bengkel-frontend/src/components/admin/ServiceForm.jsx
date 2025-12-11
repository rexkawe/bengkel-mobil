import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ServiceForm = ({ service, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    features: [''],
    icon: '🛠️',
    is_active: true
  });

  const categories = [
    { value: 'routine', label: 'Servis Berkala' },
    { value: 'engine', label: 'Mesin' },
    { value: 'tire', label: 'Ban & Roda' },
    { value: 'brake', label: 'Rem' },
    { value: 'ac', label: 'AC' },
    { value: 'body', label: 'Body & Interior' }
  ];

  const icons = ['🛠️', '⚙️', '🚗', '🛑', '❄️', '✨', '🔧', '🛢️', '🔩', '🚘'];

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        duration: service.duration || '',
        category: service.category || '',
        features: service.features && service.features.length > 0 ? service.features : [''],
        icon: service.icon || '🛠️',
        is_active: service.is_active !== undefined ? service.is_active : true
      });
    }
  }, [service]);

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty features
    const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');
    
    onSave({
      ...formData,
      features: filteredFeatures,
      price: parseFloat(formData.price)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {service ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h3>
              <button onClick={onClose} className="text-white hover:text-gray-200">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 space-y-6">
            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ikon Layanan
              </label>
              <div className="grid grid-cols-5 gap-2">
                {icons.map((icon, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-3 text-2xl rounded-lg border-2 ${
                      formData.icon === icon 
                        ? 'border-accent-500 bg-accent-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Layanan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Servis Berkala"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Deskripsi singkat tentang layanan..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="350000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="2-3 jam"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fitur Layanan
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-sm text-accent-600 hover:text-accent-700 font-medium"
                >
                  + Tambah Fitur
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder={`Fitur ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                Aktifkan layanan ini
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 font-medium"
              >
                {service ? 'Perbarui' : 'Simpan'} Layanan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;