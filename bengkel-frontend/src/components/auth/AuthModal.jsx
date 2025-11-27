import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  // Close modal when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false);
    }
  }, [isAuthenticated]);

  // Listen for auth modal open event
  useEffect(() => {
    const handleOpenAuthModal = () => {
      console.log('AuthModal: Open event received');
      setIsOpen(true);
      setIsLogin(true);
    };

    // Custom event untuk membuka auth modal
    window.addEventListener('openAuthModal', handleOpenAuthModal);
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  // Debug log when modal state changes
  useEffect(() => {
    console.log('AuthModal state - isOpen:', isOpen, 'isLogin:', isLogin);
  }, [isOpen, isLogin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => {
            console.log('AuthModal: Background clicked, closing');
            setIsOpen(false);
          }}
        ></div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Close button */}
          <button
            onClick={() => {
              console.log('AuthModal: Close button clicked');
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Auth content */}
          <div className="bg-white p-6 sm:p-8">
            {isLogin ? (
              <LoginForm 
                onSwitchToRegister={() => {
                  console.log('AuthModal: Switching to register');
                  setIsLogin(false);
                }} 
              />
            ) : (
              <RegisterForm 
                onSwitchToLogin={() => {
                  console.log('AuthModal: Switching to login');
                  setIsLogin(true);
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;