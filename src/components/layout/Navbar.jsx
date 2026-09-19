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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
      <header
        id="test-navbar"
        className={`test-navbar${scrolled ? " test-navbar--scrolled" : ""}`}
        style={{ fontFamily: "var(--font-manrope), Arial, sans-serif" }}
      >
        <div className="test-navbar__bar">

          {/* ── Mobile Left (Hamburger + Cart) ── */}
          <div className="hidden max-[640px]:flex flex-1 items-center gap-3 pl-3 z-10">
            <button
              className="flex items-center justify-center p-1 text-slate-700"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <Link
              to="/cart"
              className="test-navbar__cart-icon"
              aria-label="Cart"
            >
              <svg
                width="16"
                height="16"
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
          </div>

          {/* ── Left: nav links (Hidden on mobile) ── */}
          <nav className="test-navbar__left max-[640px]:hidden" aria-label="Main navigation">
            <Link to="/" className="test-navbar__link">HOME</Link>
            <Link to="/shop" className="test-navbar__link">Shop</Link>
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
            <div className="test-navbar__search-wrap hidden md:flex">
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
              className="test-navbar__search-icon hidden md:flex"
              aria-label="Submit Search"
              onClick={handleSearch}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Cart Icon — styled custom as a round button (Hidden on mobile) */}
            <Link
              to="/cart"
              className="test-navbar__cart-icon max-[640px]:hidden"
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
              <div className="flex items-center gap-2 md:gap-3">
                <Link to="/profile" className="test-navbar__profile px-2 md:px-4">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="hidden md:inline">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="test-navbar__logout hidden md:flex"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                id="test-signin-btn"
                className="test-navbar__signin px-3 md:px-5"
              >
                SIGN IN
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-white flex flex-col pt-20 px-6 sm:hidden animate-fade-in font-manrope">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-zinc-900"
            aria-label="Close Mobile Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <nav className="flex flex-col gap-6 text-2xl font-bold tracking-widest uppercase mb-10">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-zinc-500">HOME</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-zinc-500">SHOP</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-zinc-500">CONTACT</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-zinc-500">ABOUT US</Link>
          </nav>

          <div className="w-full h-px bg-zinc-200 mb-8"></div>

          {/* Search in mobile menu */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                  setIsMobileMenuOpen(false);
                }
              }}
              className="w-full bg-zinc-100 rounded-lg px-4 py-3 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-300"
            />
            <button
              onClick={(e) => {
                handleSearch(e);
                setIsMobileMenuOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          {user ? (
            <div className="mt-auto mb-10 flex flex-col gap-3">
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between bg-zinc-50 rounded-xl p-4 border border-zinc-100 hover:bg-zinc-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="flex flex-col text-left font-sans">
                    <span className="text-sm font-bold text-zinc-900">{user.username}</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">View Profile</span>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl py-3.5 font-bold tracking-widest uppercase flex justify-center items-center gap-2 transition text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="mt-auto mb-10">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-[#1c2e3e] hover:bg-[#2c3e50] text-white rounded-xl py-4 font-bold tracking-widest uppercase flex justify-center transition text-sm shadow-md"
              >
                SIGN IN
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
