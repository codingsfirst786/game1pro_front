// frontend/components/BetControls.jsx
import { useState, useEffect, useMemo } from "react";
import { useAviator } from "../context/useAviator";
import { FaTimes, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

const BetControls = ({ compact, side = "left" }) => {
  const { placeBet, cashOut, cancelBet, userBets, multiplier, phase, balance, timeLeft } = useAviator();

  const CHIP_AMOUNTS = [20, 50, 100, 500, 1000, 2000];
  const MIN_BET = 5;
  const MAX_BET = 50000;

  const [value, setValue] = useState("");
  const [hasPlaced, setHasPlaced] = useState(false);
  const [canCashout, setCanCashout] = useState(false);
  const [activeBetId, setActiveBetId] = useState(null);
  const [activeBet, setActiveBet] = useState(null);
  const [selectedChip, setSelectedChip] = useState(null);

  // Autoplay (per side)
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [autoplayAmount, setAutoplayAmount] = useState(20);
  const [lastManualAmount, setLastManualAmount] = useState(20);

  // Auto cashout (per side)
  const [autoCashEnabled, setAutoCashEnabled] = useState(false);
  const [autoCashTarget, setAutoCashTarget] = useState("2.00"); // keep as string to allow decimal typing
  const [editingAutoCash, setEditingAutoCash] = useState(false); // open editor

  const isBettingOpen = phase === "BETTING" && timeLeft > 0;

  // track this side's latest active bet
  useEffect(() => {
    const betsThisSide = userBets.filter((b) => b.side === side && b.active && !b.cashedAt);
    const latest = betsThisSide[0] || null; // newest first
    setActiveBet(latest);
    if (isBettingOpen) {
      setHasPlaced(!!latest);
      setCanCashout(false);
      setActiveBetId(latest ? latest.id : null);
    } else if (phase === "RUNNING") {
      setHasPlaced(!!latest);
      setCanCashout(!!latest);
      setActiveBetId(latest ? latest.id : null);
    } else {
      setHasPlaced(false);
      setCanCashout(false);
      setActiveBetId(null);
    }
  }, [userBets, side, phase, timeLeft, isBettingOpen]);

  // Autoplay: early in BETTING window (>5s), use lastManualAmount
  useEffect(() => {
    if (!isAutoplay) return;
    if (isBettingOpen && !hasPlaced && timeLeft > 5) {
      const amt = autoplayAmount || lastManualAmount || 20;
      if (balance >= amt) {
        handleAutoPlace(amt);
      } else {
        setIsAutoplay(false);
        toast.error("Insufficient balance for autoplay");
      }
    }
  }, [phase, isAutoplay, hasPlaced, balance, timeLeft, isBettingOpen]); // eslint-disable-line

  // Auto cashout watcher
  useEffect(() => {
    if (!autoCashEnabled) return;
    if (phase !== "RUNNING") return;
    if (!canCashout || !activeBetId || !activeBet) return;

    const target = Number(autoCashTarget);
    if (!isFinite(target) || target <= 1.01) return;

    if (multiplier >= target) {
      (async () => {
        const res = await cashOut(activeBetId);
        if (!res.ok && res.message) {
          toast.error(res.message);
        }
      })();
    }
  }, [autoCashEnabled, autoCashTarget, multiplier, phase, canCashout, activeBetId, activeBet, cashOut]);

  const handleChange = (e) => {
    if (/^\d*$/.test(e.target.value)) {
      setValue(e.target.value);
      setSelectedChip(null);
      const num = Number(e.target.value);
      if (num > 0) setLastManualAmount(num);
    }
  };

  const handleChipClick = async (amt) => {
    if (!isBettingOpen) return;
    if (balance < amt) return;

    if (hasPlaced) {
      // place another bet instantly (chips stay enabled while betting window is open)
      const res = await placeBet(amt, side);
      if (!res.ok && res.message) toast.error(res.message);
      return;
    }

    if (selectedChip === amt) {
      const newValue = Math.min((Number(value) || amt) * 2, MAX_BET);
      const final = Math.min(newValue, balance);
      setValue(String(final));
      setLastManualAmount(final);
    } else {
      setSelectedChip(amt);
      const val = Math.min(amt, balance, MAX_BET);
      setValue(String(val));
      setLastManualAmount(val);
    }
  };

  const handleAutoPlace = async (amt) => {
    const result = await placeBet(amt, side);
    if (result.ok) {
      setHasPlaced(true);
      setActiveBetId(result.bet.id);
    } else if (result.message) {
      toast.error(result.message);
      setIsAutoplay(false);
    }
  };

  const handlePlace = async () => {
    if (!isBettingOpen) return;
    const numValue = Number(value);
    if (!numValue) return;
    if (numValue < MIN_BET || numValue > MAX_BET) {
      toast.error(`Bet must be between ${MIN_BET} and ${MAX_BET}`);
      return;
    }
    if (numValue > balance) {
      toast.error("Insufficient balance");
      return;
    }
    const result = await placeBet(numValue, side);
    if (result.ok) {
      setHasPlaced(true);
      setActiveBetId(result.bet.id);
      setValue("");
      setSelectedChip(null);
    } else if (result.message) {
      toast.error(result.message);
    }
  };

  const handleCashOut = async () => {
    if (!canCashout || !activeBetId) return;
    const res = await cashOut(activeBetId);
    if (res.ok) {
      setHasPlaced(false);
      setCanCashout(false);
      setActiveBetId(null);
    }
  };

  const handleCancel = async () => {
    if (!activeBetId || !isBettingOpen) return;
    // stop autoplay if user cancels while autoplay is on
    if (isAutoplay) setIsAutoplay(false);
    const res = await cancelBet(activeBetId);
    if (res.ok) {
      setHasPlaced(false);
      setActiveBetId(null);
    } else if (res.message) {
      toast.error(res.message);
    }
  };

  // ------- AUTOPLAY TOGGLE (STOP label when active) -------
  const handleAutoplayToggle = () => {
    if (isAutoplay) {
      setIsAutoplay(false); // STOP
    } else {
      const betAmount = Number(value) || lastManualAmount || 20;
      if (balance < betAmount) {
        toast.error("Insufficient balance for autoplay");
        return;
      }
      setAutoplayAmount(betAmount);
      setIsAutoplay(true);
    }
  };

  // ------- AUTO CASHOUT (Filter button behavior & editor) -------
  // Main filter button:
  // - If no filter active -> label "FILTER" and opens editor
  // - If filter active -> label "DISABLE" and disables on click
  const handleFilterMainClick = () => {
    if (autoCashEnabled) {
      // disable directly
      setAutoCashEnabled(false);
      setEditingAutoCash(false);
    } else {
      setEditingAutoCash((v) => !v);
    }
  };

  // Normalize decimal input (allow "1.2", "1.50", etc.)
  const onAutoCashTargetInput = (val) => {
    // Keep digits and one dot
    const cleaned = val.replace(/[^\d.]/g, "").replace(/^(\d*\.\d*).*$/, "$1");
    setAutoCashTarget(cleaned);
  };

  const applyAutoCashTarget = () => {
    const num = Number(autoCashTarget);
    if (!isFinite(num) || num <= 1.01 || num > 40) {
      toast.error("Enter a target between 1.02 and 40");
      return;
    }
    // lock to two decimals for display
    setAutoCashTarget(num.toFixed(2));
    setAutoCashEnabled(true);
    setEditingAutoCash(false);
  };

  const profitLive = useMemo(() => {
    if (!activeBet) return 0;
    const gross = activeBet.amount * multiplier;
    const profit = Math.ceil(gross - activeBet.amount);
    return Math.max(0, profit);
  }, [activeBet, multiplier]);

  const placeDisabled =
    !isBettingOpen || !value || Number(value) > balance || Number(value) < MIN_BET;

  return (
    <div className={`bet-controls-container ${compact ? "bet-controls-compact" : ""}`}>
      <div className="bet-controls-main">
        <div className="bet-controls-chips-grid">
          {CHIP_AMOUNTS.map((amt) => {
            const chipDisabled = !isBettingOpen || balance < amt;
            return (
              <button
                key={amt}
                onClick={() => handleChipClick(amt)}
                disabled={chipDisabled}
                className={`bet-controls-chip-button ${
                  selectedChip === amt ? "selected" : ""
                } ${chipDisabled ? "disabled" : "bet-controls-chip-button-enabled"}`}
              >
                {amt}
              </button>
            );
          })}
        </div>

        <div className="bet-controls-action-container">
          {canCashout ? (
            <button onClick={handleCashOut} className="bet-controls-action-button bet-controls-cashout">
              CASHOUT
              <div className="bet-controls-profit-text">+{profitLive} PKR</div>
            </button>
          ) : hasPlaced && isBettingOpen ? (
            <button onClick={handleCancel} className="bet-controls-action-button bet-controls-cancel">
              CANCEL BET
            </button>
          ) : (
            <button
              onClick={handlePlace}
              disabled={placeDisabled}
              className={`bet-controls-action-button ${placeDisabled ? "disabled" : "bet-controls-place"}`}
            >
              PLACE BET
            </button>
          )}
        </div>
      </div>

      <div className="bet-controls-input-group">
        <div className="bet-controls-input-container">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            disabled={!isBettingOpen}
            className={`bet-controls-input ${!isBettingOpen ? "disabled" : "bet-controls-input-enabled"}`}
            placeholder="Enter bet amount"
          />
          {value && isBettingOpen && (
            <FaTimes
              className="bet-controls-clear-button"
              onClick={() => {
                setValue("");
                setSelectedChip(null);
              }}
              title="Clear"
            />
          )}
        </div>

        {/* AUTOPLAY (STOP label when active) */}
        <button
          onClick={handleAutoplayToggle}
          disabled={balance < (Number(value) || lastManualAmount || 20)}
          className={`bet-controls-autoplay ${isAutoplay ? "active" : ""} ${
            balance < (Number(value) || lastManualAmount || 20) ? "disabled" : "bet-controls-autoplay-enabled"
          }`}
        >
          {isAutoplay ? "STOP" : "AUTOPLAY"}
        </button>

        {/* FILTER / DISABLE (Auto Cashout) */}
        <button
          onClick={handleFilterMainClick}
          className={`bet-controls-autoplay bet-controls-autoplay-enabled`}
          title="Auto Cashout Filter"
        >
          <FaFilter style={{ marginRight: 6 }} />
          {autoCashEnabled ? "DISABLE" : "FILTER"}
        </button>
      </div>

      {/* Inline editor for Auto Cashout target (decimal allowed, show 'x' suffix) */}
      {editingAutoCash && !autoCashEnabled && (
        <div className="bet-controls-input-group" style={{ marginTop: 8 }}>
          <div className="bet-controls-input-container" style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              inputMode="decimal"
              value={autoCashTarget}
              onChange={(e) => onAutoCashTargetInput(e.target.value)}
              className="bet-controls-input bet-controls-input-enabled"
              placeholder="1.20"
              style={{ paddingRight: "2.2rem" }}
            />
            <span
              style={{
                position: "absolute",
                right: "0.6rem",
                color: "#9ca3af",
                fontWeight: 700,
              }}
            >
              x
            </span>
          </div>
          <button onClick={applyAutoCashTarget} className="bet-controls-autoplay bet-controls-autoplay-enabled">
            SET
          </button>
        </div>
      )}

      {/* Status row when enabled */}
      {autoCashEnabled && (
        <div className="bet-controls-profit-text" style={{ textAlign: "center", marginTop: 6 }}>
          Auto cashout at <strong>{Number(autoCashTarget).toFixed(2)}x</strong>
        </div>
      )}
    </div>
  );
};

export default BetControls;
