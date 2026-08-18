import { useState, useEffect } from 'react';
import { Shield, Plus, Home, BarChart2, Calendar, FileText, CheckCircle, ArrowRight, Trash2, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import { api } from '../api';

export default function ManagerDashboard() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [activeTab, setActiveTab] = useState('reports'); // 'reports', 'rooms', 'bookings', 'inventory'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Forms states
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelCity, setNewHotelCity] = useState('');
  const [newHotelAddress, setNewHotelAddress] = useState('');
  const [newHotelPhone, setNewHotelPhone] = useState('');
  const [newHotelEmail, setNewHotelEmail] = useState('');
  const [newHotelLocation, setNewHotelLocation] = useState('');
  const [newHotelPhotos, setNewHotelPhotos] = useState('');
  const [newHotelAmenities, setNewHotelAmenities] = useState('');
  const [savingHotel, setSavingHotel] = useState(false);

  // Rooms forms state
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [newRoomType, setNewRoomType] = useState('');
  const [newRoomBasePrice, setNewRoomBasePrice] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState('');
  const [newRoomTotalCount, setNewRoomTotalCount] = useState('5');
  const [newRoomAmenities, setNewRoomAmenities] = useState('');
  const [newRoomPhotos, setNewRoomPhotos] = useState('');
  const [savingRoom, setSavingRoom] = useState(false);

  // Report state
  const [report, setReport] = useState(null);
  const [reportStart, setReportStart] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [reportEnd, setReportEnd] = useState(() => new Date().toISOString().split('T')[0]);
  const [loadingReport, setLoadingReport] = useState(false);

  // Bookings list state
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Inventory/Surge override state
  const [overrideRoomId, setOverrideRoomId] = useState('');
  const [overrideStart, setOverrideStart] = useState(() => new Date().toISOString().split('T')[0]);
  const [overrideEnd, setOverrideEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [overrideSurge, setOverrideSurge] = useState('1.0');
  const [overrideClosed, setOverrideClosed] = useState(false);
  const [savingOverride, setSavingOverride] = useState(false);

  const fetchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.manager.getAllHotels();
      setHotels(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch your hotels. Ensure you are logged in as HOTEL_MANAGER.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    setSavingHotel(true);
    try {
      const hotelDTO = {
        name: newHotelName,
        city: newHotelCity,
        contactInfo: {
          address: newHotelAddress,
          phoneNumber: newHotelPhone,
          email: newHotelEmail,
          location: newHotelLocation || 'Coordinates'
        },
        photos: newHotelPhotos ? newHotelPhotos.split(',').map(s => s.trim()) : [],
        amenities: newHotelAmenities ? newHotelAmenities.split(',').map(s => s.trim()) : [],
        active: true
      };

      const created = await api.manager.createHotel(hotelDTO);
      setHotels([...hotels, created]);
      setShowAddHotel(false);
      resetHotelForm();
      alert('Hotel added successfully!');
    } catch (err) {
      alert(err.message || 'Failed to create hotel');
    } finally {
      setSavingHotel(false);
    }
  };

  const resetHotelForm = () => {
    setNewHotelName('');
    setNewHotelCity('');
    setNewHotelAddress('');
    setNewHotelPhone('');
    setNewHotelEmail('');
    setNewHotelLocation('');
    setNewHotelPhotos('');
    setNewHotelAmenities('');
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel? This action is permanent.')) return;
    try {
      await api.manager.deleteHotel(hotelId);
      setHotels(hotels.filter(h => h.id !== hotelId));
      if (selectedHotel?.id === hotelId) setSelectedHotel(null);
      alert('Hotel deleted.');
    } catch (err) {
      alert(err.message || 'Failed to delete hotel');
    }
  };

  // Rooms operations
  const fetchRooms = async (hotelId) => {
    setLoadingRooms(true);
    try {
      const data = await api.manager.getRooms(hotelId);
      setRooms(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setSavingRoom(true);
    try {
      const roomDTO = {
        type: newRoomType,
        basePrice: parseFloat(newRoomBasePrice),
        capacity: parseInt(newRoomCapacity),
        totalCount: parseInt(newRoomTotalCount),
        amenities: newRoomAmenities ? newRoomAmenities.split(',').map(s => s.trim()) : [],
        photos: newRoomPhotos ? newRoomPhotos.split(',').map(s => s.trim()) : []
      };

      await api.manager.createRoom(selectedHotel.id, roomDTO);
      fetchRooms(selectedHotel.id);
      setNewRoomType('');
      setNewRoomBasePrice('');
      setNewRoomCapacity('');
      setNewRoomAmenities('');
      setNewRoomPhotos('');
      alert('Room type added!');
    } catch (err) {
      alert(err.message || 'Failed to add room type');
    } finally {
      setSavingRoom(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Delete this room type?')) return;
    try {
      await api.manager.deleteRoom(selectedHotel.id, roomId);
      fetchRooms(selectedHotel.id);
    } catch (err) {
      alert(err.message || 'Failed to delete room');
    }
  };

  // Reports operation
  const fetchReport = async (hotelId) => {
    setLoadingReport(true);
    try {
      const data = await api.manager.getReport(hotelId, reportStart, reportEnd);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReport(false);
    }
  };

  // Bookings operation
  const fetchBookings = async (hotelId) => {
    setLoadingBookings(true);
    try {
      const data = await api.manager.getBookings(hotelId);
      setHotelBookings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Inventory Override operation
  const handleInventoryOverride = async (e) => {
    e.preventDefault();
    if (!overrideRoomId) {
      alert('Please select a room type');
      return;
    }
    setSavingOverride(true);
    try {
      const overrideDTO = {
        startDate: overrideStart,
        endDate: overrideEnd,
        surgeFactor: parseFloat(overrideSurge),
        closed: overrideClosed
      };

      await api.manager.updateRoomInventory(selectedHotel.id, overrideRoomId, overrideDTO);
      alert('Inventory and pricing updated successfully!');
      if (activeTab === 'rooms') {
        fetchRooms(selectedHotel.id);
      }
    } catch (err) {
      alert(err.message || 'Failed to apply inventory updates');
    } finally {
      setSavingOverride(false);
    }
  };

  useEffect(() => {
    if (selectedHotel) {
      fetchRooms(selectedHotel.id);
      fetchReport(selectedHotel.id);
      fetchBookings(selectedHotel.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotel]);

  useEffect(() => {
    if (selectedHotel) {
      fetchReport(selectedHotel.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportStart, reportEnd]);

  if (!selectedHotel) {
    return (
      <div className="container section" style={{ textAlign: 'left', paddingTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield color="var(--primary)" /> Manager Dashboard
            </h2>
            <p className="text-sub">Manage your properties, rooms, dynamic pricing overrides, and revenues.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddHotel(!showAddHotel)}>
            <Plus size={16} /> {showAddHotel ? 'Cancel' : 'Add New Property'}
          </button>
        </div>

        {/* Create Hotel Form Overlay */}
        {showAddHotel && (
          <form onSubmit={handleCreateHotel} className="card" style={{ padding: '24px', marginBottom: '32px', borderLeft: '5px solid var(--primary)' }}>
            <h3 className="title-sm" style={{ marginBottom: '16px' }}>Property Creation Form</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hotel Name</label>
                <input type="text" className="form-control" placeholder="Grand Stay Plaza" value={newHotelName} onChange={e => setNewHotelName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" className="form-control" placeholder="Noida" value={newHotelCity} onChange={e => setNewHotelCity(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Complete Address</label>
              <input type="text" className="form-control" placeholder="Plot 21, Sector 62, Noida, UP" value={newHotelAddress} onChange={e => setNewHotelAddress(e.target.value)} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input type="tel" className="form-control" placeholder="+91 9999988888" value={newHotelPhone} onChange={e => setNewHotelPhone(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input type="email" className="form-control" placeholder="bookings@grandstay.com" value={newHotelEmail} onChange={e => setNewHotelEmail(e.target.value)} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amenities (Comma separated)</label>
                <input type="text" className="form-control" placeholder="Wifi, Pool, Free Breakfast, AC" value={newHotelAmenities} onChange={e => setNewHotelAmenities(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Photos URLs (Comma separated)</label>
                <input type="text" className="form-control" placeholder="https://image1.jpg, https://image2.jpg" value={newHotelPhotos} onChange={e => setNewHotelPhotos(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }} disabled={savingHotel}>
              {savingHotel ? 'Saving property details...' : 'Add Property'}
            </button>
          </form>
        )}

        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
            <p className="text-sub">Retrieving registered properties...</p>
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: '32px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <p style={{ color: 'var(--error)' }}>{error}</p>
          </div>
        )}

        {!loading && !error && hotels.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <Home size={40} color="var(--text-light)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>No properties added yet</h3>
            <p className="text-sub" style={{ marginBottom: '20px' }}>Add your first property above to begin accepting bookings.</p>
          </div>
        )}

        {!loading && !error && hotels.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {hotels.map(h => (
              <div key={h.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ height: '180px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                  <img
                    src={h.photos && h.photos.length > 0 ? h.photos[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
                    alt={h.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>{h.name}</h3>
                  <p className="text-sub" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>{h.city} • {h.contactInfo?.address}</p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDeleteHotel(h.id)} title="Delete Property">
                      <Trash2 size={16} />
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setSelectedHotel(h)}>
                      Manage Stays <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Selected Hotel Detailed Dashboard View
  return (
    <div className="container section" style={{ textAlign: 'left', paddingTop: '24px' }}>
      {/* Back button */}
      <button onClick={() => setSelectedHotel(null)} className="btn btn-secondary btn-sm" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={16} /> Back to Properties
      </button>

      {/* Header Info */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="title-lg">{selectedHotel.name}</h2>
        <p className="text-sub">{selectedHotel.city} • {selectedHotel.contactInfo?.address}</p>
      </div>

      {/* Navigation tabs */}
      <div style={tabContainerStyle()}>
        <button onClick={() => setActiveTab('reports')} style={tabButtonStyle(activeTab === 'reports')}>
          <BarChart2 size={16} /> Analytics & Reports
        </button>
        <button onClick={() => setActiveTab('rooms')} style={tabButtonStyle(activeTab === 'rooms')}>
          <Layers size={16} /> Room Types
        </button>
        <button onClick={() => setActiveTab('bookings')} style={tabButtonStyle(activeTab === 'bookings')}>
          <FileText size={16} /> Guest Bookings
        </button>
        <button onClick={() => setActiveTab('inventory')} style={tabButtonStyle(activeTab === 'inventory')}>
          <Calendar size={16} /> Pricing Overrides
        </button>
      </div>

      {/* Analytics/Reports Panel */}
      {activeTab === 'reports' && (
        <div>
          {/* Date range selection */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Report Start Date</label>
              <input type="date" className="form-control" style={{ padding: '8px 12px' }} value={reportStart} onChange={e => setReportStart(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Report End Date</label>
              <input type="date" className="form-control" style={{ padding: '8px 12px' }} value={reportEnd} onChange={e => setReportEnd(e.target.value)} />
            </div>
            <button className="btn btn-secondary btn-sm" style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => fetchReport(selectedHotel.id)}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {loadingReport ? (
            <div className="spinner"></div>
          ) : report ? (
            <div style={statsGridStyle()}>
              <div style={statCardStyle()}>
                <span style={statLabelStyle()}>Total Bookings</span>
                <span style={statValueStyle()}>{report.bookingCount || 0}</span>
              </div>
              <div style={statCardStyle()}>
                <span style={statLabelStyle()}>Total Revenue</span>
                <span style={{ ...statValueStyle(), color: 'var(--success)' }}>₹{report.totalRevenue || 0}</span>
              </div>
              <div style={statCardStyle()}>
                <span style={statLabelStyle()}>Average Booking Value</span>
                <span style={{ ...statValueStyle(), color: 'var(--primary)' }}>₹{report.avgRevenue || 0}</span>
              </div>
            </div>
          ) : (
            <p className="text-sub">No report metrics generated.</p>
          )}
        </div>
      )}

      {/* Rooms Panel */}
      {activeTab === 'rooms' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', flexWrap: 'wrap' }}>
          
          {/* Add Room Form */}
          <form onSubmit={handleCreateRoom} className="card" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 className="title-sm" style={{ marginBottom: '16px' }}>Add Room Type</h3>
            <div className="form-group">
              <label className="form-label">Room Type Name</label>
              <input type="text" className="form-control" placeholder="Deluxe Premium Suite" value={newRoomType} onChange={e => setNewRoomType(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Base Rate per night</label>
                <input type="number" className="form-control" placeholder="2500" value={newRoomBasePrice} onChange={e => setNewRoomBasePrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Capacity (Guests)</label>
                <input type="number" className="form-control" placeholder="3" value={newRoomCapacity} onChange={e => setNewRoomCapacity(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Total Rooms Available</label>
              <input type="number" className="form-control" placeholder="5" value={newRoomTotalCount} onChange={e => setNewRoomTotalCount(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Amenities (Comma separated)</label>
              <input type="text" className="form-control" placeholder="TV, Balcony, Minibar, Queen Bed" value={newRoomAmenities} onChange={e => setNewRoomAmenities(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Photo URL</label>
              <input type="text" className="form-control" placeholder="https://image.png" value={newRoomPhotos} onChange={e => setNewRoomPhotos(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={savingRoom}>
              {savingRoom ? 'Saving...' : 'Add Room Type'}
            </button>
          </form>

          {/* Room List */}
          <div>
            <h3 className="title-sm" style={{ marginBottom: '16px' }}>Current Room Inventory</h3>
            {loadingRooms ? (
              <div className="spinner"></div>
            ) : rooms.length === 0 ? (
              <p className="text-sub">No room types registered. Please create one.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rooms.map(room => (
                  <div key={room.id} style={roomListItemStyle()}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: '#e2e8f0', flexShrink: 0 }}>
                        <img src={room.photos && room.photos.length > 0 ? room.photos[0] : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=200&q=80'} alt={room.type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', display: 'block' }}>{room.type}</span>
                        <span className="text-sub" style={{ fontSize: '0.85rem' }}>
                          Rate: <strong>₹{room.basePrice}</strong> • Capacity: <strong>{room.capacity}</strong> • Count: <strong>{room.totalCount}</strong>
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDeleteRoom(room.id)} title="Delete room type">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Bookings Panel */}
      {activeTab === 'bookings' && (
        <div>
          <h3 className="title-sm" style={{ marginBottom: '16px' }}>Received Bookings Log</h3>

          {loadingBookings ? (
            <div className="spinner"></div>
          ) : hotelBookings.length === 0 ? (
            <p className="text-sub">No bookings received yet for this property.</p>
          ) : (
            <div style={tableWrapperStyle()}>
              <table style={tableStyle()}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={thStyle()}>Booking ID</th>
                    <th style={thStyle()}>Dates</th>
                    <th style={thStyle()}>Rooms</th>
                    <th style={thStyle()}>Amount</th>
                    <th style={thStyle()}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hotelBookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={tdStyle()}>#{b.id}</td>
                      <td style={tdStyle()}>{b.checkInDate} to {b.checkOutDate}</td>
                      <td style={tdStyle()}>{b.roomsCount}</td>
                      <td style={tdStyle()}>₹{b.amount}</td>
                      <td style={tdStyle()}>
                        <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-success' : b.bookingStatus === 'CANCELLED' ? 'badge-danger' : 'badge-warning'}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Overrides Panel */}
      {activeTab === 'inventory' && (
        <div style={{ maxWidth: '600px' }}>
          <form onSubmit={handleInventoryOverride} className="card" style={{ padding: '28px' }}>
            <h3 className="title-sm" style={{ marginBottom: '8px' }}>Create Pricing & Availability Overrides</h3>
            <p className="text-sub" style={{ marginBottom: '24px' }}>
              Enforce a holiday surge pricing multiplier or temporarily close room types for specific dates.
            </p>

            <div className="form-group">
              <label className="form-label">Select Room Type</label>
              <select className="form-control" value={overrideRoomId} onChange={e => setOverrideRoomId(e.target.value)} required>
                <option value="">-- Choose room type --</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.type} (Base: ₹{r.basePrice})</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-control" value={overrideStart} onChange={e => setOverrideStart(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" className="form-control" value={overrideEnd} onChange={e => setOverrideEnd(e.target.value)} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Surge Multiplier (e.g. 1.25 for +25%)</label>
                <input type="number" step="0.05" min="0.5" max="3.0" className="form-control" value={overrideSurge} onChange={e => setOverrideSurge(e.target.value)} required />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '28px', gap: '8px' }}>
                <input type="checkbox" id="closed" checked={overrideClosed} onChange={e => setOverrideClosed(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                <label htmlFor="closed" style={{ fontWeight: 600, cursor: 'pointer' }}>Close availability</label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={savingOverride}>
              {savingOverride ? 'Applying overrides...' : 'Apply Overrides'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

// Styles
const tabContainerStyle = () => ({
  display: 'flex',
  gap: '12px',
  borderBottom: '1px solid var(--border-color)',
  marginBottom: '32px',
  overflowX: 'auto',
  paddingBottom: '2px'
});

const tabButtonStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 18px',
  background: 'none',
  border: 'none',
  borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
  fontWeight: isActive ? 700 : 500,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'var(--transition)'
});

const statsGridStyle = () => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px'
});

const statCardStyle = () => ({
  padding: '24px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)'
});

const statLabelStyle = () => ({
  display: 'block',
  fontSize: '0.875rem',
  color: 'var(--text-light)',
  textTransform: 'uppercase',
  fontWeight: 700,
  marginBottom: '6px'
});

const statValueStyle = () => ({
  fontSize: '2.25rem',
  fontWeight: 800
});

const roomListItemStyle = () => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)'
});

const tableWrapperStyle = () => ({
  width: '100%',
  overflowX: 'auto',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)'
});

const tableStyle = () => ({
  width: '100%',
  borderCollapse: 'collapse'
});

const thStyle = () => ({
  padding: '14px 20px',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  color: 'var(--text-light)',
  fontWeight: 700
});

const tdStyle = () => ({
  padding: '14px 20px',
  fontSize: '0.95rem'
});
