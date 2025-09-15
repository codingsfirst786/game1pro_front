// frontend/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaCopy,
  FaSignOutAlt,
} from "react-icons/fa";
import { LuHandCoins } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Css/Navbar.css";
import logo from "../assets/Logo (3).png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout successful!");
    navigate("/login");
  };

  const copyUserNumber = () => {
    if (!userData?.userNumber) return;
    navigator.clipboard
      .writeText(String(userData.userNumber))
      .then(() => toast.success("User ID copied"))
      .catch(() => toast.error("Copy failed"));
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUserData({
          ...data,
          coins: Math.floor(Number(data.coins || 0)),
        });
      }
    } catch (e) {
      // silent fail to avoid spam on mobile
    }
  };

  useEffect(() => {
    fetchUserData();
    const id = setInterval(fetchUserData, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="logo-wrap" aria-label="Home">
          <img src={logo} alt="Game1Pro" className="logo" />
        </Link>
      </div>

      <button
        className="hamburger"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`navbar-center ${menuOpen ? "active" : ""}`}>
        <Link to="/home" onClick={() => setMenuOpen(false)}>Game</Link>
        <Link to="/game-rules" onClick={() => setMenuOpen(false)}>Game Rules</Link>
      </div>

      <div className="navbar-right">
        <button
          className="balance-box id-box"
          onClick={copyUserNumber}
          title="Copy User ID"
          aria-label="Copy User ID"
        >
          <span className="id-label">ID:</span>
          <span className="id-value">{userData?.userNumber || "-"}</span>
          <FaCopy className="id-copy" />
        </button>

        <div className="balance-box coins-box" aria-label="Coins">
          <LuHandCoins className="coins-icon" />
          <span className="coins-value">{userData?.coins ?? 0}</span>
        </div>

        <Link to="/agentscreen" className="add-more" aria-label="Add">
          <FaPlus />
          <span className="add-text">Add</span>
        </Link>

        <Link to="/profile" className="profile-icon" aria-label="Profile">
          <FaUserCircle size={22} />
        </Link>

        <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
          <FaSignOutAlt />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
