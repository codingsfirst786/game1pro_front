import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSearch, FaTrophy } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/allpages.css";

export default function Wins() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);

  // ✅ Fetch user profile & game history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok && data.gameHistory) {
          const sortedHistory = data.gameHistory.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setHistory(sortedHistory);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, []);

  // ✅ Split into Win and Loss using exact result field
  const winsData = history
    .filter((h) => h.result === "Win")
    .slice(0, 20);

  const loseData = history
    .filter((h) => h.result === "Loss")
    .slice(0, 20);

  const totalWins = winsData.length;
  const totalAmount = winsData.reduce(
    (sum, h) => sum + (h.amount || h.betAmount || 0),
    0
  );

  // ✅ Search filter
  const filterRecords = (records) =>
    records.filter((r) =>
      Object.values(r)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const filteredWins = filterRecords(winsData);
  const filteredLoses = filterRecords(loseData);

  return (
    <div className="withdraw-page">
      {/* Sidebar Hamburger */}
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
          {/* ✅ Summary */}
          <div className="withdraw-summary">
            <div className="summary-box">
              <FaTrophy className="summary-icon" />
              <h3>Total Wins (Last 20)</h3>
              <p>{totalWins}</p>
            </div>
            <div className="summary-box">
              <FaTrophy className="summary-icon" />
              <h3>Total Winning Amount</h3>
              <p>₹{totalAmount}</p>
            </div>
          </div>

          {/* ✅ Search */}
          <div className="table-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Bet, Amount, Date or Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* ✅ Win History */}
          <div className="table-responsive">
            <table className="withdraw-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bet</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredWins.length > 0 ? (
                  filteredWins.map((w, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{w.bet}</td>
                      <td>₹{w.amount || w.betAmount}</td>
                      <td>{new Date(w.date).toLocaleString()}</td>
                      <td className="status success">
                        <FaCheckCircle color="green" /> Win
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No win history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Loss History */}
          <h3 style={{ marginTop: "30px" }}>Loss History (Last 20)</h3>
          <div className="table-responsive">
            <table className="withdraw-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bet</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoses.length > 0 ? (
                  filteredLoses.map((l, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{l.bet}</td>
                      <td>₹{l.amount || l.betAmount}</td>
                      <td>{new Date(l.date).toLocaleString()}</td>
                      <td className="status failed">
                        <FaTimesCircle color="red" /> Loss
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No loss history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
