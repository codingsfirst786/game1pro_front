import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Css/orders.css";

const PaymentDetails = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const [proof, setProof] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!order) {
    return (
      <div className="page-wrapper">
        <h2>No Order Found</h2>
      </div>
    );
  }

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    toast.info(`Copied: ${value}`);
  };

  // Upload payment proof and confirm
  const handleUploadProof = async () => {
    if (!proof) {
      toast.error("Please upload payment proof");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("proof", proof);
      formData.append("orderId", order._id);
      formData.append("userId", userId);

      const res = await fetch(`http://localhost:5000/api/orders/confirm-payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Payment proof uploaded! Order confirmed.");
        navigate("/orders"); // back to Orders
      } else {
        toast.error(data.message || "Failed to confirm payment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while confirming payment");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="withdraw-page">
        <h1 className="withdraw-heading">Payment Details</h1>

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
              <div className="payment-card">
                <p>
                  <strong>Bank:</strong> {order.account.bank}{" "}
                  <span className="copy-btn" onClick={() => handleCopy(order.account.bank)}>📋</span>
                </p>
                <p>
                  <strong>Title:</strong> {order.account.holder}{" "}
                  <span className="copy-btn" onClick={() => handleCopy(order.account.holder)}>📋</span>
                </p>
                <p>
                  <strong>Number:</strong> {order.account.number}{" "}
                  <span className="copy-btn" onClick={() => handleCopy(order.account.number)}>📋</span>
                </p>
                <p>
                  <strong>Amount:</strong> ${order.amount}
                </p>
              </div>

              <div className="upload-section">
                <label>Upload Payment Proof:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProof(e.target.files[0])}
                />
                <button className="pay-btn" onClick={handleUploadProof}>
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PaymentDetails;
