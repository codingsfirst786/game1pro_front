import React, { useEffect, useMemo, useState } from "react";
import "./Roullete.css";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

const PKR = (n) => `${Math.round(Number(n || 0)).toLocaleString("en-PK")} PKR`;
const CHIPS = [20, 50, 100, 500, 1000, 2000];

const COUPLES = [
  { key: "lion", emoji: "🦁", mult: 6 },
  { key: "rabbit", emoji: "🐰", mult: 6 },
  { key: "panda", emoji: "🐼", mult: 3 },
  { key: "monkey", emoji: "🐒", mult: 3 },
  { key: "sparrow", emoji: "🐦", mult: 5 },
  { key: "eagle", emoji: "🦅", mult: 5 },
  { key: "pigeon", emoji: "🕊️", mult: 2 },
  { key: "peacock", emoji: "🦚", mult: 2 },
];
const SINGLES = [
  { key: "snake", emoji: "🐍", mult: 0 },
  { key: "fish", emoji: "🐟", mult: 10 },
  { key: "female", emoji: "👩", mult: 20 },
  { key: "dragon", emoji: "🐉", mult: 10 },
];

function buildBoard() {
  const rows = [
    { couples: ["lion", "rabbit"], single: "snake" },
    { couples: ["panda", "monkey"], single: "fish" },
    { couples: ["sparrow", "eagle"], single: "female" },
    { couples: ["pigeon", "peacock"], single: "dragon" },
  ];
  const cMap = Object.fromEntries(COUPLES.map((c) => [c.key, c]));
  const sMap = Object.fromEntries(SINGLES.map((s) => [s.key, s]));
  const out = [];
  rows.forEach((row, ri) => {
    row.couples.forEach((k) => {
      for (let i = 0; i < 3; i++) {
        const c = cMap[k];
        out.push({ id: `${k}-${i + 1}-${ri}`, group: k, name: k, emoji: c.emoji, mult: c.mult, isSingle: false });
      }
    });
    const s = sMap[row.single];
    out.push({ id: `${s.key}-${ri}`, group: null, name: s.key, emoji: s.emoji, mult: s.mult, isSingle: true });
  });
  return out;
}

export default function Roullete() {
  const boxes = useMemo(buildBoard, []);
  const [socket, setSocket] = useState(null);

  // shared from server
  const [phase, setPhase] = useState("BETTING");
  const [timeLeft, setTimeLeft] = useState(15);
  const [globalBetsCount, setGlobalBetsCount] = useState(0);
  const [globalStake, setGlobalStake] = useState(0);
  const [roundPayout, setRoundPayout] = useState(0);
  const [perBoxTotals, setPerBoxTotals] = useState({});
  const [highlightIdx, setHighlightIdx] = useState(null);
  const [winnerIdx, setWinnerIdx] = useState(null);
  const [history, setHistory] = useState([]);

  // me
  const [balance, setBalance] = useState(0);
  const [selectedChip, setSelectedChip] = useState(CHIPS[0]); // keep last choice (start with smallest)

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const s = io(`${baseURL}/zoo`, { withCredentials: true });
    setSocket(s);

    s.on("zoo:phase", (snap) => {
      setPhase(snap.phase);
      setTimeLeft(Math.ceil((snap.timeLeft || 0) / 1000));
      setGlobalBetsCount(snap.totalBets || 0);
      setGlobalStake(snap.totalStake || 0);
      setRoundPayout(snap.roundPayout || 0);
      setPerBoxTotals(snap.perBoxTotals || {});
      setHistory(snap.history || []);
      setHighlightIdx(snap.highlightIdx ?? null);
      setWinnerIdx(snap.winnerIdx ?? null);
      // ⚠️ DO NOT clear selectedChip here (we want persistence across rounds)
    });

    s.on("zoo:timer", ({ timeLeft }) => setTimeLeft(timeLeft));
    s.on("zoo:highlight", ({ highlightIdx }) => setHighlightIdx(highlightIdx));
    s.on("zoo:stop", ({ winnerIdx }) => setWinnerIdx(winnerIdx));

    s.on("zoo:betPlacedPrivate", ({ newBalance }) =>
      setBalance(Math.round(newBalance || 0))
    );
    s.on("zoo:betCanceled", ({ newBalance }) =>
      setBalance(Math.round(newBalance || 0))
    );
    s.on("zoo:roundSettle", ({ winner, totalPayout, newBalance }) => {
      setBalance(Math.round(newBalance || 0));
      if ((totalPayout || 0) > 0)
        toast.success(`WIN: ${winner.name.toUpperCase()} • +${PKR(totalPayout)}`);
      else toast(`Result: ${winner.name.toUpperCase()}`);
    });

    // real balance on connect
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
    s.emit("zoo:getBalance", { token }, (resp) => {
      if (resp?.ok) setBalance(Math.round(resp.coins || 0));
    });

    return () => s.disconnect();
  }, []);

  // Disable betting when server says so (authoritative).
  // NOTE: we still lock at timeLeft<=0; as soon as the new round opens, phase=BETTING and timeLeft resets >0, so clicks re-enable.
  const chipsDisabled = phase !== "BETTING" || timeLeft <= 0;

  const placeBet = (box) => {
    if (!socket) return;
    if (chipsDisabled) return toast("Betting locked.");
    if (!selectedChip) return toast("Select a chip first.");
    if (balance < selectedChip) return toast.error("Insufficient balance.");

    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
    socket.emit("zoo:placeBet", { token, amount: selectedChip, boxId: box.id }, (resp) => {
      if (!resp?.ok) toast.error(resp?.message || "Bet failed");
      else toast.success(`Bet: ${PKR(selectedChip)} on ${box.name.toUpperCase()}`);
    });
  };

  const totalForBox = (boxId) => Math.round(perBoxTotals[boxId] || 0);

  return (
    <div className="zoo-game">
      {/* Header stats (global totals from server) */}
      <div className="header compact">
        <div className="stat"><div className="k">Your Balance</div><div className="v"><span className="emoji">💰</span>{PKR(balance)}</div></div>
        <div className="stat"><div className="k">All Bets (count)</div><div className="v"><span className="emoji">👥</span>{globalBetsCount}</div></div>
        <div className="stat"><div className="k">All Bets (amount)</div><div className="v"><span className="emoji">📊</span>{PKR(globalStake)}</div></div>
        <div className="stat"><div className="k">Round Winnings</div><div className="v"><span className="emoji">🏆</span>{PKR(roundPayout)}</div></div>
      </div>

      <div className="board-wrap tight">
        <div className={`rl-grid fixed7 ${chipsDisabled ? "locked" : ""}`}>
          {phase === "BETTING" && (
            <div className="grid-overlay" aria-hidden>
              <div className="grid-timer">{timeLeft}</div>
            </div>
          )}

          {boxes.map((box, i) => {
            const active = (phase === "SPINNING" || phase === "RESULT") && i === highlightIdx;
            const isWinner = phase === "RESULT" && i === winnerIdx;
            const total = totalForBox(box.id);
            return (
              <button
                key={box.id}
                className={[
                  "cell",
                  active ? "highlight" : "",
                  isWinner ? "winner" : "",
                  chipsDisabled ? "disabled" : "",
                ].join(" ")}
                onClick={() => placeBet(box)}
                disabled={chipsDisabled}
                title={`${box.name} • ${box.mult}x`}
              >
                <span className="emoji big">{box.emoji}</span>
                <span className="badge">{box.mult}x</span>
                {total > 0 && <span className="bet-badge total">{PKR(total)}</span>}
              </button>
            );
          })}
        </div>

      </div>

      {/* Chips: disabled by server timer AND by insufficient balance */}
      <div className={`chips compact ${chipsDisabled ? "disabled" : ""}`}>
        {CHIPS.map((c) => {
          const insufficient = c > balance;
          const isActive = selectedChip === c && !chipsDisabled && !insufficient;
          const disabled = chipsDisabled || insufficient;
          return (
            <button
              key={c}
              data-amt={c}
              className={`chip neo ${isActive ? "active" : ""} ${insufficient ? "insufficient" : ""}`}
              onClick={() => !disabled && setSelectedChip(c)}
              disabled={disabled}
              title={insufficient ? "Insufficient balance" : `Select ${c}`}
            >
              <div className="chip-face">
                <div className="chip-inner">
                  <span className="chip-text">{c}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
        <aside className="history tiny">
          <div className="history-title">Last 10</div>
          <div className="history-icons">
            {history.length === 0 ? <div className="history-empty">—</div> :
              history.map((h, idx) => (
                <div key={idx} className="history-dot" title={`${h.winner.name} • ${h.winner.mult}x`}>
                  <span className="emoji">{h.winner.emoji}</span>
                </div>
              ))}
          </div>
        </aside>
    </div>
  );
}
