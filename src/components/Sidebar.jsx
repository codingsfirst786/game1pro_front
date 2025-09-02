import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaTrophy,
  FaMoneyCheckAlt,
  FaShoppingCart,
  FaUniversity,
  FaCog,
} from "react-icons/fa";
import "../Css/profile.css";

const Sidebar = ({ menuOpen, setMenuOpen }) => {
  const handleItemClick = () => {
    if (setMenuOpen) setMenuOpen(false);
  };

  return (
    <div className={`sidebar ${menuOpen ? "open" : ""}`}>
      <ul>
        <li onClick={handleItemClick}>
          <Link to="/profile" className="sidebar-link"><FaUser /> Profile</Link>
        </li>
        <li onClick={handleItemClick}>
          <Link to="/total-wins" className="sidebar-link"><FaTrophy /> Total Wins</Link>
        </li>
        <li onClick={handleItemClick}>
          <Link to="/withdraws" className="sidebar-link"><FaMoneyCheckAlt /> Withdrawal</Link>
        </li>
        <li onClick={handleItemClick}>
          <Link to="/purchasing" className="sidebar-link"><FaShoppingCart /> Purchased</Link>
        </li>
        <li onClick={handleItemClick}>
          <Link to="/orders" className="sidebar-link"><FaUniversity /> Orders Grab</Link>
        </li>
        <li onClick={handleItemClick}>
          <Link to="/cashout" className="sidebar-link"><FaUniversity /> Cash out</Link>
        </li>
         <li onClick={handleItemClick}>
          <Link to="/addcoinsUser" className="sidebar-link"><FaUniversity /> Add Coins</Link>
        </li>
        <li onClick={handleItemClick}>
          <Link to="/account" className="sidebar-link"><FaUniversity /> Withdraw Accounts</Link>
        </li>
        <li onClick={handleItemClick}>
          <Link to="/settings" className="sidebar-link"><FaCog /> Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
