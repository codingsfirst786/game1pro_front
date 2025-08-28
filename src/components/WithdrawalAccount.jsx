// import React, { useState } from "react";
// import { FaBars, FaTimes, FaPlus, FaUniversity } from "react-icons/fa";
// import Sidebar from "./Sidebar";
// import "../Css/allpages.css";

// export default function WithdrawAccount() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const [bankName, setBankName] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [holderName, setHolderName] = useState("");

//   const [accounts, setAccounts] = useState([]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const newAccount = {
//       bank: bankName,
//       number: accountNumber,
//       holder: holderName,
//     };

//     setAccounts([...accounts, newAccount]);

//     setBankName("");
//     setAccountNumber("");
//     setHolderName("");
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="withdraw-page">
//         <h1 className="withdraw-heading">Withdrawal Account</h1>

//         <div
//           className="withdraw-hamburger"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <FaTimes /> : <FaBars />}
//         </div>

//         <div
//           className={`withdraw-overlay ${menuOpen ? "show" : ""}`}
//           onClick={() => setMenuOpen(false)}
//         ></div>

//         <div className="withdraw-layout">
//           <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

//           <div className="withdraw-content">
//             <div className="withdraw-summary">
//               <div className="summary-box" style={{ flex: "1 1 100%" }}>
//                 <FaUniversity className="summary-icon" />
//                 <h3>Add Withdrawal Account</h3>
//                 <form onSubmit={handleSubmit} className="withdraw-form">
//                   <input
//                     type="text"
//                     placeholder="Bank Name"
//                     value={bankName}
//                     onChange={(e) => setBankName(e.target.value)}
//                     required
//                   />
//                   <input
//                     type="text"
//                     placeholder="Account Number"
//                     value={accountNumber}
//                     onChange={(e) => setAccountNumber(e.target.value)}
//                     required
//                   />
//                   <input
//                     type="text"
//                     placeholder="Account Holder Name"
//                     value={holderName}
//                     onChange={(e) => setHolderName(e.target.value)}
//                     required
//                   />
//                   <button type="submit" className="submit-btn">
//                     <FaPlus /> Save Account
//                   </button>
//                 </form>
//               </div>
//             </div>

//             <div className="table-responsive">
//               <table className="withdraw-table">
//                 <thead>
//                   <tr>
//                     <th>Bank</th>
//                     <th>Account Number</th>
//                     <th>Account Holder</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {accounts.length > 0 ? (
//                     accounts.map((acc, index) => (
//                       <tr key={index}>
//                         <td>{acc.bank}</td>
//                         <td>{acc.number}</td>
//                         <td>{acc.holder}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="3"
//                         style={{ textAlign: "center", color: "gray" }}
//                       >
//                         No Account Added
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaPlus, FaUniversity } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../Css/allpages.css";

export default function WithdrawAccount() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [holderName, setHolderName] = useState("");

  const [accounts, setAccounts] = useState([]);

  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/accounts/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAccounts(data.accounts);
        } else {
          console.error("Failed to fetch accounts:", data.message);
        }
      })
      .catch((err) => console.error("Error fetching accounts:", err));
  }, [userId]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAccount = {
      bank: bankName,
      number: accountNumber,
      holder: holderName,
    };

    try {
      const res = await fetch(`http://localhost:3000/accounts/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });

      const data = await res.json();

      if (data.success) {
        setAccounts(data.accounts); 
        setBankName("");
        setAccountNumber("");
        setHolderName("");
      } else {
        alert(data.message || "Failed to add account");
      }
    } catch (err) {
      console.error("Error adding account:", err);
    }
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
                  {accounts.length > 0 ? (
                    accounts.map((acc, index) => (
                      <tr key={index}>
                        <td>{acc.bank}</td>
                        <td>{acc.number}</td>
                        <td>{acc.holder}</td>
                      </tr>
                    ))
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
