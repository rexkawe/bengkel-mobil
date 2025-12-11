import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await login(data.email, data.password);
    
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
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4">
          <UserIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-primary-600 mb-2">
          Masuk ke Akun Anda
        </h2>
        <p className="text-gray-600">
          Selamat datang kembali di AutoCare
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.root.message}
          </div>
        )}

        {/* Email Field */}
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

        {/* Password Field */}
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
              placeholder="Masukkan password"
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('remember')}
              className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
            />
            <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
          </label>
          
          <button
            type="button"
            className="text-sm text-accent-600 hover:text-accent-700 font-medium"
          >
            Lupa password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent-500 text-white py-3 px-4 rounded-lg hover:bg-accent-600 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Memproses...
            </div>
          ) : (
            'Masuk sebagai Customer'
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Belum punya akun?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-accent-600 hover:text-accent-700 font-semibold"
          >
            Daftar sekarang
          </button>
        </p>
      </div>

      {/* Admin Login Link */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          Staff AutoCare?{' '}
          <Link 
            to="/admin/login" 
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Masuk sebagai Admin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;