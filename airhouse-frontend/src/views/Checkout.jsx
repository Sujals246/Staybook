import { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, ArrowLeft, CreditCard, Sparkles, Plus, Trash2 } from 'lucide-react';
import { api } from '../api';
import confetti from 'canvas-confetti';

export default function Checkout({ booking, room, searchParams, onBack, onBookingSuccess }) {
  const [guests, setGuests] = useState([{ name: '', gender: 'MALE', age: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Number of guests required matches search roomCount * capacity or we can just let user enter as many guests as they wish
  const maxCapacity = (room.capacity || 2) * parseInt(searchParams.roomsCount || 1);

  const handleAddGuest = () => {
    if (guests.length >= maxCapacity) {
      alert(`Max capacity for this booking is ${maxCapacity} guests.`);
      return;
    }
    setGuests([...guests, { name: '', gender: 'MALE', age: '' }]);
  };

  const handleRemoveGuest = (index) => {
    if (guests.length === 1) return;
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleGuestChange = (index, field, value) => {
    const newGuests = [...guests];
    newGuests[index][field] = value;
    setGuests(newGuests);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('Submitting guests details...');

    // Validate ages
    for (const g of guests) {
      if (!g.name.trim()) {
        setError('All guests must have names');
        setLoading(false);
        return;
      }
      if (!g.age || isNaN(g.age) || parseInt(g.age) <= 0) {
        setError('Please enter a valid age for all guests');
        setLoading(false);
        return;
      }
    }

    try {
      // 1. Submit guests to backend
      const formattedGuests = guests.map(g => ({
        name: g.name,
        gender: g.gender,
        age: parseInt(g.age)
      }));

      await api.addGuestsToBooking(booking.id, formattedGuests);

      // 2. Initiate Payment Order
      setStatus('Creating payment order...');
      const order = await api.initiatePayment(booking.id);

      setStatus('Opening Razorpay gateway...');
      
      // Load Razorpay
      if (typeof window.Razorpay === 'undefined' || (order.orderId && order.orderId.includes('mock')) || (order.key && order.key.includes('mock'))) {
        // Fallback checkout (in case script wasn't loaded, or mock keys returned)
        console.warn('Using simulated sandbox checkout flow...');
        await simulateCheckout(order);
        return;
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency || 'INR',
        order_id: order.orderId,
        name: 'Airhouse',
        description: `Booking for ${room.type}`,
        handler: async function (response) {
          try {
            setStatus('Verifying payment details...');
            const verifiedBooking = await api.verifyPayment(booking.id, {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });

            triggerSuccessConfetti();
            setSuccessBooking(verifiedBooking);
          } catch (err) {
            setError(err.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: function () {
            setStatus('');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (err) {
        setError('Payment Failed: ' + (err.error?.description || 'Failed'));
        await api.recordFailedPayment(booking.id, {
          errorMessage: err.error?.description || 'User closed/failed payment'
        });
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      setError(err.message || 'Booking process failed. Please try again.');
      setLoading(false);
    }
  };

  const simulateCheckout = async (order) => {
    setStatus('Simulating payment order (Sandbox)...');
    setTimeout(async () => {
      try {
        // Call backend verification with simulated response details
        // Since we are mocking, we can send random IDs that match the structure
        const verifiedBooking = await api.verifyPayment(booking.id, {
          razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substr(2, 9),
          razorpayOrderId: order.orderId,
          razorpaySignature: 'sig_mock_' + Math.random().toString(36).substr(2, 9)
        });

        triggerSuccessConfetti();
        setSuccessBooking(verifiedBooking);
      } catch (err) {
        setError(err.message || 'Simulated payment verification failed');
        setLoading(false);
      }
    }, 2000);
  };

  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  if (successBooking) {
    return (
      <div className="container section" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '40px', borderTop: '6px solid var(--success)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Sparkles size={32} />
          </div>
          
          <h2 className="title-md" style={{ color: 'var(--success)', marginBottom: '8px' }}>Booking Confirmed!</h2>
          <p className="text-sub" style={{ marginBottom: '24px' }}>
            Your stay at <strong>{room.type}</strong> has been successfully booked.
          </p>

          <div style={receiptDetailsStyle()}>
            <div style={receiptRowStyle()}>
              <span>Booking ID:</span>
              <span style={{ fontWeight: 700 }}>#{successBooking.id}</span>
            </div>
            <div style={receiptRowStyle()}>
              <span>Check-in:</span>
              <span style={{ fontWeight: 600 }}>{successBooking.checkInDate}</span>
            </div>
            <div style={receiptRowStyle()}>
              <span>Check-out:</span>
              <span style={{ fontWeight: 600 }}>{successBooking.checkOutDate}</span>
            </div>
            <div style={receiptRowStyle()}>
              <span>Amount Paid:</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{successBooking.amount}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <a
              href={api.downloadInvoiceUrl(successBooking.id)}
              download
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Download Invoice
            </a>
            <button
              onClick={onBookingSuccess}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section" style={{ textAlign: 'left', paddingTop: '24px' }}>
      <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={16} /> Back to Rooms
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Guest Input Form */}
        <form onSubmit={handlePayment} className="card" style={{ padding: '28px', height: 'fit-content' }}>
          <h3 className="title-sm" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--primary)" /> Guest Information
          </h3>
          <p className="text-sub" style={{ marginBottom: '24px' }}>
            Please fill in details for the guests staying. Capacity allowed: up to {maxCapacity} guests.
          </p>

          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {guests.map((guest, index) => (
            <div key={index} style={guestFormRowStyle()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)' }}>GUEST #{index + 1}</span>
                {guests.length > 1 && (
                  <button type="button" onClick={() => handleRemoveGuest(index)} style={removeGuestBtnStyle()}>
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                  value={guest.name}
                  onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                  required
                />
                <select
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '0.9rem', cursor: 'pointer' }}
                  value={guest.gender}
                  onChange={(e) => handleGuestChange(index, 'gender', e.target.value)}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <input
                  type="number"
                  placeholder="Age"
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                  value={guest.age}
                  onChange={(e) => handleGuestChange(index, 'age', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}

          {guests.length < maxCapacity && (
            <button type="button" onClick={handleAddGuest} className="btn btn-secondary btn-sm" style={{ width: '100%', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={16} /> Add Another Guest
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={loading}
          >
            <CreditCard size={18} />
            {loading ? status : 'Proceed to Payment'}
          </button>
        </form>

        {/* Booking Summary */}
        <div className="card" style={{ padding: '28px', height: 'fit-content', backgroundColor: 'var(--bg-main)' }}>
          <h3 className="title-sm" style={{ marginBottom: '20px' }}>Booking Summary</h3>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
            <div style={{ width: '100px', height: '70px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
              <img
                src={room.photos && room.photos.length > 0 ? room.photos[0] : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=150&q=80'}
                alt={room.type}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{room.type}</h4>
              <span className="text-sub" style={{ fontSize: '0.9rem' }}>Airhouse luxury selection</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={summaryRowStyle()}>
              <Calendar size={14} color="var(--text-light)" />
              <span>Dates:</span>
              <strong style={{ marginLeft: 'auto' }}>{searchParams.startDate} to {searchParams.endDate}</strong>
            </div>
            <div style={summaryRowStyle()}>
              <Calendar size={14} color="var(--text-light)" />
              <span>Rooms Count:</span>
              <strong style={{ marginLeft: 'auto' }}>{searchParams.roomsCount}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span>Base Rate per night</span>
              <span>₹{room.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span>Subtotal</span>
              <span>₹{booking.amount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span>Taxes & Fees</span>
              <span>₹0.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '8px' }}>
              <span>Total Price</span>
              <span style={{ color: 'var(--primary)' }}>₹{booking.amount}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Styles
function guestFormRowStyle() {
  return {
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px dashed var(--border-color)'
  };
}

function removeGuestBtnStyle() {
  return {
    border: 'none',
    background: 'none',
    color: 'var(--error)',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '2px'
  };
}

function summaryRowStyle() {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem'
  };
}

function receiptDetailsStyle() {
  return {
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
    textAlign: 'left'
  };
}

function receiptRowStyle() {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '0.95rem'
  };
}
