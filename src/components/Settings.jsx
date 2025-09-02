
import React, { useState } from "react";
import { FaBars, FaTimes, FaCog, FaLock } from "react-icons/fa"; 
import Sidebar from "./Sidebar";
import "../Css/allpages.css"; 

export default function Settings() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message] = useState("");

const handlePasswordReset = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match!");
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("No userId found in localStorage");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/passwordUpdate/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error updating password:", error);
  }
};

  return (
    <div className="page-wrapper">
      <div className="withdraw-page">
        <h1 className="withdraw-heading">Settings</h1>

        <div className="withdraw-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <div
          className={`withdraw-overlay ${menuOpen ? "show" : ""}`}
          onClick={() => setMenuOpen(false)}
        ></div>

        <div className="withdraw-layout">
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          <div className="withdraw-content">
            <div className="withdraw-summary" style={{ flexDirection: "column", gap: "15px" }}>
              <div className="summary-box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><FaCog className="summary-icon" /> Sound</span>
                <label className="switch">
                  <input type="checkbox" checked={soundOn} onChange={() => setSoundOn(!soundOn)} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="summary-box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><FaCog className="summary-icon" /> Music</span>
                <label className="switch">
                  <input type="checkbox" checked={musicOn} onChange={() => setMusicOn(!musicOn)} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="withdraw-summary">
              <div className="summary-box" style={{ flex: "1 1 100%", textAlign: "left" }}>
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
                  <button type="submit" className="submit-btn">Reset Password</button>
                </form>
                {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
