import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Award, CheckCircle, Users, Sparkles } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function HotelDetails({ hotel, searchParams, onBack, onOpenAuth, onStartCheckout }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initiatingBookingId, setInitiatingBookingId] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch hotel info (with room pricing dynamically calculated for search dates)
        const filterParams = {
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
          roomsCount: parseInt(searchParams.roomsCount || 1)
        };
        const info = await api.getHotelInfo(hotel.id, filterParams);
        setRooms(info.rooms || []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to fetch room pricing details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [hotel.id, searchParams]);

  const handleBookRoom = async (room) => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setInitiatingBookingId(room.id);
    try {
      const bookingRequest = {
        hotelId: hotel.id,
        roomId: room.id,
        checkInDate: searchParams.startDate,
        checkOutDate: searchParams.endDate,
        roomsCount: parseInt(searchParams.roomsCount || 1)
      };

      const bookingDTO = await api.initializeBooking(bookingRequest);
      onStartCheckout(bookingDTO, room);
    } catch (err) {
      alert(err.message || 'Failed to initialize booking.');
    } finally {
      setInitiatingBookingId(null);
    }
  };

  return (
    <div className="container section" style={{ textAlign: 'left', paddingTop: '24px' }}>
      {/* Back button */}
      <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={16} /> Back to Listings
      </button>

      {/* Hotel Heading Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '40px' }}>
        {/* Images */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={mainImageStyle()}>
            <img
              src={hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
              alt={hotel.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {/* Thumbnails if available */}
          {hotel.photos && hotel.photos.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {hotel.photos.slice(1, 4).map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`Thumbnail ${i}`}
                  style={{ width: '80px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details & Location */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="title-lg" style={{ marginBottom: '12px' }}>{hotel.name}</h2>
          <p className="text-sub" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
            <MapPin size={18} color="var(--primary)" /> {hotel.contactInfo?.address || hotel.city}
          </p>

          <div style={infoGridStyle()}>
            <div style={infoCardStyle()}>
              <Phone size={16} color="var(--primary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>PHONE</span>
                <span style={{ fontWeight: 600 }}>{hotel.contactInfo?.phoneNumber || 'N/A'}</span>
              </div>
            </div>
            <div style={infoCardStyle()}>
              <Mail size={16} color="var(--primary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>EMAIL</span>
                <span style={{ fontWeight: 600 }}>{hotel.contactInfo?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '10px' }}>Hotel Amenities</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {hotel.amenities && hotel.amenities.map((amenity, idx) => (
                <span key={idx} style={amenityChipStyle()}>
                  <CheckCircle size={12} color="var(--success)" /> {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Pricing & Availability Section */}
      <div>
        <h3 className="title-md" style={{ marginBottom: '8px' }}>Available Room Types</h3>
        <p className="text-sub" style={{ marginBottom: '24px' }}>
          Showing rates for: <strong>{searchParams.startDate}</strong> to <strong>{searchParams.endDate}</strong> ({searchParams.roomsCount} room{parseInt(searchParams.roomsCount) > 1 ? 's' : ''})
        </p>

        {loading && (
          <div className="loader-container" style={{ minHeight: '200px' }}>
            <div className="spinner"></div>
            <p className="text-sub">Calculating rates and availability...</p>
          </div>
        )}

        {error && !loading && (
          <div style={errorCardStyle()}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div style={roomsGridStyle()}>
            {rooms.map((room) => {
              // Calculate if there's any active surge factor
              const basePrice = parseFloat(room.basePrice || 0);
              const activePrice = parseFloat(room.price || 0);
              const surgePercentage = basePrice > 0 ? Math.round(((activePrice - basePrice) / basePrice) * 100) : 0;
              const hasSurge = surgePercentage > 0;

              return (
                <div key={room.id} className="card" style={roomCardStyle()}>
                  {/* Image */}
                  <div style={roomImageStyle()}>
                    <img
                      src={room.photos && room.photos.length > 0 ? room.photos[0] : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=400&q=80'}
                      alt={room.type}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {hasSurge && (
                      <div style={surgeLabelStyle()}>
                        <Sparkles size={12} /> High Demand (+{surgePercentage}%)
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{room.type}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Users size={14} />
                        <span>Cap: {room.capacity || 2} Guests</span>
                      </div>
                    </div>

                    {/* Room Amenities */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: '8px 0' }}>
                      {room.amenities && room.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} style={roomAmenityStyle()}>{a}</span>
                      ))}
                    </div>

                    {/* Price and Action */}
                    <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        {hasSurge && (
                          <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>
                            ₹{basePrice}
                          </span>
                        )}
                        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                          ₹{activePrice}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / night</span>
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={() => handleBookRoom(room)}
                        disabled={initiatingBookingId === room.id}
                        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                      >
                        {initiatingBookingId === room.id ? 'Loading...' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {rooms.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <Award size={36} color="var(--text-light)" style={{ marginBottom: '12px' }} />
                <p style={{ fontWeight: 600 }}>No rooms are currently available for the selected dates.</p>
                <p className="text-sub">Try adjustments in your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
function mainImageStyle() {
  return {
    height: '320px',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    backgroundColor: '#cbd5e1',
    boxShadow: 'var(--shadow-md)'
  };
}

function infoGridStyle() {
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    marginTop: '12px'
  };
}

function infoCardStyle() {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)'
  };
}

function amenityChipStyle() {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.85rem',
    fontWeight: 600
  };
}

function roomsGridStyle() {
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  };
}

function roomCardStyle() {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  };
}

function roomImageStyle() {
  return {
    height: '180px',
    width: '100%',
    position: 'relative',
    backgroundColor: '#cbd5e1',
    overflow: 'hidden'
  };
}

function surgeLabelStyle() {
  return {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'var(--warning)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: 'var(--shadow-sm)'
  };
}

function roomAmenityStyle() {
  return {
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    padding: '2px 6px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  };
}

function errorCardStyle() {
  return {
    padding: '24px',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: 'var(--error)'
  };
}
