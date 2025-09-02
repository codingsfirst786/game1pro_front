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

  const handleFetchUser = () => {
    if (!userId) {
      toast.error("⚠️ Please enter a User ID first!");
      return;
    }

    const sampleUser = {
      id: userId,
      name: "John Doe",
      image: "https://i.pravatar.cc/100?img=3",
    };
    setUserData(sampleUser);
    toast.success("✅ User data fetched successfully!");
  };

  const handleSendCoins = () => {
    if (!userData) {
      toast.error("⚠️ Please fetch a user first!");
      return;
    }
    if (!coins || coins <= 0) {
      toast.error("⚠️ Please enter a valid coin amount!");
      return;
    }

    const newEntry = {
      id: userData.id,
      name: userData.name,
      image: userData.image,
      coins: coins,
      payment: `$${(coins * 0.5).toFixed(2)}`,
      date: new Date().toLocaleDateString(),
    };

    setHistory([newEntry, ...history]);
    toast.success(`🎉 ${coins} coins sent to ${userData.name}!`);

    // Reset form
    setCoins("");
    setUserData(null);
    setUserId("");
  };

  const filteredHistory = history.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toString().includes(search)
  );

  return (
    <div className="page-wrapper">
      <div className="withdraw-page">
        <h1 className="withdraw-heading">Add Coins to User</h1>

        {/* Toastify Container */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Hamburger Menu */}
        <div
          className="withdraw-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Overlay */}
        <div
          className={`withdraw-overlay ${menuOpen ? "show" : ""}`}
          onClick={() => setMenuOpen(false)}
        ></div>

        <div className="withdraw-layout">
          {/* Sidebar */}
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          {/* Main Content */}
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
                    <th>Payment</th>
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
                        <td>{item.payment}</td>
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
