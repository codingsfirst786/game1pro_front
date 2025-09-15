import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../Css/AddcoinsUser.css";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddcoinsUser = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [coins, setCoins] = useState("");
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  const API_BASE = "http://localhost:5000/api/v2";

  // Fetch user
  const handleFetchUser = async () => {
    if (!userId) {
      toast.error("⚠️ Please enter a User ID first!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/agents-v2/search/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "User not found");
        setUserData(null);
        setHistory([]);
        return;
      }

      setUserData({
        id: data.user.userNumber,
        name: data.user.username,
        image: data.user.image || "https://i.pravatar.cc/100?img=3",
      });

      // Fetch full history immediately
      await fetchUserHistory(data.user.userNumber);

      toast.success("✅ User data fetched successfully!");
    } catch (err) {
      toast.error("❌ Error fetching user");
    }
  };

  // Send coins
  const handleSendCoins = async () => {
    if (!userData) {
      toast.error("⚠️ Please fetch a user first!");
      return;
    }
    if (!coins || coins <= 0) {
      toast.error("⚠️ Please enter a valid coin amount!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/agents-v2/add-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userNumber: userData.id, amount: coins }),
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to send coins");
        return;
      }

      toast.success(`🎉 ${coins} coins sent to ${userData.name}!`);
      setCoins("");

      // ✅ Fetch updated history from backend
      await fetchUserHistory(userData.id);
    } catch (err) {
      toast.error("❌ Error sending coins");
    }
  };

  // Fetch history
  const fetchUserHistory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/agents-v2/history/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();

      if (data.success) {
        const formatted = data.history.map((h) => ({
          id: h.userNumber,
          name: h.username,
          coins: h.coinsAdded,
          image: h.image || "https://i.pravatar.cc/100?img=2",
          payment: `$${(h.coinsAdded * 0.5).toFixed(2)}`,
          date: new Date(h.createdAt).toLocaleString(),
        }));
        setHistory(formatted);
      } else {
        setHistory([]);
      }
    } catch (err) {
      toast.error("❌ Error loading history");
      setHistory([]);
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toString().includes(search)
  );

  return (
    <div className="page-wrapper">
      <div className="withdraw-page">
        <ToastContainer position="top-right" autoClose={3000} />

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
            {/* Input Section */}
            <div className="input-section">
              <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="input"
              />
              <button onClick={handleFetchUser} className="btn fetch-btn">
                Fetch User
              </button>
            </div>

            {/* User Card */}
            {userData && (
              <div className="user-card">
                <img src={userData.image} alt="user" className="user-img" />
                <div>
                  <h3>{userData.name}</h3>
                  <p>ID: {userData.id}</p>
                </div>
              </div>
            )}

            {/* Coins Section */}
            {userData && (
              <div className="coins-section">
                <input
                  type="number"
                  placeholder="Enter Coins Amount"
                  value={coins}
                  onChange={(e) => setCoins(e.target.value)}
                  className="input"
                />
                <button onClick={handleSendCoins} className="btn send-btn">
                  Confirm & Send
                </button>
              </div>
            )}

            {/* History Table */}
            <div className="table-section">
              <h2>Transaction History</h2>
              <input
                type="text"
                placeholder="Search by Name or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
              />

              <table className="history-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Coins</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>
                          <img
                            src={item.image}
                            alt="user"
                            className="table-img"
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.coins}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddcoinsUser;
