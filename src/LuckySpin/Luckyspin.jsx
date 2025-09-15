import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import "./LuckyWheel.css";

/* 24-slice distribution */
const SPEC = {
  "2x": 4,
  "3x": 4,
  "4x": 4,
  "5x": 3,
  "7x": 3,
  "10x": 2,
  "15x": 1,
  "20x": 1,
  "25x": 1,
  "0x": 1,
};

const toMult = (label) => parseInt(label.replace("x", ""), 10) || 0;
const viewLabel = (s) => (s === "0x" ? "0x" : `x${toMult(s)}`);

function buildPool() {
  const out = [];
  Object.entries(SPEC).forEach(([label, n]) => {
    for (let i = 0; i < n; i++) out.push(label);
  });
  return out;
}
function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
const buildSegments = () => shuffle(buildPool());

export default function LuckyWheel() {
  const SEGMENTS = useMemo(buildSegments, []);
  const sliceAngle = 360 / SEGMENTS.length; // 15°

  // ===== Balance & betting =====
  const [balance, setBalance] = useState(0); // real balance (server)
  const [selectedChip, setSelectedChip] = useState(null);
  const [selectedBet, setSelectedBet] = useState(null);

  // ===== Wheel state =====
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [winIndex, setWinIndex] = useState(null); // only this slice's arc turns green

  // ========== FETCH REAL BALANCE ON MOUNT ==========
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setBalance(Number(data?.coins || 0));
      } catch (e) {
        console.error(e);
        toast.error("Couldn't load balance");
      }
    })();
  }, []);

const spin = () => {
  if (spinning) return;
  if (!selectedChip || !selectedBet) return toast.error("Select a chip and multiplier first.");
  if (selectedChip < 1) return toast.error("Invalid chip amount.");
  if (balance < selectedChip) return toast.error("Insufficient balance.");

  toast(`🎲 Bet ${selectedChip} on ${viewLabel(selectedBet)}`);
  setSpinning(true);
  setWinIndex(null);

  const targetIndex = Math.floor(Math.random() * SEGMENTS.length);
  const fullSpins = 5;
  const finalRotation =
    360 * fullSpins + (360 - targetIndex * sliceAngle) - sliceAngle / 2;

  setRotation(finalRotation);

  const duration = 4400;
  setTimeout(async () => {
    const winLabel = SEGMENTS[targetIndex];
    setResult(winLabel);
    setHistory((h) => [winLabel, ...h].slice(0, 8));

    setWinIndex(targetIndex);
    setTimeout(() => setWinIndex(null), 3000);

    const isWin = winLabel === selectedBet && winLabel !== "0x";
    const profit = isWin ? selectedChip * toMult(winLabel) : 0;
    const newBalance = isWin ? balance + profit : balance - selectedChip;

    // show outcome
    toast[isWin ? "success" : "error"](
      isWin
        ? `🎉 Won ${profit} PKR`
        : `😢 Lost ${selectedChip} PKR — Winner: ${viewLabel(winLabel)}`
    );

    // optimistic UI
    setBalance(newBalance);

    // POST using EXACT dice payload shape
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/game/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bet: selectedBet,          // e.g. "2x"
          betAmount: selectedChip,   // stake
          dice: [],                  // <-- REQUIRED by your API (dice game sends an array)
          result: isWin ? "Win" : "Loss",
          amount: isWin ? profit : -selectedChip,
        }),
      });

      // Try to parse server message even on 400
      let data = null;
      try { data = await res.json(); } catch {}
      if (!res.ok) {
        toast.error(data?.message || `Server rejected (HTTP ${res.status}).`);
        // revert optimistic update
        setBalance(balance);
      } else {
        // if backend returns fresh coins, trust it
        if (typeof data?.coins === "number") setBalance(data.coins);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network/server error updating game.");
      setBalance(balance); // revert on error
    }

    setSpinning(false);
  }, duration);
};

  return (
    <div className="wheel-wrap">
      {/* Balance */}
      <div className="top">
        <div className="balance">
          <span>💰 Balance</span>
          <strong>{balance.toLocaleString()}</strong>
        </div>
      </div>

      {/* Wheel Stage */}
      <div className="stage" aria-label="Lucky Wheel">
        {/* continuous animated border */}
        <div className="halo outer" aria-hidden />
        <div className="halo inner" aria-hidden />
        <div className="bulbs" aria-hidden>
          {Array.from({ length: 36 }).map((_, i) => (
            <span
              key={i}
              style={{
                transform: `rotate(${(360 / 36) * i}deg) translateY(calc(var(--R) * -1))`,
              }}
            />
          ))}
        </div>

        {/* pointer */}
        <div className="pointer" aria-hidden />

        {/* disc */}
        <div
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 4.4s cubic-bezier(.17,.77,.18,1.02)"
              : "none",
          }}
        >
          {SEGMENTS.map((label, i) => (
            <div
              key={`${label}-${i}`}
              className="slice"
              style={{ transform: `rotate(${i * sliceAngle}deg)` }}
            >
              {/* ARC BAND (curved). Only this changes color on win */}
              <div
                className={`arc val-${toMult(label)}${
                  winIndex === i ? " won" : ""
                }`}
                style={{ transform: `rotate(${sliceAngle / 2}deg)` }}
              />
              {/* rim label */}
              <div
                className="lbl"
                style={{ transform: `rotate(${sliceAngle / 2}deg)` }}
              >
                {viewLabel(label)}
              </div>
              <div className="shine" />
            </div>
          ))}
        </div>

        <button className="hub" onClick={spin} disabled={spinning}>
          {spinning ? "..." : "SPIN"}
        </button>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="title">Choose Multiplier</div>
        <div className="mults">
          {["2x", "3x", "4x", "5x", "7x", "10x", "15x", "20x", "25x"].map((m) => (
            <button
              key={m}
              className={`pillBtn m-${m.replace("x", "")}${
                selectedBet === m ? " active" : ""
              }`}
              onClick={() => setSelectedBet(m)}
            >
              {viewLabel(m)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="title">Select Chip</div>
        <div className="chips">
          {[20, 100, 300, 800, 3000, 10000].map((v) => (
            <button
              key={v}
              className={`chip ${selectedChip === v ? "active" : ""}`}
              onClick={() => setSelectedChip(v)}
              aria-label={`Chip ${v}`}
            >
              <span className="rim" />
              <span className="dash" />
              <span className="core">{v}</span>
              <span className="sheen" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
