import React, { createContext, useContext, useReducer } from 'react';
import { bookingService } from '../services/bookingService';

const BookingContext = createContext();

const initialState = {
  selectedService: null,
  selectedDate: '',
  selectedTime: '',
  customerInfo: {
    name: '',
    email: '',
    phone: '',
    carType: '',
    carPlate: '',
    carModel: '',
    year: ''
  },
  step: 1,
  bookingNotes: '',
  availableTimes: [],
  isLoading: false
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_SERVICE':
      return {
        ...state,
        selectedService: action.payload,
        step: 2
      };
    
    case 'SET_SCHEDULE':
      return {
        ...state,
        selectedDate: action.payload.date,
        selectedTime: action.payload.time,
        step: 3
      };
    
    case 'SET_CUSTOMER_INFO':
      return {
        ...state,
        customerInfo: { ...state.customerInfo, ...action.payload },
        step: 4
      };
    
    case 'SET_BOOKING_NOTES':
      return {
        ...state,
        bookingNotes: action.payload
      };
    
    case 'SET_AVAILABLE_TIMES':
      return {
        ...state,
        availableTimes: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'GO_TO_STEP':
      return {
        ...state,
        step: action.payload
      };
    
    case 'RESET_BOOKING':
      return initialState;
    
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const fetchAvailableTimes = async (date) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await bookingService.getAvailableTimes(date);
      
      if (response.success) {
        dispatch({ 
          type: 'SET_AVAILABLE_TIMES', 
          payload: response.data.available_times 
        });
      }
    } catch (error) {
      console.error('Error fetching available times:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createBooking = async (bookingData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await bookingService.createBooking(bookingData);
      
      if (response.success) {
        dispatch({ type: 'RESET_BOOKING' });
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed';
      return { success: false, message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    state,
    dispatch,
    fetchAvailableTimes,
    createBooking
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};