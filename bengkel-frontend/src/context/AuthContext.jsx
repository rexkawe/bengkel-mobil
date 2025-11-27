import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check authentication status on app start
   */
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        const response = await authService.getMe();
        
        if (response.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear storage
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear authentication data from storage and state
   */
  const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Login user with email and password
   */
  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await authService.login(email, password);
      console.log('📨 Login API response:', response);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Save to storage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        console.log('✅ Login successful, user role:', user.role);
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
        
        return { 
          success: true, 
          message: response.message 
        };
      } else {
        console.log('❌ Login failed:', response.message);
        return { 
          success: false, 
          message: response.message 
        };
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      
      const message = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Login failed';
      
      return { 
        success: false, 
        message 
      };
    }
  };

  /**
   * Register new user
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Save to storage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        // Redirect customer to dashboard after registration
        navigate('/dashboard');
        
        return { 
          success: true, 
          message: response.message 
        };
      } else {
        return { 
          success: false, 
          message: response.message 
        };
      }
    } catch (error) {
      console.error('💥 Registration error:', error);
      
      const message = error.response?.data?.message 
        || 'Registration failed';
      
      return { 
        success: false, 
        message 
      };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      
      // Try API logout first
      await authService.logout();
      console.log('✅ API logout successful');
      
    } catch (error) {
      console.log('⚠️ API logout failed, continuing with local logout:', error);
      // Continue with local logout even if API fails
    } finally {
      // Always perform local cleanup
      clearAuthData();
      console.log('🧹 Local cleanup completed');
      
      // Redirect to home page
      navigate('/');
    }
  };

  /**
   * Context value
   */
  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    register,
    logout,
    
    // Utilities
    clearAuthData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};