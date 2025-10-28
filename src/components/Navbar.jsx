import React from "react";
import "../index.css";
import twoImg from "../logos/two.png"; // Main logo

const Navbar = ({ setPage, setShowLogin, user, handleLogout }) => {
  return (
    <div className="navbar">
      <div className="navbar-content">
        {/* Left side: Logo + Search */}
        <div className="nav-left">
          <img
            src={twoImg}
            alt="Logo"
            className="navbar-logo"
            onClick={() => setPage("home")}
          />
          <input
            type="text"
            placeholder="Search..."
            className="search-box"
          />
        </div>

        {/* Right side: Home, Resources, Learn, Login/Logout */}
        <div className="nav-right">
          <button className="nav-btn" onClick={() => setPage("home")}>
            Home
          </button>
          <button className="nav-btn" onClick={() => setPage("resources")}>
            Resources
          </button>
          <button className="nav-btn" onClick={() => setPage("education")}>
            Learn
          </button>
          {!user ? (
            <button
              className="nav-btn login-btn"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          ) : (
            <button className="nav-btn login-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
