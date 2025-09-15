import { useState, useEffect, useRef } from "react";
import DiceScene from "./DiceScene";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { toast } from "react-toastify";
import "../Css/Dice.css";

const DiceGame = ({ userData }) => {
  const [dice, setDice] = useState([1, 1]);
  const [balance, setBalance] = useState(userData?.coins || 0);
  const [tempBalance, setTempBalance] = useState(userData?.coins || 0);
  const [betAmount, setBetAmount] = useState(0);
  const [selectedBet, setSelectedBet] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [scale, setScale] = useState(1);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const wrapperRef = useRef(null);
  const multipliers = { over: 2, equal: 10, under: 2 };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBalance(data.coins || 0);
          setTempBalance(data.coins || 0);
          setHistory(data.gameHistory || []);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, []);

  // Auto scale
  useEffect(() => {
    const handleResize = () => {
      if (!wrapperRef.current) return;
      const wrapperHeight = wrapperRef.current.offsetHeight;
      const maxHeight = window.innerHeight * 0.89;
      setScale(Math.min(1, maxHeight / wrapperHeight));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBetSelect = (type) => {
    setSelectedBet(type);
    setTempBalance(balance - betAmount);
  };

  // BET CONTROL LOGIC
  const handleMin = () => {
    const minBet = 20;
    setBetAmount(minBet);
    setTempBalance(balance - minBet);
  };
  const handleX2 = () => {
    const newBet = Math.min(betAmount * 2, balance);
    setBetAmount(newBet);
    setTempBalance(balance - newBet);
  };
  const handleHalf = () => {
    const newBet = Math.max(20, betAmount / 2);
    setBetAmount(newBet);
    setTempBalance(balance - newBet);
  };
  const handleMax = () => {
    const newBet = balance;
    setBetAmount(newBet);
    setTempBalance(balance - newBet);
  };

  const rollDice = async () => {
    if (!selectedBet) return toast.error("Select a bet first!");
    if (betAmount < 20) return toast.error("Minimum bet is 20 PKR!");
    if (betAmount > 2000) return toast.error("Maximum bet is 2000 PKR!");
    if (betAmount > balance) return toast.error("Insufficient balance!");

    // Dice outcome with 5% chance for 7
    let total;
    const equalChance = Math.random();
    if (equalChance < 0.05) {
      total = 7;
      setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
    } else {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      total = d1 + d2;
      setDice([d1, d2]);
    }

    setRolling(true);

    setTimeout(async () => {
      setRolling(false);

      let win = false;
      if (selectedBet === "over" && total > 7) win = true;
      if (selectedBet === "under" && total < 7) win = true;
      if (selectedBet === "equal" && total === 7) win = true;

      let profit = 0;
      if (win) {
        if (selectedBet === "equal") profit = betAmount * 9; // 10x total
        else profit = betAmount; // over/under 1x
      }

      const result = win ? "Win" : "Loss";
      const newBalance = win ? balance + profit : balance - betAmount;

      // ✅ Save history (frontend only, also pushing to backend if needed)
      const newHistory = [
        {
          id: Date.now(),
          bet: selectedBet,
          betAmount,
          dice: [dice[0], dice[1]],
          total,
          result,
          profit: win ? profit : -betAmount,
          finalBalance: newBalance,
        },
        ...history,
      ].slice(0, 10);
      setHistory(newHistory);

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
            betAmount,
            dice: [dice[0], dice[1]],
            result,
            amount: win ? profit : -betAmount,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setBalance(newBalance);
          setTempBalance(newBalance);
          toast[win ? "success" : "error"](
            `${win ? "🎉 Won" : "😢 Lost"} ${win ? profit : betAmount} PKR`
          );
        } else {
          toast.error(data.message || "Error updating game");
          setTempBalance(balance);
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error while updating game");
        setTempBalance(balance);
      }
    }, 1500);
  };

  return (
    <div className="min-h-[89vh] flex items-center justify-center bg-gradient-to-tr from-[#0c0f0f] via-[#0d1a16] to-[#0c0f0f] text-white py-6">
      <div
        ref={wrapperRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
        className="w-full max-w-sm rounded-[2rem] p-4 my-4 flex flex-col items-center border border-[#10b981] bg-[#1b3026] shadow-[0_0_45px_#10b98166] backdrop-blur-md"
      >
        {/* Dice */}
        <div className="flex gap-6 mb-6 border border-[#2d3e34] rounded-xl p-4 shadow-inner bg-[#192c23]">
          <DiceScene values={dice} rolling={rolling} />
        </div>

        {/* Bet options */}
        <div className="grid grid-cols-3 gap-3 mb-4 w-full">
          {["over", "equal", "under"].map((type) => (
            <button
              key={type}
              onClick={() => handleBetSelect(type)}
              className={`py-2 text-xs font-bold rounded-xl border-2 transition-all duration-200 border-[#facc15] tracking-wide shadow-md ${
                selectedBet === type
                  ? "bg-[#facc15] text-black shadow-[0_0_16px_#facc15cc] scale-105"
                  : "bg-transparent text-[#facc15] hover:bg-[#facc1533]"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} 7
              <br />
              <span
                className={selectedBet === type ? "text-black" : "text-white"}
              >
                × {multipliers[type]}
              </span>
            </button>
          ))}
        </div>

        {/* Bet controls */}
        <div className="flex justify-between w-full gap-2 text-xs font-semibold mb-4">
          {["min", "x2", "x/2", "max"].map((ctrl) => (
            <button
              key={ctrl}
              onClick={() => {
                if (ctrl === "min") handleMin();
                if (ctrl === "x2") handleX2();
                if (ctrl === "x/2") handleHalf();
                if (ctrl === "max") handleMax();
              }}
              className="flex-1 px-2 py-2 rounded-xl bg-[#111827] text-white font-bold tracking-wide hover:bg-[#10b98122]"
            >
              {ctrl.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="flex gap-7 w-full items-center mb-4">
          <div className=" w-1/2 mx-auto text-center bg-[#111827] border-2 border-[#10b981] rounded-xl py-1.5 text-white text-sm font-bold shadow-[0_0_10px_#10b98188]">
            {betAmount} PKR
          </div>
          <div className="balancefield">
            {tempBalance.toFixed(0)} <sub>PKR</sub>
          </div>
        </div>

        {/* Actions */}
        <div className="flex Actions">
              <button
            onClick={() => setShowHistory(true)}
            title="Game History"
            className="w-10 h-10 bg-[#1f2937] border border-[#facc15] text-white rounded-xl flex items-center justify-center hover:shadow-[0_0_14px_#facc15aa] transition-all"
          >
            <HiOutlineClipboardList size={20} />
          </button>
          <button
            onClick={rollDice}
            title="Roll Dice"
            className="w-12 h-12 bg-gradient-to-tr from-[#10b981] to-[#facc15] text-black rounded-full flex items-center justify-center text-2xl font-bold shadow-[0_0_40px_#10b981aa] hover:scale-110 transition-transform"
          >
            <FaPlay size={24} />
          </button>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="custom-vox2">
            <h2 className="text-xl font-bold mb-4 text-center text-[#facc15]">
              🎲 Game History
            </h2>
            {history.length === 0 ? (
              <p className="text-center text-gray-400">No games played yet.</p>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {history.map((h) => (
                  <li
                    key={h.id}
                    className="flex justify-between bg-[#192c23] p-2 rounded-lg text-sm"
                  >
                    <span className="capitalize">{h.bet}</span>
                    <span>Bet: {h.betAmount}</span>
                    <span>Total: {h.total}</span>
                    <span
                      className={
                        h.result === "Win" ? "text-green-400" : "text-red-400"
                      }
                    >
                      {h.result}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowHistory(false)}
              className="mt-4 w-full bg-[#10b981] py-2 rounded-lg font-bold text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceGame;
