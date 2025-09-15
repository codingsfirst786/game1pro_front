// frontend/components/HistoryTable.jsx
import React from "react";
import { useAviator } from "../context/useAviator";
import "./Aviator.css";

const HistoryTable = () => {
  const { publicBets, multiplier, phase } = useAviator();

  const rows = publicBets.slice(0, 50);

  return (
    <div className="history-table-container">
      <div className="history-table-header">
        <span>📜 ROUND BETS</span>
        <span className="history-table-header-info">Live bets this round</span>
      </div>

      <div className="history-table-content">
        <div className="history-table-inner">
          <div className="history-table-headings">
            <span className="history-table-heading">STAKE</span>
            <span className="history-table-heading">CRASH</span>
            <span className="history-table-heading">RESULT</span>
          </div>

          <div className="history-table-rows">
            {rows.length > 0 ? (
              rows.map((bet) => {
                const liveX =
                  phase === "RUNNING" ? `${multiplier.toFixed(2)}x` : phase === "BETTING" ? "—" : "CRASHED";
                const profitNow =
                  phase === "RUNNING" ? Math.max(0, Math.ceil(bet.amount * multiplier - bet.amount)) : 0;

                return (
                  <div key={bet.id} className="history-table-row">
                    <span className="history-table-stake">
                      {bet.amount} <sub className="history-table-currency">PKR</sub>
                    </span>
                    <span className="history-table-crash">{liveX}</span>
                    <span className={profitNow > 0 ? "history-table-win" : "history-table-loss"}>
                      {profitNow > 0 ? `+${profitNow}` : profitNow}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="history-table-no-data">
                <p>No bets yet — place your first bet!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
