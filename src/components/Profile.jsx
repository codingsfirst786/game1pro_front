import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaEdit, FaUserCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/profile.css";

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        const res = await fetch(`http://localhost:3000/profile/${email}`);
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="profile-page">
      <h1 className="profile-heading">Profile Page</h1>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div
        className={`sidebar-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <div className="profile-container">
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <div className="profile-content">
          <h2 className="content-heading">Profile Details</h2>

          <div className="profile-avatar">
            <FaUserCircle className="avatar-icon" />
            <FaEdit className="avatar-edit" />
          </div>

          {user ? (
            <>
              <div className="profile-item">
                <span className="label">Name:</span>
                <span className="value">{user.username}</span>
                <FaEdit className="edit-icon" />
              </div>

              <div className="profile-item">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
                <FaEdit className="edit-icon" />
              </div>

              <div className="profile-item">
                <span className="label">Total Wins:</span>
                <span className="value">25</span>
              </div>

              <div className="profile-item">
                <span className="label">Total Balance:</span>
                <span className="value">$500</span>
              </div>

              <div className="profile-item">
                <span className="label">Pending Withdrawals:</span>
                <span className="value">2 Requests</span>
              </div>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
}
