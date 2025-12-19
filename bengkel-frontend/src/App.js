import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ChatProvider } from './context/ChatContext';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ContactSection from './components/sections/ContactSection';
import ServiceSelection from './components/booking/ServiceSelection';
import ScheduleSelection from './components/booking/ScheduleSelection';
import VehicleInfoForm from './components/booking/VehicleInfoForm';
import BookingConfirmation from './components/booking/BookingConfirmation';
import ChatContainer from './components/chat/ChatContainer';
import AdminDashboard from './components/admin/AdminDashboard';
import BookingManagement from './components/admin/BookingManagement';
import ServiceManagement from './components/admin/ServiceManagement';
import CustomerManagement from './components/admin/CustomerManagement';
import AdminSettings from './components/admin/AdminSettings';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserDashboard from './components/user/UserDashboard';

// Auth Components
import AdminLogin from './components/auth/AdminLogin';
import CustomerLogin from './components/auth/CustomerLogin';
import RegisterForm from './components/auth/RegisterForm';

// Main Content Component (Public Routes)
function MainContent() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <HeroSection />
              <div className="bg-gray-50 py-12">
                <ServiceSelection />
              </div>
              <AboutSection />
              <ContactSection />
            </>
          } />

          {/* Auth Routes */}
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Booking Routes */}
          <Route path="/booking" element={
            <div className="pt-20 bg-gray-50 min-h-screen">
              <ServiceSelection />
            </div>
          } />
          <Route path="/booking/schedule" element={
            <div className="pt-20 bg-gray-50 min-h-screen">
              <ScheduleSelection />
            </div>
          } />
          <Route path="/booking/vehicle" element={
            <div className="pt-20 bg-gray-50 min-h-screen">
              <VehicleInfoForm />
            </div>
          } />
          <Route path="/booking/confirmation" element={
            <div className="pt-20 bg-gray-50 min-h-screen">
              <BookingConfirmation />
            </div>
          } />

          {/* User Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ChatContainer />
    </div>
  );
}

// Admin Routes Component
function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}

// App Component dengan semua Providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <ChatProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/*" element={<MainContent />} />

              {/* Admin Login Route - DI LUAR MainContent */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute requireAdmin>
                  <AdminRoutes />
                </ProtectedRoute>
              } />
            </Routes>
          </ChatProvider>
        </BookingProvider>
      </AuthProvider>
    </Router >
  );
}

export default App;