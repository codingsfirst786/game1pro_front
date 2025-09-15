import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSearch, FaCoins } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/allpages.css";

export default function Purchasing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch coin history for logged-in user
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // First get logged-in user profile
        const profileRes = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = await profileRes.json();
        if (!profileRes.ok) {
          console.error(profileData.message);
          setLoading(false);
          return;
        }

        const userNumber = profileData.userNumber;

        // Now fetch coin history by userNumber
        const res = await fetch(
          `http://localhost:5000/api/coins/full-coin-history/${userNumber}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        if (data.success) {
          setHistory(data.history);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching coin history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Filter records
  const filteredHistory = history.filter((h) =>
    Object.values(h).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="withdraw-page">
        {/* Hamburger Menu */}
        <div
          className="withdraw-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Sidebar Overlay */}
        <div
          className={`withdraw-overlay ${menuOpen ? "show" : ""}`}
          onClick={() => setMenuOpen(false)}
        ></div>

        <div className="withdraw-layout">
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          <div className="withdraw-content">
            {/* Summary Boxes */}
            <div className="withdraw-summary">
              <div className="summary-box">
                <FaCoins className="summary-icon" />
                <h3>Total Records</h3>
                <p>{history.length}</p>
              </div>
              <div className="summary-box">
                <FaCoins className="summary-icon" />
                <h3>Total Coins Added</h3>
                <p>
                  {history.reduce((sum, h) => sum + (h.coinsAdded || 0), 0)}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="table-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by ID, Username, Coins or Date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Table */}
            <div className="table-responsive">
              {loading ? (
                <p>Loading coin history...</p>
              ) : filteredHistory.length > 0 ? (
                <table className="withdraw-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User Number</th>
                      <th>Username</th>
                      <th>Coins Added</th>
                      <th>Added By</th> {/* New */}
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((h) => (
                      <tr key={h._id}>
                        <td>{h._id}</td>
                        <td>{h.userNumber}</td>
                        <td>{h.username}</td>
                        <td>{h.coinsAdded}</td>
                        <td>{h.addedBy}</td> {/* New */}
                        <td>{new Date(h.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No records found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
