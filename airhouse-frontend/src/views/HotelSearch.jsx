import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Home, ArrowRight, Star } from 'lucide-react';
import { api } from '../api';

export default function HotelSearch({ onSelectHotel, searchParams, onSetSearchParams }) {
  const [city, setCity] = useState(searchParams.city || '');
  const [startDate, setStartDate] = useState(searchParams.startDate || getDefaultDate(1));
  const [endDate, setEndDate] = useState(searchParams.endDate || getDefaultDate(2));
  const [roomsCount, setRoomsCount] = useState(searchParams.roomsCount || 1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default suggestions
  const defaultCities = ['Delhi', 'Noida', 'Mumbai', 'Goa', 'Bengaluru'];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const queryParams = {
      city: city || undefined,
      startDate,
      endDate,
      roomsCount: parseInt(roomsCount),
      page: 0,
      size: 20
    };

    // Store search params globally so they carry over to details and checkout
    onSetSearchParams(queryParams);

    try {
      const response = await api.searchHotels(queryParams);
      // Spring Boot Page has a 'content' array
      const content = response.content || response || [];
      setHotels(content);
      if (content.length === 0) {
        setError('No hotels found matching your search. Try changing the dates or city!');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to search hotels. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Perform search on mount
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getDefaultDate(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
  }

  return (
    <div className="section" style={{ paddingTop: '24px' }}>
      {/* Hero Banner */}
      <div style={heroBannerStyle()}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="title-xl" style={{ color: 'white', marginBottom: '16px' }}>
            Find Your Next Perfect Stay
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginBottom: '32px' }}>
            Book unique hotels and luxury experiences across the country.
          </p>

          {/* Search Bar Panel */}
          <form onSubmit={handleSearch} style={searchPanelStyle()}>
            <div style={searchFieldStyle()}>
              <div style={iconContainerStyle()}><MapPin size={18} color="var(--primary)" /></div>
              <div style={{ flex: 1 }}>
                <span style={searchLabelStyle()}>Where</span>
                <input
                  type="text"
                  placeholder="Search destinations (e.g. Noida)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={searchInputStyle()}
                />
              </div>
            </div>

            <div style={searchDividerStyle()}></div>

            <div style={searchFieldStyle()}>
              <div style={iconContainerStyle()}><Calendar size={18} color="var(--primary)" /></div>
              <div style={{ flex: 1 }}>
                <span style={searchLabelStyle()}>Check In</span>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={searchInputStyle()}
                  required
                />
              </div>
            </div>

            <div style={searchDividerStyle()}></div>

            <div style={searchFieldStyle()}>
              <div style={iconContainerStyle()}><Calendar size={18} color="var(--primary)" /></div>
              <div style={{ flex: 1 }}>
                <span style={searchLabelStyle()}>Check Out</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={searchInputStyle()}
                  required
                />
              </div>
            </div>

            <div style={searchDividerStyle()}></div>

            <div style={searchFieldStyle()}>
              <div style={iconContainerStyle()}><Home size={18} color="var(--primary)" /></div>
              <div style={{ flex: 1 }}>
                <span style={searchLabelStyle()}>Rooms</span>
                <select
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(e.target.value)}
                  style={{ ...searchInputStyle(), cursor: 'pointer' }}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-icon" style={{ width: '52px', height: '52px', flexShrink: 0 }}>
              <Search size={22} />
            </button>
          </form>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Popular:</span>
            {defaultCities.map(c => (
              <button
                key={c}
                onClick={() => { setCity(c); }}
                style={tagButtonStyle()}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hotel grid listings */}
      <div className="container" style={{ marginTop: '40px' }}>
        <h2 className="title-md" style={{ marginBottom: '24px', textAlign: 'left' }}>
          {city ? `Available Stays in ${city}` : 'Featured Stays'}
        </h2>

        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
            <p className="text-sub">Searching for available stays...</p>
          </div>
        )}

        {error && !loading && (
          <div style={errorCardStyle()}>
            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{error}</p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }} onClick={handleSearch}>
              Retry Search
            </button>
          </div>
        )}

        {!loading && !error && (
          <div style={hotelGridStyle()}>
            {hotels.map(hotel => (
              <div key={hotel.id} className="card" style={hotelCardStyle()}>
                {/* Photo Gallery / Main Photo */}
                <div style={imageContainerStyle()}>
                  <img
                    src={hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
                    alt={hotel.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={priceBadgeStyle()}>
                    ₹{hotel.price || 1500} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/ night</span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{hotel.name}</h3>
                      <p className="text-sub" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="var(--primary)" /> {hotel.city}
                      </p>
                    </div>
                    <div style={starRatingStyle()}>
                      <Star size={14} fill="var(--warning)" color="var(--warning)" />
                      <span>4.8</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '12px 0' }}>
                    {hotel.amenities && hotel.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} style={amenityBadgeStyle()}>
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities && hotel.amenities.length > 3 && (
                      <span style={amenityBadgeStyle()}>+{hotel.amenities.length - 3} more</span>
                    )}
                  </div>

                  <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>CONTACT</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                        {hotel.contactInfo?.phoneNumber || 'No phone number'}
                      </span>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => onSelectHotel(hotel)}>
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline Styles for Premium Design
function heroBannerStyle() {
  return {
    position: 'relative',
    background: 'linear-gradient(135deg, #FF385C 0%, #764BA2 100%)',
    borderRadius: '24px',
    padding: '64px 24px',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden'
  };
}

function searchPanelStyle() {
  return {
    display: 'flex',
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--radius-full)',
    padding: '8px 16px',
    boxShadow: 'var(--shadow-xl)',
    maxWidth: '900px',
    margin: '0 auto',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid var(--border-color)',
    flexWrap: 'wrap'
  };
}

function searchFieldStyle() {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: '160px',
    padding: '8px 12px',
    textAlign: 'left'
  };
}

function iconContainerStyle() {
  return {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
}

function searchLabelStyle() {
  return {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-light)'
  };
}

function searchInputStyle() {
  return {
    width: '100%',
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: '2px 0 0 0'
  };
}

function searchDividerStyle() {
  return {
    width: '1px',
    height: '40px',
    backgroundColor: 'var(--border-color)',
    alignSelf: 'center'
  };
}

function tagButtonStyle() {
  return {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    padding: '6px 16px',
    color: 'white',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontWeight: 500,
    backdropFilter: 'blur(4px)',
    transition: 'var(--transition)'
  };
}

function hotelGridStyle() {
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  };
}

function hotelCardStyle() {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    textAlign: 'left'
  };
}

function imageContainerStyle() {
  return {
    height: '220px',
    width: '100%',
    position: 'relative',
    backgroundColor: '#e2e8f0',
    overflow: 'hidden'
  };
}

function priceBadgeStyle() {
  return {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(4px)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 700,
    fontSize: '1rem',
    boxShadow: 'var(--shadow-md)'
  };
}

function starRatingStyle() {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.9rem',
    fontWeight: 600
  };
}

function amenityBadgeStyle() {
  return {
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    padding: '4px 8px',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--text-muted)'
  };
}

function errorCardStyle() {
  return {
    padding: '40px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '40px auto'
  };
}
