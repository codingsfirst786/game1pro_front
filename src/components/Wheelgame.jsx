// // import React, { useState } from "react";
// // import { FaArrowDown } from "react-icons/fa";
// // import "../Css/wheelgame.css";

// // const prizes = ["X0", "X2", "X4", "X5", "X8", "X10", "X20", "X25", "X50", "X100"];

// // const Wheelgame = () => {
// //   const [rotation, setRotation] = useState(0);
// //   const [spinning, setSpinning] = useState(false);

// //   const spinWheel = () => {
// //     if (spinning) return;
// //     setSpinning(true);

// //     const extraSpins = 5 * 360;
// //     const randomAngle = Math.floor(Math.random() * 360);
// //     const finalRotation = rotation + extraSpins + randomAngle;

// //     setRotation(finalRotation);

// //     setTimeout(() => setSpinning(false), 4000);
// //   };

// //   const sliceAngle = 360 / prizes.length;

// //   return (
// //     <div className="wheel-wrapper">
// //       <div className="arrow">
// //         <FaArrowDown size={40} />
// //       </div>

// //       <div className="wheel-container">
// //         <div
// //           className="wheel"
// //           style={{
// //             transform: `rotate(${rotation}deg)`,
// //             transition: spinning ? "transform 4s ease-out" : "none"
// //           }}
// //         >
// //           {prizes.map((prize, i) => (
// //             <div
// //               key={i}
// //               className="slice"
// //               style={{
// //                 transform: `rotate(${i * sliceAngle}deg)`,
// //               }}
// //             >
// //               <span style={{ transform: `rotate(${sliceAngle / 2}deg)` }}>{prize}</span>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <button className="spin-btn" onClick={spinWheel} disabled={spinning}>
// //         {spinning ? "Spinning..." : "SPIN"}
// //       </button>
// //     </div>
// //   );
// // };

// // export default Wheelgame;
// import React, { useState } from "react";
// import { FaArrowDown } from "react-icons/fa";
// import "../Css/wheelgame.css";

// const prizes = ["X0", "X2", "X4", "X5", "X8", "X10", "X20", "X25", "X50", "X100"];
// const chips = [20, 50, 100, 150, 200, 250, 300];

// const Wheelgame = () => {
//   const [rotation, setRotation] = useState(0);
//   const [spinning, setSpinning] = useState(false);
//   const [selectedMultiplier, setSelectedMultiplier] = useState(null);
//   const [selectedChip, setSelectedChip] = useState(null);
//   const [betAmount, setBetAmount] = useState("");

//   const spinWheel = () => {
//     if (spinning) return;
//     setSpinning(true);

//     const extraSpins = 5 * 360;
//     const randomAngle = Math.floor(Math.random() * 360);
//     const finalRotation = rotation + extraSpins + randomAngle;

//     setRotation(finalRotation);

//     setTimeout(() => setSpinning(false), 4000);
//   };

//   const sliceAngle = 360 / prizes.length;

//   return (
//     <div className="wheel-wrapper">
//       {/* Arrow */}
//       <div className="arrow">
//         <FaArrowDown size={40} />
//       </div>

//       {/* Wheel */}
//       <div className="wheel-container">
//         <div
//           className="wheel"
//           style={{
//             transform: `rotate(${rotation}deg)`,
//             transition: spinning ? "transform 4s ease-out" : "none"
//           }}
//         >
//           {prizes.map((prize, i) => (
//             <div key={i} className="slice" style={{ transform: `rotate(${i * sliceAngle}deg)` }}>
//               <span style={{ transform: `rotate(${sliceAngle / 2}deg)` }}>{prize}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Spin Button */}
//       <button className="spin-btn" onClick={spinWheel} disabled={spinning}>
//         {spinning ? "Spinning..." : "SPIN"}
//       </button>

//       {/* Multipliers Buttons */}
//       <div className="button-group">
//         {prizes.map((x, i) => (
//           <button
//             key={i}
//             className={`multiplier-btn ${selectedMultiplier === x ? "selected" : ""}`}
//             onClick={() => setSelectedMultiplier(x)}
//           >
//             {x}
//           </button>
//         ))}
//       </div>

//       {/* Chips Buttons */}
//       <div className="button-group">
//         {chips.map((chip, i) => (
//           <button
//             key={i}
//             className={`chip-btn ${selectedChip === chip ? "selected" : ""}`}
//             onClick={() => setSelectedChip(chip)}
//           >
//             {chip} Chips
//           </button>
//         ))}
//       </div>

//       {/* Manual Input */}
//       <div className="manual-input">
//         <input
//           type="number"
//           placeholder="Enter betting amount"
//           value={betAmount}
//           onChange={(e) => setBetAmount(e.target.value)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Wheelgame;
import React, { useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Css/wheelgame.css";

const prizes = ["X0", "X2", "X4", "X5", "X8", "X10", "X20", "X25", "X50", "X100"];
const chips = [20, 50, 100, 150, 200, 250, 300];

const Wheelgame = () => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedMultipliers, setSelectedMultipliers] = useState([]);
  const [selectedChip, setSelectedChip] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const [totalChips, setTotalChips] = useState(1000);

  const sliceAngle = 360 / prizes.length;

  const toggleMultiplier = (x) => {
    if (selectedMultipliers.includes(x)) {
      setSelectedMultipliers(selectedMultipliers.filter((m) => m !== x));
    } else {
      setSelectedMultipliers([...selectedMultipliers, x]);
    }
  };

  const spinWheel = () => {
    if (spinning) return;

    const amount = selectedChip || parseInt(betAmount);
    const totalBet = amount * selectedMultipliers.length;

    if (selectedMultipliers.length === 0 || !amount || amount <= 0) {
      toast.error("Please select at least one multiplier and enter a valid bet amount!");
      return;
    }

    if (totalBet > totalChips) {
      toast.error("You don't have enough chips for this bet!");
      return;
    }

    setSpinning(true);

    const totalRotation = rotation + 360 * 6 + Math.floor(Math.random() * 360);
    const duration = 9000;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setRotation(rotation + (totalRotation - rotation) * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const normalizedRotation = (totalRotation % 360 + 360) % 360;
        const pointerAngle = 360 - normalizedRotation;
        const landedIndex = Math.floor(pointerAngle / sliceAngle) % prizes.length;
        const landedPrize = prizes[landedIndex];

        let newTotal = totalChips;

        selectedMultipliers.forEach((mult) => {
          if (mult === landedPrize) {
            const wonAmount = amount * parseInt(mult.replace("X", ""));
            toast.success(`🎉 ${mult} hit! You earned ${wonAmount} chips`);
            newTotal += wonAmount;
          } else {
            toast.error(`❌ ${mult} lost! Lost ${amount} chips`);
            newTotal -= amount;
          }
        });

        setTotalChips(newTotal);
        setSpinning(false);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="page-container">
      <div className="wheel-wrapper">
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Heading */}
        <h2 className="wheel-heading">Spin the Wheel</h2>

        {/* Total Chips Display */}
        <div className="total-chips">💰 Total Chips: {totalChips}</div>

        {/* Arrow */}
        <div className="arrow">
          <FaArrowDown size={40} />
        </div>

        {/* Wheel */}
        <div className="wheel-container">
          <div
            className="wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)"
                : "none",
            }}
          >
            {prizes.map((prize, i) => (
              <div
                key={i}
                className="slice"
                style={{ transform: `rotate(${i * sliceAngle}deg)` }}
              >
                <span style={{ transform: `rotate(${sliceAngle / 2}deg)` }}>{prize}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spin Button */}
        <button className="spin-btn" onClick={spinWheel} disabled={spinning}>
          {spinning ? "Spinning..." : "SPIN"}
        </button>

        {/* Multipliers Buttons */}
        <div className="button-group">
          {prizes.map((x, i) => (
            <button
              key={i}
              className={`multiplier-btn ${
                selectedMultipliers.includes(x) ? "selected" : ""
              }`}
              onClick={() => toggleMultiplier(x)}
            >
              {x}
            </button>
          ))}
        </div>

        {/* Chips Buttons */}
        <div className="button-group">
          {chips.map((chip, i) => (
            <button
              key={i}
              className={`chip-btn ${selectedChip === chip ? "selected" : ""}`}
              onClick={() => {
                setSelectedChip(chip);
                setBetAmount(chip);
              }}
            >
              {chip} Chips
            </button>
          ))}
        </div>

        {/* Manual Input */}
        <div className="manual-input">
          <input
            type="number"
            placeholder="Enter betting amount"
            value={betAmount}
            onChange={(e) => {
              setBetAmount(e.target.value);
              setSelectedChip(null);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Wheelgame;
