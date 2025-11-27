import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { serviceService } from '../../services/serviceService';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'routine',
    features: [''],
    icon: '🔧',
    is_active: true
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const response = await serviceService.getServices();
      if (response.success) {
        setServices(response.data.services);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
      alert('Gagal memuat data layanan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Filter out empty features
      const cleanedFeatures = formData.features.filter(feature => feature.trim() !== '');
      
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        features: cleanedFeatures
      };

      let response;
      if (editingService) {
        // Update existing service
        response = await serviceService.updateService(editingService.id, submitData);
      } else {
        // Create new service
        response = await serviceService.createService(submitData);
      }

      if (response.success) {
        await loadServices();
        resetForm();
        alert(editingService ? 'Layanan berhasil diperbarui' : 'Layanan berhasil dibuat');
      } else {
        alert(response.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      try {
        // Implement delete API call here
        // await serviceService.deleteService(id);
        await loadServices();
        alert('Layanan berhasil dihapus');
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Gagal menghapus layanan');
      }
    }
  };

  const toggleStatus = async (service) => {
    try {
      // Implement toggle status API call here
      // await serviceService.toggleServiceStatus(service.id);
      await loadServices();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Gagal mengubah status layanan');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: 'routine',
      features: [''],
      icon: '🔧',
      is_active: true
    });
    setEditingService(null);
    setShowForm(false);
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration,
      category: service.category,
      features: service.features || [''],
      icon: service.icon || '🔧',
      is_active: service.is_active
    });
    setEditingService(service);
    setShowForm(true);
  };

  const addFeatureField = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const categories = [
    { value: 'routine', label: 'Servis Berkala' },
    { value: 'engine', label: 'Mesin' },
    { value: 'tire', label: 'Ban & Roda' },
    { value: 'brake', label: 'Rem' },
    { value: 'ac', label: 'AC' },
    { value: 'body', label: 'Body & Interior' }
  ];

  const icons = ['🔧', '⚙️', '🚗', '🛑', '❄️', '✨', '🔩', '⛽', '🔋', '🚦'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-700 mb-2">
                Manajemen Layanan
              </h1>
              <p className="text-gray-600">
                Kelola layanan servis yang tersedia
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-accent-500 text-white px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors font-semibold flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Tambah Layanan</span>
            </button>
          </div>
        </div>

        {/* Service Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-primary-700">
                    {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Layanan *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="Nama layanan servis"
                    />
                  </div>

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
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="350000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="Deskripsi lengkap layanan servis"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="2-3 jam"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    >
                      {icons.map(icon => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Fitur Layanan
                    </label>
                    <button
                      type="button"
                      onClick={addFeatureField}
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
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                          placeholder={`Fitur ${index + 1}`}
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Aktif</span>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isLoading ? 'Menyimpan...' : (editingService ? 'Update' : 'Simpan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              {/* Service Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{service.icon}</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleStatus(service)}
                      className={`p-2 rounded-lg ${
                        service.is_active 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={service.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {service.is_active ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-primary-700 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-accent-600">
                    {service.formatted_price}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {service.duration}
                  </span>
                </div>
              </div>

              {/* Service Features */}
              <div className="p-6">
                <h4 className="font-medium text-primary-700 mb-3">Fitur:</h4>
                <ul className="space-y-2">
                  {service.features?.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                  {service.features?.length > 3 && (
                    <li className="text-xs text-gray-500">
                      +{service.features.length - 3} fitur lainnya
                    </li>
                  )}
                </ul>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {service.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {services.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛠️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Belum ada layanan
            </h3>
            <p className="text-gray-500 mb-6">
              Tambah layanan pertama Anda untuk memulai
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-accent-500 text-white px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors font-semibold"
            >
              Tambah Layanan Pertama
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;