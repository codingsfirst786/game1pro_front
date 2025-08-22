import React, { useState } from "react";
import { FaBars, FaTimes, FaPlus, FaUniversity } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/allpages.css";

export default function WithdrawAccount() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [holderName, setHolderName] = useState("");

  const [account, setAccount] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAccount({
      bank: bankName,
      number: accountNumber,
      holder: holderName,
    });
    // clear form
    setBankName("");
    setAccountNumber("");
    setHolderName("");
  };

  return (
    <div className="page-wrapper">
      <div className="withdraw-page">
        <h1 className="withdraw-heading">Withdrawal Account</h1>

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
              <div className="summary-box" style={{ flex: "1 1 100%" }}>
                <FaUniversity className="summary-icon" />
                <h3>Add Withdrawal Account</h3>
                <form onSubmit={handleSubmit} className="withdraw-form">
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Account Holder Name"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    required
                  />
                  <button type="submit" className="submit-btn">
                    <FaPlus /> Save Account
                  </button>
                </form>
              </div>
            </div>

            {/* Account Table */}
            <div className="table-responsive">
              <table className="withdraw-table">
                <thead>
                  <tr>
                    <th>Bank</th>
                    <th>Account Number</th>
                    <th>Account Holder</th>
                  </tr>
                </thead>
                <tbody>
                  {account ? (
                    <tr>
                      <td>{account.bank}</td>
                      <td>{account.number}</td>
                      <td>{account.holder}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        style={{ textAlign: "center", color: "gray" }}
                      >
                        No Account Added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
