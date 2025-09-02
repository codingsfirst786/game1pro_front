import React, { useState } from "react";
import { FaPlus, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Css/Navbar.css";
import { useLogoutUserMutation } from "../Api/Slices/userApi";
import logo from "../assets/Logo (3).png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      const res = await logoutUser().unwrap();
      toast.success(res?.message || "Logout successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Logout failed!");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home">
          <img src={logo} alt="Game1Pro" className="logo" />
        </Link>
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
          <span>956 PKR</span>
        </div>

        <Link to="/agentscreen">
          <div className="add-more">
            <FaPlus />
            <span>Add More</span>
          </div>
        </Link>

        <Link to="/profile" className="profile-icon">
          <FaUserCircle size={28} />
        </Link>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="logout-btn"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
