import React, { useState } from "react";
import { FaBars, FaTimes, FaSearch, FaTrophy } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/allpages.css";

export default function Wins() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const totalWins = 6;
  const totalAmount = 750;

  const winsData = [
    {
      id: 1,
      name: "John Doe",
      amount: 200,
      date: "2025-08-15",
      status: "Completed",
    },
    {
      id: 2,
      name: "Ali Khan",
      amount: 150,
      date: "2025-08-16",
      status: "Pending",
    },
    {
      id: 3,
      name: "Sarah Lee",
      amount: 100,
      date: "2025-08-17",
      status: "Completed",
    },
    {
      id: 4,
      name: "David Smith",
      amount: 180,
      date: "2025-08-18",
      status: "Failed",
    },
    {
      id: 5,
      name: "Ayesha Noor",
      amount: 120,
      date: "2025-08-20",
      status: "Completed",
    },
  ];

  const filteredWins = winsData.filter((win) =>
    Object.values(win)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="withdraw-page">
      <h1 className="withdraw-heading">Win Records</h1>

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
          <div className="withdraw-summary">
            <div className="summary-box">
              <FaTrophy className="summary-icon" />
              <h3>Total Wins</h3>
              <p>{totalWins}</p>
            </div>
            <div className="summary-box">
              <FaTrophy className="summary-icon" />
              <h3>Total Amount</h3>
              <p>${totalAmount}</p>
            </div>
          </div>

          <div className="table-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Sequence, Name, Amount, Date or Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="withdraw-table">
              <thead>
                <tr>
                  <th>Sequence</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredWins.map((w) => (
                  <tr key={w.id}>
                    <td>{w.id}</td>
                    <td>{w.name}</td>
                    <td>${w.amount}</td>
                    <td>{w.date}</td>
                    <td
                      className={
                        w.status === "Completed"
                          ? "status success"
                          : w.status === "Pending"
                          ? "status pending"
                          : "status failed"
                      }
                    >
                      {w.status}
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
