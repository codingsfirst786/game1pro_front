import React from "react";

export default function Gamerules() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8">
      <div className="max-w-4xl mx-auto bg-white text-gray-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">
          🎮 Game Rules
        </h1>
        <p className="mb-6 text-lg text-gray-700 text-center">
          Follow these steps carefully to enjoy the game and withdraw your winnings safely.
        </p>

        <ol className="space-y-6 list-decimal list-inside text-gray-800 text-lg">
          <li>
            <span className="font-semibold text-indigo-600">Purchase Coins:</span> First, purchase coins from any authorized agent to participate in the game.
          </li>
          <li>
            <span className="font-semibold text-indigo-600">Play & Win:</span> Use the purchased coins to play games. The more you play, the higher your chances to win.
          </li>
          <li>
            <span className="font-semibold text-indigo-600">Add Bank Details:</span> After winning, add your bank account details in your profile to withdraw your earnings securely.
          </li>
          <li>
            <span className="font-semibold text-indigo-600">Withdraw & Receive Payment:</span> Once your bank details are verified, withdraw your balance and receive payment successfully.
          </li>
        </ol>

        <div className="mt-10 text-center">
          <p className="text-gray-700 text-lg">
            💡 Note: Always ensure your bank details are correct. Playing responsibly increases your chances of winning.
          </p>
        </div>
      </div>
    </div>
  );
}
