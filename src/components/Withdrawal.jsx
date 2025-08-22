import React, { useState } from "react";
import { FaBars, FaTimes, FaSearch, FaWallet } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/allpages.css";

export default function Withdrawals() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const totalRequests = 15;
  const totalWithdrawals = 540;

  const withdrawalsData = [
    { id: 1, amount: 100, date: "2025-08-20", status: "Completed" },
    { id: 2, amount: 50, date: "2025-08-21", status: "Pending" },
    { id: 3, amount: 200, date: "2025-08-22", status: "Failed" },
    { id: 4, amount: 120, date: "2025-08-19", status: "Completed" },
    { id: 5, amount: 70, date: "2025-08-18", status: "Pending" },
  ];

  const filteredWithdrawals = withdrawalsData.filter((withdrawal) =>
    Object.values(withdrawal)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="withdraw-page">
      <h1 className="withdraw-heading">Withdrawal Records</h1>

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
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.map((wd) => (
                  <tr key={wd.id}>
                    <td>{wd.id}</td>
                    <td>${wd.amount}</td>
                    <td>{wd.date}</td>
                    <td
                      className={
                        wd.status === "Completed"
                          ? "status success"
                          : wd.status === "Pending"
                          ? "status pending"
                          : "status failed"
                      }
                    >
                      {wd.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
