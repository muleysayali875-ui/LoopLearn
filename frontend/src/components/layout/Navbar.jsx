import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, PlusCircle, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../ui/Button.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="page-container">
        <div className="navbar-inner">
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="brand-link" onClick={closeMobile}>
            <div className="brand-symbol" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 19C6 14.5 9 12 12 12C15 12 18 14.5 18 19"
                  stroke="#FFFEFA"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path d="M12 12V19" stroke="#FFFEFA" strokeWidth="2.2" strokeLinecap="round" />
                <path
                  d="M12 5C10.5 5 8 6.5 8 8C10.5 8 12 6.5 12 5Z"
                  fill="#F3C9A5"
                />
                <path
                  d="M12 5C13.5 5 16 6.5 16 8C13.5 8 12 6.5 12 5Z"
                  fill="#DCE8D9"
                />
              </svg>
            </div>
            <span>LoopLearn</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end
                >
                  Discover
                </NavLink>
              </li>
              <li>
                <a href="/#how-it-works" className="nav-link">
                  How It Works
                </a>
              </li>
              {isAuthenticated && (
                <li>
                  <NavLink
                    to="/my-listings"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    My Listings
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          {/* Header Action Controls */}
          <div className="nav-actions">
            <Link to="/share">
              <Button size="sm" variant="primary">
                <PlusCircle size={16} />
                <span>Share a Resource</span>
              </Button>
            </Link>

            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="nav-user-greeting">
                  <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {user?.name?.split(' ')[0]}
                </span>
                <Button size="sm" variant="secondary" onClick={handleLogout}>
                  <LogOut size={15} />
                  <span>Log out</span>
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login">
                  <Button size="sm" variant="secondary">
                    <LogIn size={15} />
                    <span>Log in</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="accent">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMobile}>
          Discover Resources
        </Link>
        <a href="/#how-it-works" className="nav-link" onClick={closeMobile}>
          How It Works
        </a>
        {isAuthenticated ? (
          <>
            <Link to="/my-listings" className="nav-link" onClick={closeMobile}>
              My Listings
            </Link>
            <Link to="/share" className="nav-link" onClick={closeMobile}>
              Share a Resource
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                closeMobile();
                handleLogout();
              }}
            >
              <LogOut size={15} />
              Log out ({user?.name})
            </Button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/share" onClick={closeMobile}>
              <Button variant="primary" style={{ width: '100%' }}>
                <PlusCircle size={16} />
                Share a Resource
              </Button>
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" onClick={closeMobile} style={{ flex: 1 }}>
                <Button variant="secondary" style={{ width: '100%' }}>
                  Log in
                </Button>
              </Link>
              <Link to="/register" onClick={closeMobile} style={{ flex: 1 }}>
                <Button variant="accent" style={{ width: '100%' }}>
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
