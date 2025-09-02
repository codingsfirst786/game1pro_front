import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/Orders.css";

const Orders = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Load data from localStorage if available
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            country: "Pakistan",
            accountName: "Habib Bank",
            accountTitle: "Ali Khan",
            accountNumber: "PK123456789",
            totalPayment: 100,
          },
          {
            id: 2,
            country: "India",
            accountName: "State Bank",
            accountTitle: "Rohit Sharma",
            accountNumber: "IN987654321",
            totalPayment: 200,
          },
        ];
  });

  const [myOrders, setMyOrders] = useState(() => {
    const saved = localStorage.getItem("myOrders");
    return saved ? JSON.parse(saved) : [];
  });

  const [tab, setTab] = useState("orders");

  // Save whenever changes happen
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("myOrders", JSON.stringify(myOrders));
  }, [myOrders]);

  // Currency conversion
  const convertToLocal = (country, usd) => {
    if (country === "Pakistan") return usd * 280;
    if (country === "India") return usd * 85;
    return usd;
  };

  // Grab Order → go to PaymentDetails
  const handleGrabOrder = (order) => {
    navigate("/payment-details", { state: { order } });
  };

  return (
    <div className="page-wrapper">
      <div className="withdraw-page">
        <h1 className="withdraw-heading">Orders</h1>

        {/* Hamburger for sidebar */}
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
            {/* Tabs */}
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

            {/* Orders Table */}
            <div className="table-container">
              {tab === "orders" && (
                <>
                  {orders.length === 0 ? (
                    <div className="empty-box">No Orders Available</div>
                  ) : (
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Country</th>
                          <th>Bank</th>
                          <th>Title</th>
                          <th>USD</th>
                          <th>Local</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.country}</td>
                            <td>{order.accountName}</td>
                            <td>{order.accountTitle}</td>
                            <td>${order.totalPayment}</td>
                            <td>
                              {convertToLocal(
                                order.country,
                                order.totalPayment
                              )}
                            </td>
                            <td>
                              <button
                                className="grab-btn"
                                onClick={() => handleGrabOrder(order)}
                              >
                                Grab Order
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {tab === "myorders" && (
                <>
                  {myOrders.length === 0 ? (
                    <div className="empty-box">No Orders Yet</div>
                  ) : (
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Country</th>
                          <th>Bank</th>
                          <th>Title</th>
                          <th>USD</th>
                          <th>Local</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myOrders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.country}</td>
                            <td>{order.accountName}</td>
                            <td>{order.accountTitle}</td>
                            <td>${order.totalPayment}</td>
                            <td>
                              {convertToLocal(
                                order.country,
                                order.totalPayment
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
