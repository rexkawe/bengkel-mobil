import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);

    // Combine first_name and last_name into name required by backend
    const payload = {
      ...data,
      name: `${data.first_name} ${data.last_name}`.trim()
    };

    const result = await registerAuth(payload);

    if (!result.success) {
      setError('root', {
        type: 'manual',
        message: result.message
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary-600 mb-2">
          Buat Akun Baru
        </h2>
        <p className="text-gray-600">
          Bergabung dengan TDY Auto Service sekarang
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.root.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Depan
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register('first_name', {
                  required: 'Nama depan harus diisi'
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200"
                placeholder="John"
              />
            </div>
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Belakang
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register('last_name', {
                  required: 'Nama belakang harus diisi'
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200"
                placeholder="Doe"
              />
            </div>
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email harus diisi',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Format email tidak valid'
              }
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200"
            placeholder="masukan@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Telepon
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              {...register('phone', {
                required: 'Nomor telepon harus diisi',
                pattern: {
                  value: /^[0-9+\-\s()]*$/,
                  message: 'Format nomor telepon tidak valid'
                }
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200"
              placeholder="08123456789"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password harus diisi',
                minLength: {
                  value: 6,
                  message: 'Password minimal 6 karakter'
                }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200 pr-12"
              placeholder="Minimal 6 karakter"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konfirmasi Password
          </label>
          <input
            type="password"
            {...register('password_confirmation', {
              required: 'Konfirmasi password harus diisi',
              validate: value =>
                value === password || 'Password tidak cocok'
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200"
            placeholder="Ulangi password"
          />
          {errors.password_confirmation && (
            <p className="mt-1 text-sm text-red-600">{errors.password_confirmation.message}</p>
          )}
        </div>

        {/* Terms Agreement */}
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            {...register('terms', {
              required: 'Anda harus menyetujui syarat dan ketentuan'
            })}
            className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500 mt-1"
          />
          <span className="text-sm text-gray-600">
            Saya menyetujui{' '}
            <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
              Syarat & Ketentuan
            </button>{' '}
            dan{' '}
            <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
              Kebijakan Privasi
            </button>
          </span>
        </label>
        {errors.terms && (
          <p className="text-sm text-red-600">{errors.terms.message}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Membuat akun...
            </div>
          ) : (
            'Daftar Sekarang'
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Sudah punya akun?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;