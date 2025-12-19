import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    new_this_month: 0
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchCustomers(1);
    fetchStats();
  }, [debouncedSearch]);

  const fetchStats = async () => {
    try {
      const response = await adminService.getCustomerStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        search: debouncedSearch
      };

      const response = await adminService.getCustomers(params);
      if (response.success) {
        setCustomers(response.data.customers);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchCustomers(newPage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', email: '', password: '', phone: '', address: '' });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setModalMode('edit');
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      password: '', // Leave empty if not changing
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pelanggan "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        const response = await adminService.deleteCustomer(id);
        if (response.success) {
          alert('Pelanggan berhasil dihapus');
          fetchCustomers(pagination.current_page);
          fetchStats(); // Update stats
        }
      } catch (error) {
        console.error("Failed to delete customer:", error);
        alert(`Gagal menghapus pelanggan: ${error.message || 'Terjadi kesalahan'}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      let response;
      if (modalMode === 'add') {
        response = await adminService.createCustomer(formData);
      } else {
        // Filter out empty password for update
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password;

        response = await adminService.updateCustomer(selectedCustomer.id, dataToSend);
      }

      if (response.success) {
        setShowModal(false);
        setFormData({ name: '', email: '', password: '', phone: '', address: '' });
        alert(modalMode === 'add' ? 'Pelanggan berhasil ditambahkan!' : 'Data pelanggan berhasil diperbarui!');
        fetchCustomers(pagination.current_page);
        fetchStats(); // Update stats
      }
    } catch (error) {
      console.error(`Failed to ${modalMode} customer:`, error);
      if (error.response && error.response.data && error.response.data.errors) {
        setFormErrors(error.response.data.errors);
      } else if (error.response && error.response.data && error.response.data.error) {
        alert(`Gagal: ${error.response.data.error}`);
      } else {
        alert(`Gagal menyimpan data: ${error.message || 'Terjadi kesalahan'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-gray-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pelanggan</h1>
          <p className="text-gray-500 mt-1">Data lengkap semua pelanggan bengkel</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Tambah Pelanggan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pelanggan</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mr-4">
            <UserCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pelanggan Aktif</p>
            <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mr-4">
            <PlusIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Baru Bulan Ini</p>
            <p className="text-2xl font-bold text-gray-800">{stats.new_this_month}</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="relative max-w-lg">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau nomor telepon..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Memuat data pelanggan...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pelanggan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kontak</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Alamat</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Histori Servis</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">{customer.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">Joined: {customer.created_at}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                              {customer.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                              {customer.phone || '-'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start text-sm text-gray-600 max-w-xs truncate">
                            <MapPinIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="truncate">{customer.address || 'Alamat belum diisi'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            <WrenchScrewdriverIcon className="w-3 h-3 mr-1" />
                            {customer.bookings_count} Booking
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${customer.is_active !== 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {customer.is_active !== 0 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(customer)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Pelanggan"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(customer.id, customer.name)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus Pelanggan"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <UsersIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                        <p>Belum ada data pelanggan.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="text-sm text-gray-500">
                Menampilkan <span className="font-medium">{(pagination.current_page - 1) * 15 + 1}</span> sampai <span className="font-medium">{Math.min(pagination.current_page * 15, pagination.total)}</span> dari <span className="font-medium">{pagination.total}</span> data
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className={`p-2 rounded-lg border ${pagination.current_page === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className={`p-2 rounded-lg border ${pagination.current_page === pagination.last_page
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === 'add' ? 'Tambah Pelanggan Baru' : 'Edit Pelanggan'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {modalMode === 'edit' && <span className="text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    required={modalMode === 'add'}
                    minLength="6"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={modalMode === 'edit' ? '******' : ''}
                  />
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea
                    name="address"
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                    value={formData.address}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Pelanggan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;