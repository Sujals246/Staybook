import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HotelSearch from './views/HotelSearch';
import HotelDetails from './views/HotelDetails';
import Checkout from './views/Checkout';
import MyBookings from './views/MyBookings';
import Profile from './views/Profile';
import ManagerDashboard from './views/ManagerDashboard';
import './App.css';

function MainAppContent() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('search'); // 'search', 'details', 'checkout', 'bookings', 'profile', 'manager'
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  // Shared search parameters
  const [searchParams, setSearchParams] = useState({
    city: '',
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    endDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after
    roomsCount: 1
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
    setActiveView('details');
  };

  const handleStartCheckout = (bookingDTO, room) => {
    setCurrentBooking(bookingDTO);
    setSelectedRoom(room);
    setActiveView('checkout');
  };

  const renderView = () => {
    switch (activeView) {
      case 'search':
        return (
          <HotelSearch
            onSelectHotel={handleSelectHotel}
            searchParams={searchParams}
            onSetSearchParams={setSearchParams}
          />
        );
      case 'details':
        return (
          <HotelDetails
            hotel={selectedHotel}
            searchParams={searchParams}
            onBack={() => setActiveView('search')}
            onOpenAuth={() => setAuthModalOpen(true)}
            onStartCheckout={handleStartCheckout}
          />
        );
      case 'checkout':
        return (
          <Checkout
            booking={currentBooking}
            room={selectedRoom}
            searchParams={searchParams}
            onBack={() => setActiveView('details')}
            onBookingSuccess={() => setActiveView('bookings')}
          />
        );
      case 'bookings':
        return <MyBookings />;
      case 'profile':
        return <Profile />;
      case 'manager':
        return <ManagerDashboard />;
      default:
        return (
          <HotelSearch
            onSelectHotel={handleSelectHotel}
            searchParams={searchParams}
            onSetSearchParams={setSearchParams}
          />
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onSetView={setActiveView}
        activeView={activeView}
        isDark={darkMode}
        onToggleDark={toggleDarkMode}
      />
      
      <main style={{ flex: 1 }}>
        {renderView()}
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
