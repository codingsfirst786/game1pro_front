import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSearch, FaWallet } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/allpages.css";

export default function Withdrawals() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) return;

    const fetchWithdrawals = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/withdraw/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setWithdrawals(data.withdrawals);
          setTotalRequests(data.withdrawals.length);
          const total = data.withdrawals.reduce((sum, w) => sum + w.amount, 0);
          setTotalWithdrawals(total);
        }
      } catch (err) {
        console.error("Error fetching withdrawals:", err);
      }
    };

    fetchWithdrawals();
  }, [userId, token]);

  const filteredWithdrawals = withdrawals.filter((withdrawal) =>
    Object.values(withdrawal)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
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
          {/* Summary Boxes */}
          <div className="withdraw-summary">
            <div className="summary-box">
              <FaWallet className="summary-icon" />
              <h3>Total Requests</h3>
              <p>{totalRequests}</p>
            </div>
            <div className="summary-box">
              <FaWallet className="summary-icon" />
              <h3>Total Withdrawals</h3>
              <p>${totalWithdrawals}</p>
            </div>
          </div>

          {/* Search */}
          <div className="table-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, Amount, Date or Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="withdraw-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Bank</th>
                  <th>Account Number</th>
                  <th>Holder</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.length > 0 ? (
                  filteredWithdrawals.map((wd, idx) => (
                    <tr key={idx}>
                      <td>{wd._id}</td>
                      <td>${wd.amount}</td>
                      <td>{wd.account?.bank || "N/A"}</td>
                      <td>{wd.account?.number || "N/A"}</td>
                      <td>{wd.account?.holder || "N/A"}</td>
                      <td
                        className={
                          wd.status === "Completed"
                            ? "status success"
                            : wd.status === "Processing"
                            ? "status pending"
                            : "status failed"
                        }
                      >
                        {wd.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No Withdrawals Yet
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
