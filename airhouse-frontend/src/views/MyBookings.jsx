import { useState, useEffect } from 'react';
import { Download, Ban, Calendar, User, FileText, CheckCircle, Clock } from 'lucide-react';
import { api } from '../api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch bookings. Make sure the backend is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Refund will be initiated if applicable.')) {
      return;
    }

    setCancelingId(bookingId);
    try {
      await api.cancelBooking(bookingId);
      alert('Booking canceled successfully!');
      // Refresh list
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="badge badge-success">Confirmed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Canceled</span>;
      case 'EXPIRED':
        return <span className="badge badge-danger">Expired</span>;
      case 'RESERVED':
      case 'GUESTS_ADDED':
      case 'PAYMENTS_PENDING':
        return <span className="badge badge-warning">Pending Payment</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div className="container section" style={{ textAlign: 'left', paddingTop: '24px' }}>
      <h2 className="title-md" style={{ marginBottom: '24px' }}>My Bookings</h2>

      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="text-sub">Loading your stays...</p>
        </div>
      )}

      {error && !loading && (
        <div style={errorCardStyle()}>
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }} onClick={fetchBookings}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div style={emptyCardStyle()}>
          <Calendar size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>No stays booked yet</h3>
          <p className="text-sub" style={{ marginBottom: '20px' }}>
            Explore our hotels and make your first booking with Airhouse!
          </p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {bookings.map((b) => (
            <div key={b.id} className="card" style={bookingCardStyle()}>
              {/* Top Row: Details & Status */}
              <div style={bookingHeaderStyle()}>
                <div>
                  <span className="text-sub" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', display: 'block' }}>
                    BOOKING #{b.id}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Booked on: {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  {getStatusBadge(b.bookingStatus)}
                </div>
              </div>

              {/* Middle Row: Check-in/Out details */}
              <div style={bookingInfoGridStyle()}>
                <div>
                  <span style={fieldLabelStyle()}>Check-In Date</span>
                  <span style={fieldValueStyle()}>{b.checkInDate}</span>
                </div>
                <div>
                  <span style={fieldLabelStyle()}>Check-Out Date</span>
                  <span style={fieldValueStyle()}>{b.checkOutDate}</span>
                </div>
                <div>
                  <span style={fieldLabelStyle()}>Rooms Count</span>
                  <span style={fieldValueStyle()}>{b.roomsCount} Room{b.roomsCount > 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span style={fieldLabelStyle()}>Total Amount Paid</span>
                  <span style={{ ...fieldValueStyle(), color: 'var(--primary)', fontWeight: 700 }}>₹{b.amount}</span>
                </div>
              </div>

              {/* Guest Details */}
              {b.guests && b.guests.size > 0 || b.guests && b.guests.length > 0 ? (
                <div style={{ margin: '16px 20px', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
                  <span style={fieldLabelStyle()}>Guests ({b.guests.length || b.guests.size})</span>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {Array.from(b.guests).map((g, idx) => (
                      <span key={idx} style={guestChipStyle()}>
                        <User size={12} /> {g.name} ({g.gender.toLowerCase()}, {g.age}y)
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Bottom Row: Actions */}
              <div style={bookingActionsStyle()}>
                {b.bookingStatus === 'CONFIRMED' && (
                  <a
                    href={api.downloadInvoiceUrl(b.id)}
                    download
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={14} /> Download Invoice
                  </a>
                )}

                {b.bookingStatus !== 'CANCELLED' && b.bookingStatus !== 'EXPIRED' && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={cancelingId === b.id}
                    className="btn btn-danger btn-sm"
                    style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Ban size={14} /> {cancelingId === b.id ? 'Canceling...' : 'Cancel Stay'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Styles
function bookingCardStyle() {
  return {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  };
}

const bookingHeaderStyle = () => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px',
  backgroundColor: 'var(--bg-main)',
  borderBottom: '1px solid var(--border-color)'
});

const bookingInfoGridStyle = () => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '16px',
  padding: '20px'
});

const fieldLabelStyle = () => ({
  display: 'block',
  fontSize: '0.75rem',
  color: 'var(--text-light)',
  textTransform: 'uppercase',
  fontWeight: 700,
  letterSpacing: '0.05em',
  marginBottom: '4px'
});

const fieldValueStyle = () => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--text-main)'
});

const guestChipStyle = () => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  backgroundColor: 'var(--bg-main)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-full)',
  fontSize: '0.8rem',
  color: 'var(--text-muted)'
});

const bookingActionsStyle = () => ({
  display: 'flex',
  padding: '16px 20px',
  borderTop: '1px solid var(--border-color)',
  alignItems: 'center',
  gap: '12px'
});

const errorCardStyle = () => ({
  padding: '40px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  textAlign: 'center',
  maxWidth: '400px',
  margin: '40px auto'
});

const emptyCardStyle = () => ({
  padding: '60px 20px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  textAlign: 'center',
  maxWidth: '500px',
  margin: '40px auto'
});
