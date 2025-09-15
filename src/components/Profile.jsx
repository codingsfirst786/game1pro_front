import React, { useState, useEffect } from "react";
import "react-phone-input-2/lib/style.css";
import {
  FaBars,
  FaTimes,
  FaEdit,
  FaUserCircle,
  FaCheck,
  FaTimesCircle,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/profile.css";

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState({});
  // ✅ Initialize formData with whatsappNumber
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePicture: "",
    countryCode: "+92", // default Pakistan 🇵🇰
    whatsappNumber: "",
  });

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setFormData({
            username: data.username,
            email: data.email,
            profilePicture: data.profilePicture || "",
            whatsappNumber: data.whatsappNumber || "0000000", // ✅ default
          });
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = (field) =>
    setEditMode({ ...editMode, [field]: true });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem("token");
      const bodyData = {};

      if (field === "username") bodyData.username = formData.username;
      if (field === "email") bodyData.email = formData.email;
      if (field === "profilePicture")
        bodyData.profilePicture = formData.profilePicture;
      if (field === "whatsappNumber")
        bodyData.whatsappNumber = formData.whatsappNumber;

      const res = await fetch("http://localhost:5000/api/auth/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setEditMode((prev) => ({ ...prev, [field]: false }));
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleCancel = (field) => {
    if (!user) return;
    setFormData({
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || "",
    });
    setEditMode({ ...editMode, [field]: false });
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
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <div className="profile-content glass-card">
          <h2 className="content-heading">Account Details</h2>
          {user ? (
            <div className="profile-info">
              {/* Username */}
              <div className="profile-item">
                <span className="label">👤 Username</span>
                {editMode.username ? (
                  <div className="edit-field">
                    <input
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
              {/* Whatsapp */}
              <div className="profile-item">
                <span className="label">📱 Whatsapp With country code</span>
                {editMode.whatsappNumber ? (
                  <div className="edit-field">
                    <input
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                    />
                    <FaCheck
                      className="save-icon"
                      onClick={() => handleSave("whatsappNumber")}
                    />
                    <FaTimesCircle
                      className="cancel-icon"
                      onClick={() => handleCancel("whatsappNumber")}
                    />
                  </div>
                ) : (
                  <>
                    <span className="value">
                      {user.whatsappNumber || "0000000"}
                    </span>
                    <FaEdit
                      className="edit-icon"
                      onClick={() => handleEditClick("whatsappNumber")}
                    />
                  </>
                )}
              </div>

              {/* Coins */}
              <div className="profile-item">
                <span className="label">💰 Coins</span>
                <span className="value">{user.coins}</span>
              </div>

              {/* Role */}
              <div className="profile-item">
                <span className="label">🛡️ Role</span>
                <span className="value">{user.role}</span>
              </div>

              {/* Created At */}
              <div className="profile-item">
                <span className="label">🗓️ Created At</span>
                <span className="value">
                  {new Date(user.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Updated At */}
              <div className="profile-item">
                <span className="label">🔄 Updated At</span>
                <span className="value">
                  {new Date(user.updatedAt).toLocaleString()}
                </span>
              </div>

              {/* Account Status */}
              <div className="profile-item">
                <span className="label">✅ Account Status</span>
                <span className="value">{user.status || "active"}</span>
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
