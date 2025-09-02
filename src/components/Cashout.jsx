import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import "../Css/allpages.css";

const Cashout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState(1200);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [orders, setOrders] = useState([]);

  const userId = localStorage.getItem("userId");

  // Fetch withdrawal accounts
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/accounts/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAccounts(data.accounts);
        }
      })
      .catch((err) => console.error("Error fetching accounts:", err));
  }, [userId]);

  // Fetch withdrawal orders
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/orders/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [userId]);

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (withdrawAmount > coins) {
      toast.error("You don’t have enough coins");
      return;
    }
    if (!selectedAccount) {
      toast.error("Select a bank account");
      return;
    }

    const newOrder = {
      amount: withdrawAmount,
      account: selectedAccount,
      status: "Processing",
    };

    try {
      const res = await fetch(`http://localhost:3000/orders/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
        setCoins((prev) => prev - withdrawAmount);
        setWithdrawAmount("");
        setSelectedAccount("");
        toast.success("Withdrawal placed successfully!");
      } else {
        toast.error(data.message || "Failed to place withdrawal");
      }
    } catch (err) {
      console.error("Error placing withdrawal:", err);
      toast.error("Something went wrong, try again later.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="withdraw-page">
        <h1 className="withdraw-heading">Cashout</h1>

        {/* Hamburger Menu */}
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
          {/* Sidebar */}
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          {/* Main Content */}
          <div className="withdraw-content">
            {/* Coins Circle */}
            <div className="coins-circle">
              <span>{coins}</span>
              <p>Total Coins</p>
            </div>

            {/* Withdraw Form */}
            <div className="withdraw-form-box">
              <input
                type="number"
                placeholder="Enter amount to withdraw"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />

              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                <option value="">Select Bank Account</option>
                {accounts.map((acc, index) => (
                  <option key={index} value={acc.number}>
                    {acc.bank} - {acc.number} ({acc.holder})
                  </option>
                ))}
              </select>

              <button className="submit-btn" onClick={handleWithdraw}>
                Withdraw
              </button>
            </div>

            {/* Orders Table */}
            <div className="cashout-orders">
              <h2>Your Withdrawals</h2>
              <table className="withdraw-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Account</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, idx) => (
                      <tr key={idx}>
                        <td>{order.amount}</td>
                        <td>{order.account}</td>
                        <td
                          className={
                            order.status === "Completed"
                              ? "status-completed"
                              : "status-processing"
                          }
                        >
                          {order.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
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

      {/* Toastify */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Cashout;
