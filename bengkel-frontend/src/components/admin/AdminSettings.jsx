import React, { useState, useEffect } from 'react';
import {
  BuildingStorefrontIcon,
  UserCircleIcon,
  KeyIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('workshop'); // 'workshop' or 'account'
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Workshop Data
  const [workshopData, setWorkshopData] = useState({
    shop_name: '',
    shop_address: '',
    shop_phone: '',
    working_hours: ''
  });

  // Account Data
  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    password: '' // empty by default
  });

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Fetch Workshop Settings
      const settingsRes = await adminService.getSettings();
      if (settingsRes.success) {
        setWorkshopData(settingsRes.data);
      }

      // Fetch User Profile (we can get it from localStorage or 'me' endpoint if we had one in service, 
      // but usually login stores user in localStorage. For now, let's assume we fetch 'me' or use stored user)
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setAccountData(prev => ({
          ...prev,
          name: user.name,
          email: user.email
        }));
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkshopChange = (e) => {
    const { name, value } = e.target;
    setWorkshopData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const saveWorkshopSettings = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await adminService.updateSettings(workshopData);
      if (response.success) {
        alert('Pengaturan bengkel berhasil disimpan!');
      }
    } catch (error) {
      console.error("Save workshop error:", error);
      alert('Gagal menyimpan pengaturan bengkel.');
    } finally {
      setSubmitting(false);
    }
  };

  const saveAccountSettings = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSend = {
        name: accountData.name,
        email: accountData.email
      };
      if (accountData.password) {
        dataToSend.password = accountData.password;
      }

      const response = await adminService.updateProfile(dataToSend);
      if (response.success) {
        alert('Profil berhasil diperbarui!');
        // Update local storage
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setAccountData(prev => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error("Save account error:", error);
      alert('Gagal memperbarui profil: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-gray-50/50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Sistem</h1>
        <p className="text-gray-500 mt-1">Kelola profil bengkel dan akun admin</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setActiveTab('workshop')}
              className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'workshop'
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <BuildingStorefrontIcon className="w-5 h-5 mr-3" />
              Profil Bengkel
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'account'
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <UserCircleIcon className="w-5 h-5 mr-3" />
              Akun Admin
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'workshop' && (
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <BuildingStorefrontIcon className="w-6 h-6 mr-2 text-blue-600" />
                Informasi Bengkel
              </h2>

              <form onSubmit={saveWorkshopSettings} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Bengkel</label>
                  <div className="relative">
                    <BuildingStorefrontIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="shop_name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={workshopData.shop_name}
                      onChange={handleWorkshopChange}
                      placeholder="Contoh: Bengkel Mobil Premier"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="shop_phone"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        value={workshopData.shop_phone}
                        onChange={handleWorkshopChange}
                        placeholder="0812..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jam Operasional</label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="working_hours"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        value={workshopData.working_hours}
                        onChange={handleWorkshopChange}
                        placeholder="Senin - Jumat, 08:00 - 17:00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="shop_address"
                      rows="3"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                      value={workshopData.shop_address}
                      onChange={handleWorkshopChange}
                      placeholder="Jl. Raya..."
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <KeyIcon className="w-6 h-6 mr-2 text-blue-600" />
                Keamanan Akun
              </h2>

              <form onSubmit={saveAccountSettings} className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-yellow-800 flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Password hanya perlu diisi jika Anda ingin mengubahnya.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Admin</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={accountData.name}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Login</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={accountData.email}
                      onChange={handleAccountChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    value={accountData.password}
                    onChange={handleAccountChange}
                    placeholder="Biarkan kosong jika tetap"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Menyimpan...' : 'Update Profil'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;