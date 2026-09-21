import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Sparkles, Smile, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [dob, setDob] = useState(user?.dateOfBirth || '');
  const [gender, setGender] = useState(user?.gender || 'MALE');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Guests state
  const [savedGuests, setSavedGuests] = useState([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestGender, setNewGuestGender] = useState('MALE');
  const [newGuestAge, setNewGuestAge] = useState('');
  const [addingGuest, setAddingGuest] = useState(false);

  // Sync profile details
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setDob(user.dateOfBirth || '');
      setGender(user.gender || 'MALE');
    }
  }, [user]);

  const fetchGuests = async () => {
    setLoadingGuests(true);
    try {
      const data = await api.getMyGuests();
      setSavedGuests(data || []);
    } catch (err) {
      console.error('Failed to fetch guests', err);
    } finally {
      setLoadingGuests(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage('');
    try {
      await api.updateProfile({
        name,
        dateOfBirth: dob || undefined,
        gender
      });
      await refreshProfile();
      setProfileMessage('Profile updated successfully! ✅');
    } catch (err) {
      setProfileMessage(`Error: ${err.message || 'Failed to update profile'}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newGuestAge) return;
    setAddingGuest(true);
    try {
      await api.addNewGuest({
        name: newGuestName,
        gender: newGuestGender,
        age: parseInt(newGuestAge)
      });
      setNewGuestName('');
      setNewGuestAge('');
      fetchGuests();
    } catch (err) {
      alert(err.message || 'Failed to add guest');
    } finally {
      setAddingGuest(false);
    }
  };

  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm('Delete this saved guest?')) return;
    try {
      await api.deleteGuest(guestId);
      fetchGuests();
    } catch (err) {
      alert(err.message || 'Failed to delete guest');
    }
  };

  return (
    <div className="container section" style={{ textAlign: 'left', paddingTop: '24px' }}>
      <h2 className="title-md" style={{ marginBottom: '24px' }}>Profile Settings</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Profile Card */}
        <div className="card" style={{ padding: '28px', height: 'fit-content' }}>
          <h3 className="title-sm" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--primary)" /> Personal Information
          </h3>

          {profileMessage && (
            <div style={{
              backgroundColor: profileMessage.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary-light)',
              color: profileMessage.includes('Error') ? 'var(--error)' : 'var(--primary)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              {profileMessage}
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Email Address (Non-editable)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '40px', backgroundColor: 'var(--bg-main)', cursor: 'not-allowed' }}
                  value={user?.email || ''}
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="date"
                    className="form-control"
                    style={{ paddingLeft: '40px' }}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }} disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Saved Guests Panel */}
        <div className="card" style={{ padding: '28px', height: 'fit-content' }}>
          <h3 className="title-sm" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smile size={18} color="var(--primary)" /> Saved Companions
          </h3>
          <p className="text-sub" style={{ marginBottom: '20px' }}>
            Manage names of family & friends to quickly add them during checkouts.
          </p>

          {/* Add Guest Form */}
          <form onSubmit={handleAddGuest} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '8px', marginBottom: '24px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Guest Name"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              required
            />
            <select
              className="form-control"
              style={{ padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
              value={newGuestGender}
              onChange={(e) => setNewGuestGender(e.target.value)}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <input
              type="number"
              className="form-control"
              placeholder="Age"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              value={newGuestAge}
              onChange={(e) => setNewGuestAge(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-icon" style={{ width: '36px', height: '36px' }} disabled={addingGuest}>
              <Plus size={16} />
            </button>
          </form>

          {/* List of Saved Guests */}
          {loadingGuests ? (
            <div style={{ textAlign: 'center', padding: '20px' }}><div className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px' }}></div></div>
          ) : savedGuests.length === 0 ? (
            <p className="text-sub" style={{ textAlign: 'center', padding: '20px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              No companions saved yet. Add your first companion above!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {savedGuests.map((guest) => (
                <div key={guest.id} style={guestListItemStyle()}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block' }}>{guest.name}</span>
                    <span className="text-caption" style={{ textTransform: 'capitalize' }}>
                      {guest.gender.toLowerCase()} • {guest.age} years old
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteGuest(guest.id)}
                    style={{ border: 'none', background: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
                    className="hover-danger"
                    title="Delete companion"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Styles
const guestListItemStyle = () => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  backgroundColor: 'var(--bg-main)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)'
});
