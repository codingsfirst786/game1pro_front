import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaEdit, FaUserCircle, FaCheck, FaTimesCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/profile.css";

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState({}); // Track which fields are being edited
  const [formData, setFormData] = useState({ username: "", email: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        const res = await fetch(`http://localhost:3000/profile/${email}`);
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setFormData({
            username: data.user.username,
            email: data.user.email,
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (field) => {
    try {
      const res = await fetch(`http://localhost:3000/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setEditMode((prev) => ({ ...prev, [field]: false }));
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleCancel = (field) => {
    setFormData({
      username: user.username,
      email: user.email,
    });
    setEditMode((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="profile-page">
      {/* Hamburger Menu */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <div className="profile-container">
        {/* Sidebar */}
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Profile Content */}
        <div className="profile-content glass-card">
          <h2 className="content-heading">Profile Details</h2>

          {/* Profile Avatar */}
          <div className="profile-avatar">
            <FaUserCircle className="avatar-icon" />
            <button className="avatar-edit-btn">
              <FaEdit />
            </button>
          </div>

          {user ? (
            <div className="profile-info">
              {/* Username */}
              <div className="profile-item">
                <span className="label">👤 Name</span>
                {editMode.username ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    <FaCheck
                      className="save-icon"
                      onClick={() => handleSave("username")}
                    />
                    <FaTimesCircle
                      className="cancel-icon"
                      onClick={() => handleCancel("username")}
                    />
                  </div>
                ) : (
                  <>
                    <span className="value">{user.username}</span>
                    <FaEdit
                      className="edit-icon"
                      onClick={() => handleEditClick("username")}
                    />
                  </>
                )}
              </div>

              {/* Email */}
              <div className="profile-item">
                <span className="label">📧 Email</span>
                {editMode.email ? (
                  <div className="edit-field">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <FaCheck
                      className="save-icon"
                      onClick={() => handleSave("email")}
                    />
                    <FaTimesCircle
                      className="cancel-icon"
                      onClick={() => handleCancel("email")}
                    />
                  </div>
                ) : (
                  <>
                    <span className="value">{user.email}</span>
                    <FaEdit
                      className="edit-icon"
                      onClick={() => handleEditClick("email")}
                    />
                  </>
                )}
              </div>

              <div className="profile-item">
                <span className="label">🏆 Total Wins</span>
                <span className="value">25</span>
              </div>

              <div className="profile-item">
                <span className="label">💰 Total Balance</span>
                <span className="value">$500</span>
              </div>

              <div className="profile-item">
                <span className="label">⏳ Pending Withdrawals</span>
                <span className="value">2 Requests</span>
              </div>
            </div>
          ) : (
            <p className="loading">Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
}
