import { useState } from 'react';
import { Home, Calendar, User, LogOut, Shield, Moon, Sun, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuth, onSetView, activeView, isDark, onToggleDark }) {
  const { user, logout, isManager } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNavClick = (view) => {
    onSetView(view);
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <div className="navbar-wrapper">
      <div className="container navbar-container">
        {/* Logo */}
        <a href="#" className="logo" onClick={() => handleNavClick('search')}>
          <Home size={28} strokeWidth={2.5} />
          <span>Airhouse</span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => handleNavClick('search')}
            className={`btn btn-secondary btn-sm ${activeView === 'search' ? 'active-nav' : ''}`}
            style={activeView === 'search' ? activeNavStyle() : { border: 'none' }}
          >
            Explore Stays
          </button>

          {user && (
            <>
              <button
                onClick={() => handleNavClick('bookings')}
                className={`btn btn-secondary btn-sm ${activeView === 'bookings' ? 'active-nav' : ''}`}
                style={activeView === 'bookings' ? activeNavStyle() : { border: 'none' }}
              >
                My Bookings
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className={`btn btn-secondary btn-sm ${activeView === 'profile' ? 'active-nav' : ''}`}
                style={activeView === 'profile' ? activeNavStyle() : { border: 'none' }}
              >
                Profile
              </button>

              {isManager && (
                <button
                  onClick={() => handleNavClick('manager')}
                  className="btn btn-primary btn-sm"
                  style={{
                    backgroundColor: 'var(--secondary)',
                    borderColor: 'var(--secondary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Shield size={14} />
                  Manager Panel
                </button>
              )}
            </>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDark}
            className="btn btn-secondary btn-icon"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            title="Toggle theme"
          >
            {isDark ? <Sun size={20} color="var(--warning)" /> : <Moon size={20} color="var(--text-muted)" />}
          </button>

          {/* User Account Controls */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  fontWeight: 600
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '48px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  width: '200px',
                  zIndex: 200,
                  padding: '6px 0',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    {user.email}
                  </div>
                  <button
                    onClick={() => handleNavClick('profile')}
                    style={dropdownBtnStyle()}
                  >
                    <User size={16} /> Profile Settings
                  </button>
                  <button
                    onClick={() => handleNavClick('bookings')}
                    style={dropdownBtnStyle()}
                  >
                    <Calendar size={16} /> My Bookings
                  </button>
                  {isManager && (
                    <button
                      onClick={() => handleNavClick('manager')}
                      style={{ ...dropdownBtnStyle(), color: 'var(--primary)' }}
                    >
                      <Shield size={16} /> Manager Panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      handleNavClick('search');
                    }}
                    style={{ ...dropdownBtnStyle(), borderTop: '1px solid var(--border-color)', color: 'var(--error)' }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAuth}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function activeNavStyle() {
  return {
    border: 'none',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)'
  };
}

function dropdownBtnStyle() {
  return {
    width: '100%',
    textAlign: 'left',
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9rem',
    transition: 'var(--transition)'
  };
}
