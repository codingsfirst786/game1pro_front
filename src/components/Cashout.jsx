import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import "../Css/allpages.css";

const Cashout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch full user data
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/users/${userId}/full`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user); // data.user has withdrawals
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, [userId]);

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (withdrawAmount > (user?.coins || 0)) {
      toast.error("You don’t have enough coins");
      return;
    }
    if (!selectedAccount) {
      toast.error("Select a bank account");
      return;
    }

    const accountObj = user.bankAccounts.find(
      (acc) => acc.number === selectedAccount
    );

    try {
      const res = await fetch(`http://localhost:5000/api/withdraw/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: withdrawAmount, account: accountObj }),
      });

      const data = await res.json();

      if (data.success) {
        setUser((prev) => ({
          ...prev,
          coins: prev.coins - withdrawAmount,
          withdrawals: [
            ...(prev.withdrawals || []),
            {
              amount: withdrawAmount,
              account: accountObj,
              status: "Processing",
            },
          ],
        }));
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
              <span>{user?.coins || 0}</span>
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
                {user?.bankAccounts?.map((acc, idx) => (
                  <option key={idx} value={acc.number}>
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
                    <th>Bank</th>
                    <th>Account Number</th>
                    <th>Holder</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user?.withdrawals?.length > 0 ? (
                    user.withdrawals.map((order, idx) => (
                      <tr key={idx}>
                        <td>{order.amount}</td>
                        <td>{order.account?.bank || "N/A"}</td>
                        <td>{order.account?.number || "N/A"}</td>
                        <td>{order.account?.holder || "N/A"}</td>
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
                      <td colSpan="5" style={{ textAlign: "center" }}>
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
