import { useState } from "react";

const Wheelgame = () => {
  const [userBalance, setUserBalance] = useState(5000);
  const [betAmount, setBetAmount] = useState("");

  const betOptions = [20, 100, 300, 800, 3000, 10000];

  // Add clicked bet value to existing input AND deduct from balance
  const handleBetClick = (amount) => {
    const currentBet = parseInt(betAmount) || 0;

    // Check if adding the clicked amount exceeds balance
    if (amount <= userBalance) {
      const totalBet = currentBet + amount;
      setBetAmount(totalBet.toString());
      setUserBalance(userBalance - amount);
    } else {
      alert("Not enough balance for this bet!");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Prevent typing more than available balance
      if (parseInt(value) > userBalance) {
        setBetAmount(userBalance.toString());
      } else {
        setBetAmount(value);
      }
    }
  };

  const placeBet = () => {
    const bet = parseInt(betAmount);
    if (!bet || bet <= 0) {
      alert("Enter a valid bet amount!");
      return;
    }
    if (bet > userBalance) {
      alert("Insufficient balance!");
      return;
    }
    setUserBalance(userBalance - bet);
    setBetAmount(""); // reset input after placing bet
    alert(`You placed a bet of ₹${bet}`);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-white font-sans">
      {/* Spin Wheel */}
      <div
        className="w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96 rounded-full mb-6 sm:mb-8 md:mb-10 flex items-center justify-center
                   bg-gradient-to-br from-green-700 via-green-800 to-green-900
                   border-4 border-green-500 shadow-lg"
      >
        <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-green-300 text-center px-2">
          🎡 Wheel Coming Soon 🎡
        </span>
      </div>

      {/* Bet Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        {betOptions.map((amount, idx) => (
          <button
            key={idx}
            onClick={() => handleBetClick(amount)}
            className="bg-green-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-5 rounded-xl shadow-md
                       border border-green-500 hover:scale-105 hover:shadow-lg transition-transform duration-200 text-sm sm:text-base md:text-lg"
          >
            ₹{amount}
          </button>
        ))}
      </div>

      {/* Bet Input + Place Bet */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <input
          type="text"
          value={betAmount}
          onChange={handleInputChange}
          placeholder="Enter your bet"
          className="w-full sm:w-44 md:w-52 lg:w-60 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-xl text-sm sm:text-base md:text-lg font-semibold text-center
                     bg-black border-2 border-green-500 text-white shadow-sm focus:outline-none"
        />
        <button
          onClick={placeBet}
          className="w-full sm:w-auto bg-green-600 text-white font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-xl shadow-md
                           border border-green-500 hover:scale-105 hover:shadow-lg transition-transform duration-200 text-sm sm:text-base md:text-lg"
        >
          Place a Bet
        </button>
      </div>

      {/* Account Balance */}
      <div
        className="bg-green-600 text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold
                      px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl shadow-md border border-green-500 text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
      >
        Balance: ₹{userBalance}
      </div>
    </div>
  );
};

export default Wheelgame;
