import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue(""); // Clear after search
    }
  };

  return (
    <header
      id="test-navbar"
      className={`test-navbar${scrolled ? " test-navbar--scrolled" : ""}`}
      style={{ fontFamily: "var(--font-manrope), Arial, sans-serif" }}
    >
      <div className="test-navbar__bar">

        {/* ── Left: nav links ── */}
        <nav className="test-navbar__left" aria-label="Main navigation">
          <Link to="/" className="test-navbar__link">HOME</Link>
          <Link to="/trending" className="test-navbar__link">TRENDING</Link>
          <Link to="/contact" className="test-navbar__link">CONTACT</Link>
          <Link to="/about" className="test-navbar__link">ABOUT US</Link>
        </nav>

        {/* ── Center: \___/ logo trapezoid ── */}
        <div className="test-navbar__center" aria-label="Logo">
          <Link to="/" className="test-navbar__logo">
            LOGO
          </Link>
        </div>

        {/* ── Right: search input | search btn | cart icon | sign in ── */}
        <div className="test-navbar__right">
          {/* Text field — standalone */}
          <div className="test-navbar__search-wrap">
            <input
              id="test-search-input"
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(e);
              }}
              className="test-navbar__search-input"
              aria-label="Search"
            />
          </div>

          {/* Search icon — separate button */}
          <button
            id="test-search-btn"
            className="test-navbar__search-icon"
            aria-label="Submit Search"
            onClick={handleSearch}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Cart Icon — styled custom as a round button */}
          <Link
            to="/cart"
            className="test-navbar__cart-icon"
            aria-label="Cart"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="test-navbar__cart-badge">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Authentication items */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="test-navbar__profile">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>{user.username}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="test-navbar__logout"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              id="test-signin-btn"
              className="test-navbar__signin"
            >
              SIGN IN
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
