// frontend/components/HeaderStats.jsx  (compute "Total Winnings" as PROFIT for current round only)
import React from "react";
import { useAviator } from "../context/useAviator";

const HeaderStats = () => {
  const { balance, userBets, roundId } = useAviator();

  const thisRoundBets = userBets.filter((b) => b.roundId === roundId);

  const numberOfBets = thisRoundBets.length || 0;
  const totalStake = thisRoundBets.reduce((s, b) => s + (b.amount || 0), 0) || 0;

  // Winnings = PROFIT (not gross). At 2x on 40, profit = 40.
  const totalWinnings =
    thisRoundBets.reduce((s, b) => {
      if (b.cashedAt) {
        const profit = Math.ceil(b.amount * b.cashedAt - b.amount);
        return s + Math.max(0, profit);
      }
      return s;
    }, 0) || 0;

  const fmt = (n) => (n ?? 0).toLocaleString("en-US");

  return (
    <div className="header-stats-container">
      <div className="header-stats-item">
        <div className="header-stats-label">Your Balance</div>
        <div className="header-stats-value">
          <span>💰</span> {fmt(Math.ceil(balance))} PKR
        </div>
      </div>

      <div className="header-stats-item">
        <div className="header-stats-label">Number of Bets</div>
        <div className="header-stats-value">
          <span>👥</span> {fmt(numberOfBets)}
        </div>
      </div>

      <div className="header-stats-item">
        <div className="header-stats-label">Total Bets</div>
        <div className="header-stats-value">
          <span>📊</span> {fmt(totalStake)} PKR
        </div>
      </div>

      <div className="header-stats-item">
        <div className="header-stats-label">Total Winnings</div>
        <div className="header-stats-value">
          <span>🏆</span> {fmt(totalWinnings)} PKR
        </div>
      </div>
    </div>
  );
};

export default HeaderStats;
