import React, { useState } from "react";
import { FaPlus, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Css/Navbar.css";
import { useLogoutUserMutation } from "../Api/Slices/userApi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ RTK Query logout hook
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
        {/* ✅ Logout button */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="logout-btn"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>

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
