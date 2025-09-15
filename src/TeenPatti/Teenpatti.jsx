import { useState, useEffect, useRef } from "react";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { toast } from "react-toastify";
import "./teenpatti.css";

const Teenpatti = ({ userData }) => {
  const [balance, setBalance] = useState(userData?.coins || 0);
  const [tempBalance, setTempBalance] = useState(userData?.coins || 0);
  const [bets, setBets] = useState({ red: 0, black: 0, tie: 0 });
  const [rolling, setRolling] = useState(false);
  const [scale, setScale] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);

  const [redCount, setRedCount] = useState(0);
  const [blackCount, setBlackCount] = useState(0);
  const [redCard, setRedCard] = useState(null);
  const [blackCard, setBlackCard] = useState(null);

  const wrapperRef = useRef(null);
  const multipliers = { red: 2, black: 2, tie: 10 };

  const redDeck = [
    "A♥",
    "2♥",
    "3♥",
    "4♥",
    "5♥",
    "6♥",
    "7♥",
    "8♥",
    "9♥",
    "10♥",
    "J♥",
    "Q♥",
    "K♥",
    "A♦",
    "2♦",
    "3♦",
    "4♦",
    "5♦",
    "6♦",
    "7♦",
    "8♦",
    "9♦",
    "10♦",
    "J♦",
    "Q♦",
    "K♦",
  ];
  const blackDeck = [
    "A♠",
    "2♠",
    "3♠",
    "4♠",
    "5♠",
    "6♠",
    "7♠",
    "8♠",
    "9♠",
    "10♠",
    "J♠",
    "Q♠",
    "K♠",
    "A♣",
    "2♣",
    "3♣",
    "4♣",
    "5♣",
    "6♣",
    "7♣",
    "8♣",
    "9♣",
    "10♣",
    "J♣",
    "Q♣",
    "K♣",
  ];

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
        toast.error("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, []);

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
  const handleBetSelect = (type) => setSelectedBet(type);

  const handleChip = (value) => {
    if (!selectedBet) return toast.error("Select a bet option first!");
    const newTotal = totalBetAmount + value;
    if (balance < newTotal) return toast.error("Insufficient balance!");
    setBets((prev) => ({ ...prev, [selectedBet]: prev[selectedBet] + value }));
    setTempBalance(balance - newTotal);
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("teenHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const getRandomCard = (deck) => deck[Math.floor(Math.random() * deck.length)];

  const rollGame = async () => {
    if (totalBetAmount < 20) return toast.error("Minimum total bet is 20 PKR!");
    if (totalBetAmount > 2000)
      return toast.error("Maximum total bet is 2000 PKR!");
    if (totalBetAmount > balance) return toast.error("Insufficient balance!");

    setShowResult(false);
    setRolling(true);
    setRedCount(0);
    setBlackCount(0);
    setRedCard(null);
    setBlackCard(null);

    setTimeout(async () => {
      let red = Math.floor(Math.random() * 6) + 1;
      let black = Math.floor(Math.random() * 6) + 1;
      while (red === black) {
        red = Math.floor(Math.random() * 6) + 1;
        black = Math.floor(Math.random() * 6) + 1;
      }

      setRedCount(red);
      setBlackCount(black);
      setRedCard(getRandomCard(redDeck));
      setBlackCard(getRandomCard(blackDeck));
      setShowResult(true);

      let winner = red > black ? "red" : black > red ? "black" : "tie";

      let roundProfit = 0;
      const roundResults = [];

      for (let betType of Object.keys(bets)) {
        const betAmount = bets[betType];
        if (betAmount <= 0) continue;
        const win = betType === winner;
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
          `${win ? "🎉 Won" : "😢 Lost"} ${Math.abs(
            profit
          )} PKR on ${betType.toUpperCase()} 🃏 | Count: Red ${red} - Black ${black}`
        );

        // Backend API call for storing game results
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
              dice: [red, black],
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
      setBets({ red: 0, black: 0, tie: 0 });

      // Store history in localStorage
      const newHistoryItem = {
        id: Date.now(),
        red,
        black,
        finalBalance: newBalance,
        results: roundResults,
      };
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("teenHistory", JSON.stringify(updatedHistory));

      setRolling(false);
    }, 5000);
  };

  // Helper for card color
  const isRedSuit = (card) => card?.includes("♥") || card?.includes("♦");

  return (
    <div className="min-h-[89vh] flex items-center justify-center bg-gradient-to-br from-[#0a0a1f] via-[#1b0b2f] to-[#0a0a1f] text-white relative overflow-hidden">
      {/* Neon glows */}
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-pink-600/30 blur-[180px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-blue-600/30 blur-[180px] rounded-full animate-pulse"></div>

      <div
        ref={wrapperRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
        className="w-full max-w-sm rounded-[2rem] p-6 my-4 flex flex-col items-center border border-pink-500 bg-[#10101f] shadow-[0_0_50px_#ff4d4d88] backdrop-blur-md"
      >
        {/* Card Display */}
        <div className="flex gap-6 mb-6">
          {[
            { card: redCard, count: redCount },
            { card: blackCard, count: blackCount },
          ].map((item, i) => {
            const isHigher =
              showResult &&
              ((i === 0 && redCount > blackCount) ||
                (i === 1 && blackCount > redCount));
            return (
              <div
                key={i}
                className={`w-20 h-28 rounded-lg border-2 flex flex-col justify-between p-2 relative transition-all duration-500 shadow-lg ${
                  item.card
                    ? isRedSuit(item.card)
                      ? "bg-gradient-to-br from-red-600 to-pink-500 text-white border-red-400"
                      : "bg-gradient-to-br from-gray-800 to-black text-white border-gray-600"
                    : "bg-gray-700 animate-pulse"
                } ${isHigher ? "scale-110 shadow-[0_0_20px_#facc1588]" : ""} ${
                  rolling ? "card-rolling card-glow" : ""
                }`}
              >
                {item.card ? (
                  <>
                    <div className="text-xs font-bold">
                      {item.card.slice(0, -1)}
                    </div>
                    <div className="text-2xl text-center">
                      {item.card.slice(-1)}
                    </div>
                    <div className="text-xs font-bold self-end rotate-180">
                      {item.card.slice(0, -1)}
                    </div>
                    <div className="absolute top-1 right-1 text-[10px] font-bold text-gray-800 bg-yellow-400 rounded px-1">
                      {item.count}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    ?
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bet Options */}
        <div className="grid grid-cols-3 gap-4 mb-2 w-full">
          {[
            { type: "red", label: "Red" },
            { type: "tie", label: "Tie" },
            { type: "black", label: "Black" },
          ].map((btn) => (
            <button
              key={btn.type}
              onClick={() => handleBetSelect(btn.type)}
              className={`py-3 text-xs font-bold rounded-xl border-2 transition-all duration-300 tracking-wide shadow-md ${
                selectedBet === btn.type
                  ? btn.type === "red"
                    ? "bg-gradient-to-tr from-yellow-400 to-red-600 text-black border-yellow-300 shadow-[0_0_25px_#facc15aa] scale-105"
                    : btn.type === "black"
                    ? "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white border-blue-400 shadow-[0_0_25px_#3b82f688] scale-105"
                    : "bg-gradient-to-tr from-yellow-300 to-orange-400 text-black border-yellow-200 shadow-[0_0_25px_#facc15aa] scale-105"
                  : "bg-[#1c1c2f] text-gray-200 border-gray-600 hover:scale-105 hover:border-yellow-400"
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
          <div className="text-center bg-gradient-to-br from-red-600 to-pink-500 border border-red-400 rounded-lg py-2 text-white font-bold">
            Red: {bets.red}
          </div>
          <div className="text-center bg-gradient-to-br from-yellow-400 to-orange-400 border border-yellow-400 rounded-lg py-2 text-black font-bold">
            Tie: {bets.tie}
          </div>
          <div className="text-center bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-400 rounded-lg py-2 text-white font-bold">
            Black: {bets.black}
          </div>
        </div>

        {/* Chips */}
        <div className="flex justify-between w-full gap-2 text-xs font-semibold mb-4">
          {[20, 50, 100, 500].map((chip) => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              className="flex-1 px-2 py-2 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-bold tracking-wide hover:scale-105 hover:shadow-[0_0_15px_#facc15aa] transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Scoreboard */}
        <div className="flex gap-6 w-full items-center mb-6">
          <div className="w-1/2 mx-auto text-center bg-gradient-to-tr from-red-600 to-pink-500 border-2 border-yellow-400 rounded-xl py-2 text-white text-lg font-bold shadow-[0_0_15px_#facc15aa]">
            {totalBetAmount} PKR
          </div>
          <div className="w-1/2 mx-auto text-center bg-gradient-to-tr from-blue-600 to-indigo-700 border-2 border-blue-400 rounded-xl py-2 text-white text-lg font-bold shadow-[0_0_15px_#3b82f688]">
            {tempBalance.toFixed(0)} PKR
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-6">
          <button
            onClick={() => setShowHistory(true)}
            title="Game History"
            className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-orange-500 text-black rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all"
          >
            <HiOutlineClipboardList size={22} />
          </button>
          <button
            onClick={rollGame}
            title="Play"
            disabled={rolling}
            className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-[0_0_35px_#facc15aa] hover:scale-110 hover:rotate-6 transition-all duration-300"
          >
            <FaPlay size={28} />
          </button>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed top-16 inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="custom-vox4 bg-[#1e293b] border-2 border-yellow-400 p-6 rounded-2xl w-full max-w-md shadow-[0_0_35px_#facc15aa]">
            <h2 className="text-xl font-bold mb-4 text-center text-yellow-400">
              🃏 Teen Patti History
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
                    <div className="flex justify-between text-gray-200 text-xs mb-1">
                      <span>Red: {h.red}</span>
                      <span>Black: {h.black}</span>
                      <span className="font-semibold text-yellow-400">
                        Balance: {h.finalBalance}
                      </span>
                    </div>
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

export default Teenpatti;
