import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaCopy } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Css/Orders.css";

const Orders = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [tab, setTab] = useState("orders");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // ✅ Copy text handler
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  // Fetch all processing orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    }
  };

  // Fetch my grabbed orders
  const fetchMyOrders = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/my/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMyOrders(data.orders);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch your orders");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMyOrders(); // always load my orders from backend
  }, [token, userId]);

  // Currency conversion
  // const convertToLocal = (country, usd) => {
  //   if (country === "Pakistan") return usd * 280;
  //   if (country === "India") return usd * 85;
  //   return usd;
  // };

  // Grab an order
  const handleGrabOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/grab/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(`${data.order.amount} coins added to you!`);
        fetchOrders(); // refresh order list
        fetchMyOrders(); // refresh my orders permanently
      } else {
        toast.error(data.message || "Failed to grab order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while grabbing order");
    }
  };

  return (
    <div className="page-wrapper">
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
            <div className="tab-buttons">
              <button
                onClick={() => setTab("orders")}
                className={tab === "orders" ? "active" : ""}
              >
                Order List
              </button>
              <button
                onClick={() => setTab("myorders")}
                className={tab === "myorders" ? "active" : ""}
              >
                My Orders
              </button>
            </div>

            <div className="table-container">
              {tab === "orders" ? (
                orders.length === 0 ? (
                  <div className="empty-box">No Orders Available</div>
                ) : (
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>User #</th>
                        <th>Country</th>
                        <th>Bank</th>
                        <th>Title</th>
                        <th>Account Number</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            {order.userNumber}{" "}
                            <FaCopy
                              className="copy-icon"
                              onClick={() =>
                                handleCopy(order.userNumber, "User number")
                              }
                            />
                          </td>
                          <td>{order.country}</td>
                          <td>{order.account.bank}</td>
                          <td>{order.account.holder}</td>
                          <td>
                            {order.account.number}{" "}
                            <FaCopy
                              className="copy-icon"
                              onClick={() =>
                                handleCopy(
                                  order.account.number,
                                  "Account number"
                                )
                              }
                            />
                          </td>
                          <td>{ order.amount}</td>
                          <td>
                            <button
                              className="grab-btn"
                              onClick={() => handleGrabOrder(order._id)}
                            >
                              Grab
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              ) : myOrders.length === 0 ? (
                <div className="empty-box">No Orders Yet</div>
              ) : (
                <>
                  <div className="order-summary">
                    <strong>Total My Orders: {myOrders.length}</strong>
                  </div>

                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Bank</th>
                        <th>Title</th>
                        <th>Account Number</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myOrders.map((order) => (
                        <tr key={order._id}>
                          <td>{order.country}</td>
                          <td>{order.account.bank}</td>
                          <td>{order.account.holder}</td>
                          <td>
                            {order.account.number}{" "}
                            <FaCopy
                              className="copy-icon"
                              onClick={() =>
                                handleCopy(
                                  order.account.number,
                                  "Account number"
                                )
                              }
                            />
                          </td>
                          <td>{order.amount}</td>
                          <td>{order.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Orders;
