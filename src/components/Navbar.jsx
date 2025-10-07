// src/components/Navbar.jsx
import React from "react";
import "../index.css";
import threeImg from "../logos/three.jpg";
import twoImg from "../logos/two.png";


const Navbar = ({ setPage, setShowLogin, user, handleLogout }) => {
  return (
    <div className="navbar">
      <div className="container navbar-content">
        <div className="nav-left">
          <input type="text" placeholder="Search..." className="search-box" />
        </div>

        <div className="nav-left">
          <a href="#" onClick={() => setPage("home")}>
            <img src={twoImg} alt="Logo" className="navbar-logo" />   {/*/this line to change navbar logo */}
          </a>
        </div>

        <div className="nav-right">
            <button className="Learn" onClick={() => setPage("resources")}>
            Resources
          </button>
          <button className="Learn" onClick={() => setPage("education")}>
            Learn
          </button>
          
          <button className="Scanners" onClick={() => setPage("scanners")}>
            Scanners
          </button>

          {!user ? (
            <button className="sign-up" onClick={() => setShowLogin(true)}>
              Login
            </button>
          ) : (
            <button className="sign-up" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
