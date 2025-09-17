// LuckyWheel.jsx
import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import "./LuckyWheel.css";

const segmentsSpec = {
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

export default function LuckyWheel() {
  const toMult = (label) => parseInt(label.replace("x", ""), 10) || 0;
  const viewLabel = (s) => (s === "0x" ? "0x" : `x${toMult(s)}`);

  const segments = useMemo(() => {
    const saved = localStorage.getItem("wheelSegments");
    if (saved) return JSON.parse(saved);

    let segs = Object.entries(segmentsSpec).flatMap(([label, count]) =>
      Array(count).fill(label)
    );

    const shuffleNoAdjacent = (array) => {
      let result = [];
      let counts = {};

      array.forEach((val) => (counts[val] = (counts[val] || 0) + 1));

      while (result.length < array.length) {
        const candidates = Object.keys(counts).filter(
          (key) => counts[key] > 0 && key !== result[result.length - 1]
        );
        if (candidates.length === 0) {
          candidates.push(...Object.keys(counts).filter((k) => counts[k] > 0));
        }

        const choice =
          candidates[Math.floor(Math.random() * candidates.length)];
        result.push(choice);
        counts[choice]--;
      }

      return result;
    };

    const shuffled = shuffleNoAdjacent(segs);
    localStorage.setItem("wheelSegments", JSON.stringify(shuffled));

    return shuffled;
  }, []);

  const segCount = segments.length;
  const anglePerSeg = 360 / segCount;

  // state
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(0);
  const [selectedBet, setSelectedBet] = useState(null);
  const [selectedChip, setSelectedChip] = useState(null);
  const [winningIndex, setWinningIndex] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
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

  // spin
  const spinWheel = () => {
    if (spinning) return;
    if (!selectedChip || !selectedBet)
      return toast.error("Select a chip and multiplier first.");
    if (selectedChip < 1) return toast.error("Invalid chip amount.");
    if (balance < selectedChip) return toast.error("Insufficient balance.");

    toast(`🎲 Bet ${selectedChip} on ${selectedBet}`);

    setWinningIndex(null);
    setSpinning(true);

    const randomSpins = 5 + Math.floor(Math.random() * 5);
    const randomStop = Math.random() * 360;
    const finalRotation = rotation + randomSpins * 360 + randomStop;

    setRotation(finalRotation);

    const duration = 6000;
    setTimeout(async () => {
      const normalized = ((finalRotation % 360) + 360) % 360;
      const pointerAngle = 270; // 12 o’clock
      const relative = (pointerAngle - normalized + 360) % 360;
      const index = Math.floor(relative / anglePerSeg) % segCount;

      setWinningIndex(index);

      const winLabel = segments[index];
      const isWin = winLabel === selectedBet && winLabel !== "0x";
      const profit = isWin ? selectedChip * toMult(winLabel) : 0;
      const newBalance = isWin ? balance + profit : balance - selectedChip;

      toast[isWin ? "success" : "error"](
        isWin
          ? `🎉 Won ${profit} PKR`
          : `😢 Lost ${selectedChip} PKR — Winner: ${winLabel}`
      );

      setBalance(newBalance);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/game/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bet: selectedBet,
            betAmount: selectedChip,
            dice: [],
            result: isWin ? "Win" : "Loss",
            amount: isWin ? profit : -selectedChip,
          }),
        });

        let data = null;
        try {
          data = await res.json();
        } catch {
          // ignore
        }

        if (!res.ok) {
          toast.error(data?.message || `Server error (HTTP ${res.status})`);
          setBalance(balance);
        } else if (typeof data?.coins === "number") {
          setBalance(data.coins);
        }
      } catch (err) {
        console.error(err);
        toast.error("Network/server error updating game.");
        setBalance(balance);
      }

      setSpinning(false);
    }, duration);
  };

  const radius = 180;
  const center = 200;
  const createPath = (i) => {
    const startAngle = (i * anglePerSeg * Math.PI) / 180;
    const endAngle = ((i + 1) * anglePerSeg * Math.PI) / 180;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    return `M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;
  };

  return (
    <div className="game-layout">
      {/* Left Controls */}
      <div className="left-panel">
        <div className="card">
          <div className="title">Choose Multiplier</div>
          <div className="mults">
            {["2x", "3x", "4x", "5x", "7x", "10x", "15x", "20x", "25x"].map(
              (m) => (
                <button
                  key={m}
                  className={`pillBtn m-${m.replace("x", "")}${
                    selectedBet === m ? " active" : ""
                  }`}
                  onClick={() => setSelectedBet(m)}
                >
                  {viewLabel(m)}
                </button>
              )
            )}
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

      {/* Center Wheel*/}
      <div className="center-panel">
        <div className="wheel-container">
          {/* pointer */}
          <div className="pointer" />

          <div className="wheel-wrapper">
            <svg
              viewBox="0 0 400 400"
              className="wheel"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {/* outer rim */}
              <circle
                cx="200"
                cy="200"
                r="188"
                fill="none"
                className="outer-rim"
              />

              {/* bulbs */}
              {Array.from({ length: 60 }).map((_, i) => {
                const angle = (i * 360) / 60;
                const rad = (angle * Math.PI) / 180;
                const x = 200 + 188 * Math.cos(rad);
                const y = 200 + 188 * Math.sin(rad);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    className="bulb"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  />
                );
              })}

              {/* gradient defs */}
              <defs>
                <radialGradient id="goldRim" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff8d9" />
                  <stop offset="40%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#b8860b" />
                </radialGradient>
                <radialGradient id="gold">
                  <stop offset="0%" stopColor="#fff7b2" />
                  <stop offset="100%" stopColor="#d4af37" />
                </radialGradient>
                <linearGradient
                  id="shinyText"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="40%" stopColor="#ffe066" />
                  <stop offset="60%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#fff" />
                </linearGradient>
              </defs>

              {/* segments */}
              {segments.map((val, i) => {
                const colorMap = {
                  "2x": "#7f5af0", // bright violet crystal
                  "3x": "#ff6fd8", // pink sapphire
                  "4x": "#00d2ff", // cyan icy diamond
                  "5x": "#ff9f1c", // amber/orange crystal
                  "7x": "#b57edc", // soft yet gem-like
                  "10x": "#fcdc4d", // golden diamond
                  "15x": "#ff3f81", // neon pink crystal
                  "20x": "#1abc9c", // turquoise diamond
                  "25x": "#3498db", // deep icy blue
                  "0x": "#7f8c8d", // muted grey for zero
                };

                const fillColor = colorMap[val] || "#7f5af0";

                return (
                  <g
                    key={i}
                    className={
                      winningIndex === i ? "segment active" : "segment"
                    }
                  >
                    <path
                      d={createPath(i)}
                      fill={fillColor}
                      stroke="#f8f9fa"
                      strokeWidth="2"
                    />

                    <text
                      x={200}
                      y={200}
                      transform={`rotate(${
                        i * anglePerSeg + anglePerSeg / 2
                      } 200 200) translate(150 0)`}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize="16"
                      fill="#fff"
                      fontWeight="bold"
                      stroke="#000"
                      strokeWidth="2"
                      paintOrder="stroke"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* center hub */}
              <circle
                cx="200"
                cy="200"
                r="25"
                fill="url(#gold)"
                stroke="white"
              />
            </svg>
          </div>
        </div>

        <button
          onClick={spinWheel}
          disabled={spinning}
          className="spin-btn block lg:hidden"
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>
      </div>

      {/* Right Balance */}
      <div className="right-panel">
        <div className="balance-card">
          <label>Total Balance</label>
          <input
            type="text"
            value={balance?.toLocaleString() || "0"}
            readOnly
            className="balance-input"
          />
        </div>

        {/* spin button */}
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="spin-btn hidden lg:block"
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>
      </div>
    </div>
  );
}
