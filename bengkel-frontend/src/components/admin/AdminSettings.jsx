import React from 'react';
import { CogIcon } from '@heroicons/react/24/outline';

const AdminSettings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">
            Pengaturan
          </h1>
          <p className="text-gray-600">
            Kelola pengaturan sistem dan aplikasi
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-12">
            <CogIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Pengaturan Sistem
            </h3>
            <p className="text-gray-500">
              Fitur pengaturan akan segera hadir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;