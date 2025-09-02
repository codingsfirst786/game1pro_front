import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Css/orders.css";
import Sidebar from "./Sidebar";
import { FaBars, FaTimes } from "react-icons/fa";

const PaymentDetails = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const [copiedText, setCopiedText] = useState("");
  const [proof, setProof] = useState(null);

  if (!order) {
    return (
      <div className="payment-container">
        <h2>No Order Found</h2>
      </div>
    );
  }

  // Copy & show popup
  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopiedText(value);
    setTimeout(() => setCopiedText(""), 1000);
  };

  // Confirm & Pay
  const handleUploadProof = () => {
    if (!proof) return;

    // remove from orders
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let myOrders = JSON.parse(localStorage.getItem("myOrders")) || [];

    orders = orders.filter((o) => o.id !== order.id);
    myOrders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("myOrders", JSON.stringify(myOrders));

    navigate("/orders");
  };

  return (
    <div className="page-wrapper">
      <div className="withdraw-page">
        <h1 className="withdraw-heading">Payment Details</h1>

        {/* Hamburger button */}
        <div className="withdraw-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Overlay */}
        <div
          className={`withdraw-overlay ${menuOpen ? "show" : ""}`}
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Layout */}
        <div className="withdraw-layout">
          {/* Sidebar */}
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          {/* Main content */}
          <div className="withdraw-content">
            <div className="withdraw-summary" style={{ flexDirection: "column", gap: "15px" }}>
              <div className="payment-card">
                <p>
                  <strong>Bank:</strong> {order.accountName}
                  <span className="copy-btn" onClick={() => handleCopy(order.accountName)}>📋</span>
                </p>
                <p>
                  <strong>Title:</strong> {order.accountTitle}
                  <span className="copy-btn" onClick={() => handleCopy(order.accountTitle)}>📋</span>
                </p>
                <p>
                  <strong>Number:</strong> {order.accountNumber}
                  <span className="copy-btn" onClick={() => handleCopy(order.accountNumber)}>📋</span>
                </p>
                <p>
                  <strong>Total:</strong> ${order.totalPayment}
                </p>
              </div>

              <div className="upload-section">
                <label>Upload Payment Proof:</label>
                <input
                  type="file"
                  onChange={(e) => setProof(e.target.files[0])}
                  accept="image/*"
                />
                <button className="pay-btn" onClick={handleUploadProof}>
                  Confirm & Pay
                </button>
              </div>

              {copiedText && <div className="copied-popup">Copied: {copiedText}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
