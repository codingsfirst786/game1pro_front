import { useState, useEffect, useRef } from "react";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { toast } from "react-toastify";
import IPL from "../assets/ipl.jpg";
import PSL from "../assets/Psl.png";
import "./Battle.css";

const BattleArenapage = ({ userData }) => {
  const [balance, setBalance] = useState(userData?.coins || 0);
  const [tempBalance, setTempBalance] = useState(userData?.coins || 0);
  const [bets, setBets] = useState({ ipl: 0, both: 0, psl: 0 });
  const [rolling, setRolling] = useState(false);
  const [scale, setScale] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);

  const [iplNumber, setIplNumber] = useState(null);
  const [pslNumber, setPslNumber] = useState(null);

  const wrapperRef = useRef(null);
  const multipliers = { ipl: 2, psl: 2, both: 10 };

  // Fetch user data from backend
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
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, []);

  // Auto scale wrapper
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

  const totalBetAmount = Object.values(bets).reduce((a, b) => a + b, 0);

  const handleBetSelect = (type) => {
    setSelectedBet(type);
  };

  const handleChip = (value) => {
    if (!selectedBet) {
      toast.error("Select a bet option first!");
      return;
    }

    const newTotal = totalBetAmount + value;
    if (balance < newTotal) {
      toast.error("Insufficient balance!");
      return;
    }

    setBets((prev) => ({
      ...prev,
      [selectedBet]: prev[selectedBet] + value,
    }));

    setTempBalance(balance - newTotal);
  };

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("battleHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const rollGame = async () => {
    if (totalBetAmount < 20) return toast.error("Minimum total bet is 20 PKR!");
    if (totalBetAmount > 2000)
      return toast.error("Maximum total bet is 2000 PKR!");
    if (totalBetAmount > balance) return toast.error("Insufficient balance!");

    setShowResult(false);
    setRolling(true);
    setIplNumber(null);
    setPslNumber(null);

    setTimeout(async () => {
      const newIpl = Math.floor(Math.random() * 10);
      const newPsl = Math.floor(Math.random() * 10);
      setIplNumber(newIpl);
      setPslNumber(newPsl);
      setShowResult(true);

      let winner = null;
      if (newIpl > newPsl) winner = "ipl";
      else if (newPsl > newIpl) winner = "psl";
      else winner = "draw";

      let roundProfit = 0;
      const roundResults = [];

      for (let betType of Object.keys(bets)) {
        const betAmount = bets[betType];
        if (betAmount <= 0) continue;

        let win = false;
        if (betType === "ipl" && winner === "ipl") win = true;
        if (betType === "psl" && winner === "psl") win = true;
        if (betType === "both" && winner === "draw") win = true;

        const profit = win
          ? betAmount * multipliers[betType] - betAmount
          : -betAmount;
        roundProfit += profit;

        roundResults.push({
          bet: betType,
          betAmount,
          result: win ? "Win" : "Loss",
          profit,
        });

        toast[win ? "success" : "error"](
          `${win ? "🎉 Congratulations!" : "😢 Better luck next time!"} 
You ${win ? "won" : "lost"} ${Math.abs(win ? profit : betAmount)} PKR 
on ${betType.toUpperCase()} 🏏 | Scores: IPL ${newIpl} - PSL ${newPsl}`
        );

        // Backend call remains (optional, you can remove this if not needed)
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:5000/api/game/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              bet: betType,
              betAmount,
              dice: [newIpl, newPsl],
              result: win ? "Win" : "Loss",
              amount: profit,
            }),
          });

          const data = await res.json();
          if (!res.ok) toast.error(data.message || "Error saving game result");
        } catch (err) {
          console.error(err);
          toast.error("Server error while updating game");
        }
      }

      const newBalance = balance + roundProfit;
      setBalance(newBalance);
      setTempBalance(newBalance);
      setBets({ ipl: 0, both: 0, psl: 0 });

      // Store history in localStorage
      const newHistoryItem = {
        id: Date.now(),
        ipl: newIpl,
        psl: newPsl,
        finalBalance: newBalance,
        results: roundResults,
      };
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("battleHistory", JSON.stringify(updatedHistory));

      setRolling(false);
    }, 5000);
  };

  return (
    <div className="min-h-[89vh] flex items-center justify-center bg-gradient-to-br from-[#0d0d0d] via-[#1a1a2e] to-[#0d0d0d] text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-red-500/30 blur-[180px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-blue-500/30 blur-[180px] rounded-full"></div>

      <div
        ref={wrapperRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
        className="w-full max-w-sm rounded-[2rem] p-6 my-4 flex flex-col items-center border border-[#ff4d4d] bg-[#101520] shadow-[0_0_45px_#ff4d4d88] backdrop-blur-md"
      >
        {/* Logos */}
        <div className="flex gap-8 mb-6 border border-[#2d2d3e] rounded-2xl p-4 shadow-inner bg-[#151827]">
          <div
            className={`animated-border ${rolling ? "glow" : ""}`}
            style={{ width: "90px", height: "90px" }}
          >
            <div className="animated-border-inner relative flex flex-col items-center justify-center">
              <img
                src={IPL}
                alt="IPL"
                className={`w-16 h-16 object-contain rounded-full transition-all duration-700 ${
                  showResult
                    ? "-translate-y-10 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              />
              {iplNumber !== null && showResult && (
                <span className="absolute text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_12px_#facc15] animate-pulse tracking-wide">
                  {iplNumber}
                </span>
              )}
            </div>
          </div>
          <div
            className={`animated-border ${rolling ? "glow" : ""}`}
            style={{ width: "90px", height: "90px" }}
          >
            <div className="animated-border-inner relative flex flex-col items-center justify-center">
              <img
                src={PSL}
                alt="PSL"
                className={`w-16 h-16 object-contain bg-white rounded-full transition-all duration-700 ${
                  showResult
                    ? "-translate-y-10 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              />
              {pslNumber !== null && showResult && (
                <span className="absolute text-4xl font-extrabold text-blue-400 drop-shadow-[0_0_12px_#3b82f6] animate-pulse tracking-wide">
                  {pslNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bet Options */}
        <div className="grid grid-cols-3 gap-4 mb-2 w-full">
          {[
            { type: "ipl", label: "IPL" },
            { type: "both", label: "Both (Draw)" },
            { type: "psl", label: "PSL" },
          ].map((btn) => (
            <button
              key={btn.type}
              onClick={() => handleBetSelect(btn.type)}
              className={`py-3 text-xs font-bold rounded-xl border-2 transition-all duration-300 tracking-wide shadow-md ${
                selectedBet === btn.type
                  ? "bg-gradient-to-tr from-yellow-400 to-red-500 text-black border-yellow-400 shadow-[0_0_25px_#facc15aa] scale-105"
                  : "bg-[#1f2937] text-gray-200 border-gray-500 hover:scale-105 hover:border-yellow-400"
              }`}
            >
              {btn.label}
              <br />
              <span
                className={
                  selectedBet === btn.type ? "text-black" : "text-yellow-300"
                }
              >
                × {multipliers[btn.type]}
              </span>
            </button>
          ))}
        </div>

        {/* Bet Amounts */}
        <div className="grid grid-cols-3 gap-4 mb-2 w-full text-[8px]">
          <div className="text-center bg-[#0f172a] border border-[#ff4d4d] rounded-lg py-2 text-red-400 font-bold">
            IPL: {bets.ipl}
          </div>
          <div className="text-center bg-[#0f172a] border border-[#ff4d4d] rounded-lg py-2 text-yellow-400 font-bold">
            BOTH (IPL & PSL): {bets.both}
          </div>
          <div className="text-center bg-[#0f172a] border border-[#3b82f6] rounded-lg py-2 text-blue-400 font-bold">
            PSL: {bets.psl}
          </div>
        </div>

        {/* Chips */}
        <div className="flex justify-between w-full gap-2 text-xs font-semibold mb-4">
          {[20, 50, 100, 500].map((chip) => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              className="flex-1 px-2 py-2 rounded-xl bg-[#1e293b] text-yellow-300 font-bold tracking-wide hover:bg-[#ff4d4d22] hover:scale-105 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Scoreboard */}
        <div className="flex gap-6 w-full items-center mb-6">
          <div className="w-1/2 mx-auto text-center bg-[#0f172a] border-2 border-[#ff4d4d] rounded-xl py-2 text-red-400 text-lg font-bold shadow-[0_0_10px_#ff4d4daa]">
            {totalBetAmount} PKR
          </div>
          <div className="w-1/2 mx-auto text-center bg-[#0f172a] border-2 border-[#3b82f6] rounded-xl py-2 text-blue-400 text-lg font-bold shadow-[0_0_10px_#3b82f688]">
            {tempBalance.toFixed(0)} PKR
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-6">
          <button
            onClick={() => setShowHistory(true)}
            title="Game History"
            className="w-12 h-12 bg-[#1e293b] border border-yellow-400 text-white rounded-xl flex items-center justify-center hover:shadow-[0_0_14px_#facc15aa] hover:scale-110 transition-all"
          >
            <HiOutlineClipboardList size={22} />
          </button>
          <button
            onClick={rollGame}
            title="Play"
            disabled={rolling}
            className="w-16 h-16 bg-gradient-to-tr from-red-500 to-yellow-400 text-black rounded-full flex items-center justify-center text-2xl font-bold shadow-[0_0_30px_#facc15aa] hover:scale-110 hover:rotate-6 transition-all duration-300"
          >
            <FaPlay size={28} />
          </button>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed top-16 inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="custom-vox3 bg-[#1e293b] border-2 border-yellow-400 p-6 rounded-2xl w-full max-w-md shadow-[0_0_35px_#facc15aa]">
            <h2 className="text-xl font-bold mb-4 text-center text-yellow-400">
              🏏 Battle History
            </h2>

            {!history || history.length === 0 ? (
              <p className="text-center text-gray-400">No games played yet.</p>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {history.map((h) => (
                  <li
                    key={h.id}
                    className="flex flex-col bg-[#0f172a] p-2 rounded-lg text-sm odd:bg-[#1e2535]"
                  >
                    {/* Top info row */}
                    <div className="flex justify-between text-gray-200 text-xs mb-1">
                      <span>IPL: {h.ipl}</span>
                      <span>PSL: {h.psl}</span>
                      <span className="font-semibold text-yellow-400">
                        Balance: {h.finalBalance}
                      </span>
                    </div>

                    {/* Individual bets results */}
                    {(h.results || []).map((r, i) => (
                      <div
                        key={i}
                        className="flex justify-between pl-2 text-xs font-semibold"
                      >
                        <span className="capitalize text-blue-300">
                          {r.bet}
                        </span>
                        <span
                          className={
                            r.result === "Win"
                              ? "text-green-400 drop-shadow-[0_0_6px_#22c55e]"
                              : "text-red-400 drop-shadow-[0_0_6px_#ef4444]"
                          }
                        >
                          {r.result}
                        </span>
                        <span
                          className={
                            r.profit > 0
                              ? "text-green-400"
                              : r.profit < 0
                              ? "text-red-400"
                              : "text-gray-400"
                          }
                        >
                          {r.profit}
                        </span>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowHistory(false)}
              className="mt-6 w-full bg-gradient-to-tr from-yellow-400 to-red-500 py-2 rounded-lg font-bold text-black hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleArenapage;
