import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ChatContext = createContext();

const initialState = {
  isChatOpen: false,
  messages: [],
  unreadCount: 0,
  isTyping: false,
  currentMessage: '',
  chatHistory: [],
  activeChat: null,
  hasWelcomed: false
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'OPEN_CHAT':
      return {
        ...state,
        isChatOpen: true,
        unreadCount: 0
      };
    
    case 'CLOSE_CHAT':
      return {
        ...state,
        isChatOpen: false
      };
    
    case 'TOGGLE_CHAT':
      return {
        ...state,
        isChatOpen: !state.isChatOpen,
        unreadCount: state.isChatOpen ? state.unreadCount : 0
      };
    
    case 'ADD_MESSAGE':
      const newMessages = [...state.messages, action.payload];
      const newUnreadCount = state.isChatOpen ? 0 : state.unreadCount + 1;
      
      return {
        ...state,
        messages: newMessages,
        unreadCount: newUnreadCount,
        isTyping: action.payload.sender === 'user' ? true : false
      };
    
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      };
    
    case 'SET_CURRENT_MESSAGE':
      return {
        ...state,
        currentMessage: action.payload
      };
    
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        hasWelcomed: false
      };
    
    case 'LOAD_CHAT_HISTORY':
      return {
        ...state,
        chatHistory: action.payload
      };
    
    case 'SET_WELCOMED':
      return {
        ...state,
        hasWelcomed: true
      };
    
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Welcome message ketika chat pertama kali dibuka
  useEffect(() => {
    if (state.isChatOpen && state.messages.length === 0 && !state.hasWelcomed) {
      const welcomeTimer = setTimeout(() => {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: Date.now(),
            text: 'Halo! Selamat datang di Adit AutoCare. 👋 Saya di sini untuk membantu Anda dengan informasi servis, booking, atau pertanyaan lainnya tentang kendaraan Anda.',
            sender: 'admin',
            timestamp: new Date(),
            read: true
          }
        });

        dispatch({ type: 'SET_WELCOMED', payload: true });

        // Follow-up message setelah welcome
        const followUpTimer = setTimeout(() => {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: Date.now() + 1,
              text: 'Ada yang bisa saya bantu? Anda bisa menanyakan tentang:\n• Jenis layanan servis\n• Estimasi biaya\n• Jadwal operasional\n• Cara booking servis\n• Atau pertanyaan lainnya',
              sender: 'admin',
              timestamp: new Date(),
              read: true
            }
          });
        }, 2000);

        return () => clearTimeout(followUpTimer);
      }, 500);

      return () => clearTimeout(welcomeTimer);
    }
  }, [state.isChatOpen, state.messages.length, state.hasWelcomed]);

  // Auto-response simulation untuk user messages
  useEffect(() => {
    if (state.isTyping && state.messages.length > 0) {
      const lastMessage = state.messages[state.messages.length - 1];
      
      if (lastMessage.sender === 'user') {
        const timer = setTimeout(() => {
          const responses = {
            'halo': 'Halo! 😊 Selamat datang di Adit AutoCare. Ada yang bisa saya bantu mengenai kendaraan Anda?',
            'servis': 'Kami menyediakan berbagai layanan servis profesional:\n\n🔧 **Servis Berkala** - Rp 350.000\n⚙️ **Tune Up Mesin** - Rp 550.000\n🚗 **Ganti Ban & Spooring** - Rp 200.000\n🛑 **Service Rem** - Rp 450.000\n❄️ **Service AC** - Rp 300.000\n✨ **Full Body Treatment** - Rp 750.000\n\nServis mana yang Anda butuhkan?',
            'harga': 'Berikut estimasi harga layanan kami:\n\n• Servis Berkala: Rp 350.000\n• Tune Up Mesin: Rp 550.000\n• Ganti Ban: Rp 200.000\n• Service Rem: Rp 450.000\n• Service AC: Rp 300.000\n• Full Body Treatment: Rp 750.000\n\n*Harga dapat berubah tergantung kondisi kendaraan*',
            'jadwal': '🕒 **Jam Operasional Adit AutoCare:**\n\n📅 Senin - Jumat: 08:00 - 18:00\n📅 Sabtu: 08:00 - 16:00\n📅 Minggu: Tutup\n\n📍 **Lokasi:** Jl. Bengkel Modern No. 123, Jakarta\n📞 **Telepon:** (021) 1234-5678',
            'booking': 'Untuk booking servis, Anda bisa:\n\n1. **Online:** Klik tombol "Booking Servis" di website kami\n2. **Telepon:** Hubungi (021) 1234-5678\n3. **Datang Langsung:** Ke bengkel kami di jam operasional\n\nMau booking untuk layanan apa?',
            'lokasi': '📍 **Adit AutoCare Bengkel Modern**\nJl. Bengkel Modern No. 123\nJakarta Selatan 12560\n\n🚗 *Parkir luas tersedia*\n🅿️ *Gratis parkir untuk customer*',
            'darurat': 'Untuk layanan darurat di luar jam operasional, silakan hubungi:\n\n📞 **Emergency Contact:** 0812-3456-7890\n\nKami siap membantu 24 jam untuk kondisi darurat.',
            'default': 'Terima kasih sudah menghubungi Adit AutoCare! 🙏\n\nUntuk informasi lebih detail atau konsultasi teknis, silakan:\n\n• Hubungi kami di (021) 1234-5678\n• Datang langsung ke bengkel kami\n• Atau booking servis melalui website\n\nAda hal lain yang bisa saya bantu?'
          };

          let response = responses.default;
          const userMessage = lastMessage.text.toLowerCase();

          if (userMessage.includes('halo') || userMessage.includes('hi') || userMessage.includes('hai')) {
            response = responses.halo;
          } else if (userMessage.includes('servis') || userMessage.includes('service') || userMessage.includes('perbaikan')) {
            response = responses.servis;
          } else if (userMessage.includes('harga') || userMessage.includes('biaya') || userMessage.includes('tarif') || userMessage.includes('mahal')) {
            response = responses.harga;
          } else if (userMessage.includes('jadwal') || userMessage.includes('buka') || userMessage.includes('jam') || userMessage.includes('operasional')) {
            response = responses.jadwal;
          } else if (userMessage.includes('booking') || userMessage.includes('pesan') || userMessage.includes('daftar') || userMessage.includes('reservasi')) {
            response = responses.booking;
          } else if (userMessage.includes('lokasi') || userMessage.includes('alamat') || userMessage.includes('tempat') || userMessage.includes('dimana')) {
            response = responses.lokasi;
          } else if (userMessage.includes('darurat') || userMessage.includes('emergency') || userMessage.includes('mendesak') || userMessage.includes('terdesak')) {
            response = responses.darurat;
          }

          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: Date.now(),
              text: response,
              sender: 'admin',
              timestamp: new Date(),
              read: true
            }
          });

          dispatch({ type: 'SET_TYPING', payload: false });
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [state.isTyping, state.messages]);

  const sendMessage = (text) => {
    if (text.trim()) {
      const message = {
        id: Date.now(),
        text: text.trim(),
        sender: 'user',
        timestamp: new Date(),
        read: true
      };

      dispatch({ type: 'ADD_MESSAGE', payload: message });
      dispatch({ type: 'SET_CURRENT_MESSAGE', payload: '' });
    }
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  const value = {
    ...state,
    dispatch,
    sendMessage,
    clearChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};