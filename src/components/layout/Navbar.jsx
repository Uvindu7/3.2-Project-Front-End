import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-wrapper">
      <div className="navbar">

        <div className="nav-left">
          <a href="/">HOME</a>
          <a href="/">TRENDING</a>
          <a href="/">CONTACT</a>
          <a href="/">ABOUT US</a>
        </div>

        <div className="nav-center">
          <h1>LOGO</h1>
        </div>

        <div className="nav-right">

          <div className="search-container">
            <input type="text" />
          </div>

          <button className="search-btn">
            🔍
          </button>

          <button className="signin-btn">
            SIGN IN
          </button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;