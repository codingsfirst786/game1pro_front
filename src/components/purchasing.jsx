import React, { useState } from "react";
import { FaBars, FaTimes, FaSearch, FaShoppingCart } from "react-icons/fa"; 
import Sidebar from "./Sidebar";
import "../Css/allpages.css"; 

export default function Purchasing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const totalRequests = 10;
  const totalPurchased = 890;

  const purchaseData = [
    { id: 1, item: "Laptop", amount: 500, date: "2025-08-15", status: "Completed" },
    { id: 2, item: "Headphones", amount: 120, date: "2025-08-17", status: "Pending" },
    { id: 3, item: "Keyboard", amount: 60, date: "2025-08-20", status: "Completed" },
    { id: 4, item: "Mouse", amount: 40, date: "2025-08-21", status: "Failed" },
    { id: 5, item: "Monitor", amount: 170, date: "2025-08-22", status: "Completed" },
  ];

  const filteredPurchases = purchaseData.filter((purchase) =>
    Object.values(purchase)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper">
    <div className="withdraw-page">
      <h1 className="withdraw-heading">Purchasing Records</h1>

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
          {/* Summary Boxes */}
          <div className="withdraw-summary">
            <div className="summary-box">
              <FaShoppingCart className="summary-icon" />
              <h3>Total Requests</h3>
              <p>{totalRequests}</p>
            </div>
            <div className="summary-box">
              <FaShoppingCart className="summary-icon" />
              <h3>Total Purchased</h3>
              <p>${totalPurchased}</p>
            </div>
          </div>

          {/* Search */}
          <div className="table-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, Item, Amount, Date or Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="withdraw-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.item}</td>
                    <td>${p.amount}</td>
                    <td>{p.date}</td>
                    <td
                      className={
                        p.status === "Completed"
                          ? "status success"
                          : p.status === "Pending"
                          ? "status pending"
                          : "status failed"
                      }
                    >
                      {p.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
        </div>

  );
}
