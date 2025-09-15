import React, { useState } from "react";
import { FaBars, FaTimes, FaCog, FaLock } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/allpages.css";
import { useAudio } from "../context/AudioProvider";
import { toast } from "react-toastify";

export default function Settings() {
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Global audio context
  const { soundOn, setSoundOn, musicOn, setMusicOn } = useAudio();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      toast.error("No user session found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/passwordUpdate/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ token added
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("Password updated successfully!");
      } else {
        toast.error("Error: " + (data.message || "Failed to update password"));
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="withdraw-page">
        <div
          className="withdraw-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <div
          className={`withdraw-overlay ${menuOpen ? "show" : ""}`}
          onClick={() => setMenuOpen(false)}
        ></div>

        <div className="withdraw-layout">
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          <div className="withdraw-content">
            {/* 🔊 Sound & Music Controls */}
            <div
              className="withdraw-summary"
              style={{ flexDirection: "column", gap: "15px" }}
            >
              <div
                className="summary-box"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <FaCog className="summary-icon" /> Music
                </span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={soundOn}
                    onChange={() => {
                      setSoundOn(!soundOn);
                      localStorage.setItem("soundOn", JSON.stringify(!soundOn));
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* 🔐 Password Reset */}
            <div className="withdraw-summary">
              <div
                className="summary-box"
                style={{ flex: "1 1 100%", textAlign: "left" }}
              >
                <FaLock className="summary-icon" />
                <h3>Password Reset</h3>
                <form onSubmit={handlePasswordReset} className="withdraw-form">
                  <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="submit-btn">
                    Reset Password
                  </button>
                </form>
                {message && (
                  <p style={{ marginTop: "10px", color: "green" }}>{message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
