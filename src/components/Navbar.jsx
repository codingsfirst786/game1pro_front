import React, { useState } from "react";
import { FaPlus, FaBars, FaTimes } from "react-icons/fa";
import "../Css/Navbar.css"; 

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left: App Name */}
      <div className="navbar-left">
        <h1>Game1Pro</h1>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Center: Nav Links */}
      <div className={`navbar-center ${menuOpen ? "active" : ""}`}>
        <a href="#game">Game</a>
        <a href="#top-games">Top Games</a>
        <a href="#game-rules">Game Rules</a>
      </div>

      {/* Right: Balance & Add More */}
      <div className="navbar-right">
        <div className="balance-box">
          <span>956 Pkr</span>
        </div>
        <div className="add-more">
          <FaPlus />
          <span>Add More</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
