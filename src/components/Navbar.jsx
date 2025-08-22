import React, { useState } from "react";
import { FaPlus, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../Css/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>Game1Pro</h1>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`navbar-center ${menuOpen ? "active" : ""}`}>
        <a href="#game">Game</a>
        <a href="#top-games">Top Games</a>
        <a href="#game-rules">Game Rules</a>
      </div>

      <div className="navbar-right">
        <div className="balance-box">
          <span>956 Pkr</span>
        </div>
        <div className="add-more">
          <FaPlus />
          <span>Add More</span>
        </div>
        <Link to="/profile" className="profile-icon">
          <FaUserCircle size={28} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
