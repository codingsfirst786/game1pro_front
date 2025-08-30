
// import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
// import '../Css/DiceGame.css';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Dice component
// const Diceface = forwardRef((props, ref) => {
//   const cubeRef = useRef(null);

//   useImperativeHandle(ref, () => ({
//     roll: (callback) => {
//       const num = Math.floor(Math.random() * 6) + 1;

//       const rotationMap = {
//         1: { x: 0, y: 0 },
//         2: { x: -90, y: 0 },
//         3: { x: 0, y: -90 },
//         4: { x: 0, y: 90 },
//         5: { x: 90, y: 0 },
//         6: { x: 180, y: 0 },
//       };

//       const spinsX = 360 * (Math.floor(Math.random() * 3) + 2) + rotationMap[num].x;
//       const spinsY = 360 * (Math.floor(Math.random() * 3) + 2) + rotationMap[num].y;

//       cubeRef.current.style.transition = 'transform 2s ease-in-out';
//       cubeRef.current.style.transform = `rotateX(${spinsX}deg) rotateY(${spinsY}deg)`;

//       // callback after dice animation
//       setTimeout(() => callback(num), 2000);
//     }
//   }));

//   return (
//     <div className="dice-wrapper">
//       <div className="dice-border">
//         <div className="dice-container">
//           <div ref={cubeRef} className="dice-cube">
//             <div className="dice-face dice-front"><span className="dot dot1" /></div>
//             <div className="dice-face dice-back"><span className="dot dot1" /><span className="dot dot2" /></div>
//             <div className="dice-face dice-right"><span className="dot dot1" /><span className="dot dot2" /><span className="dot dot3" /></div>
//             <div className="dice-face dice-left"><span className="dot dot1" /><span className="dot dot2" /><span className="dot dot3" /><span className="dot dot4" /></div>
//             <div className="dice-face dice-top"><span className="dot dot1" /><span className="dot dot2" /><span className="dot dot3" /><span className="dot dot4" /><span className="dot dot5" /></div>
//             <div className="dice-face dice-bottom"><span className="dot dot1" /><span className="dot dot2" /><span className="dot dot3" /><span className="dot dot4" /><span className="dot dot5" /><span className="dot dot6" /></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// // Main Dice Game
// const DiceGame = () => {
//   const dice1Ref = useRef(null);
//   const dice2Ref = useRef(null);

//   const [demoChips, setDemoChips] = useState(1000);
//   const [betAmount, setBetAmount] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const chipButtons = [20, 50, 100, 500];
//   const options = [
//     { label: 'Below 6', multiplier: 5 },
//     { label: 'Equal 7', multiplier: 100 },
//     { label: 'Greater 7', multiplier: 8 }
//   ];

//   const toggleOption = (label) => {
//     setSelectedOptions(prev =>
//       prev.includes(label) ? prev.filter(opt => opt !== label) : [...prev, label]
//     );
//   };

//   const handleSpin = () => {
//     if (betAmount <= 0 || betAmount > demoChips || selectedOptions.length === 0) {
//       toast.error('Select at least one option and a valid bet.');
//       return;
//     }

//     let diceResults = [null, null];

//     const tryCalculate = () => {
//       if (diceResults[0] !== null && diceResults[1] !== null) {
//         const total = diceResults[0] + diceResults[1];
//         let totalWin = 0;

//         selectedOptions.forEach(opt => {
//           const isWin =
//             (opt === 'Below 6' && total < 6) ||
//             (opt === 'Equal 7' && total === 7) ||
//             (opt === 'Greater 7' && total > 7);

//           const multiplier = options.find(o => o.label === opt).multiplier;

//           if (isWin) {
//             const win = betAmount * multiplier;
//             totalWin += win;
//             toast.success(`Option "${opt}" won! +${win} chips`);
//           } else {
//             totalWin -= betAmount;
//             toast.error(`Option "${opt}" lost! -${betAmount} chips`);
//           }
//         });

//         setDemoChips(prev => prev + totalWin);
//         setBetAmount(0);
//         setSelectedOptions([]);
//       }
//     };

//     dice1Ref.current.roll((num1) => {
//       diceResults[0] = num1;
//       tryCalculate();
//     });

//     dice2Ref.current.roll((num2) => {
//       diceResults[1] = num2;
//       tryCalculate();
//     });
//   };

//   return (
//     <div className="full-page-wrapper">
//       <ToastContainer position="top-center" autoClose={3000} />
//       <div className="game-wrapper">
//         <h1 className="title">Dice Betting Game</h1>
//         <div className="dice-row">
//           <Diceface ref={dice1Ref} />
//           <Diceface ref={dice2Ref} />
//         </div>

//         <div className="bet-options">
//           {options.map(opt => (
//             <button
//               key={opt.label}
//               className={`bet-btn ${selectedOptions.includes(opt.label) ? 'selected' : ''}`}
//               onClick={() => toggleOption(opt.label)}
//             >
//               {opt.label} x{opt.multiplier}
//             </button>
//           ))}
//         </div>

//         <div className="chip-row">
//           {chipButtons.map(chip => (
//             <button key={chip} className="chip-btn" onClick={() => setBetAmount(chip)}>{chip}</button>
//           ))}
//           <input
//             type="number"
//             min="1"
//             max={demoChips}
//             value={betAmount}
//             onChange={e => setBetAmount(Number(e.target.value))}
//             placeholder="Custom"
//           />
//         </div>

//         <button className="spin-btn" onClick={handleSpin}>Spin</button>
//         <div className="demo-chips">Demo Chips: {demoChips}</div>
//       </div>
//     </div>
//   );
// };

// export default DiceGame;
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import '../Css/DiceGame.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dice component
const Diceface = forwardRef((props, ref) => {
    const cubeRef = useRef(null);

    useImperativeHandle(ref, () => ({
        // roll() now returns a Promise
        roll: (finalNum) => {
            return new Promise(resolve => {
                const rotationMap = {
                    1: { x: 0, y: 0 },
                    2: { x: -90, y: 0 },
                    3: { x: 0, y: -90 },
                    4: { x: 0, y: 90 },
                    5: { x: 90, y: 0 },
                    6: { x: 180, y: 0 },
                };

                const spinsX = 360 * (Math.floor(Math.random() * 3) + 2) + rotationMap[finalNum].x;
                const spinsY = 360 * (Math.floor(Math.random() * 3) + 2) + rotationMap[finalNum].y;

                cubeRef.current.style.transition = 'transform 2s ease-in-out';
                cubeRef.current.style.transform = `rotateX(${spinsX}deg) rotateY(${spinsY}deg)`;

                // Resolve the promise after the animation ends
                setTimeout(() => resolve(finalNum), 2000);
            });
        }
    }));

    return (
        <div className="dice-wrapper">
            <div className="dice-border">
                <div className="dice-container">
                    <div ref={cubeRef} className="dice-cube">
                        <div className="dice-face dice-front"><span className="dot dot1" /></div>
                        <div className="dice-face dice-back"><span className="dot dot1" /><span className="dot dot2" /></div>
                        <div className="dice-face dice-right"><span className="dot dot1" /><span className="dot dot2" /><span className="dot dot3" /></div>
                        <div className="dice-face dice-left"><span className="dot dot1" /><span className="dot dot2" /><span className="dot dot3" /><span className="dot dot4" /></div>
                        <div className="dice-face dice-top"><span className="dot dot1" /><span className="dot dot2" /><span className="dot dot3" /><span className="dot dot4" /><span className="dot dot5" /></div>
                        <div className="dice-face dice-bottom"><span className="dot dot1" /><span className="dot dot2" /><span className="dot dot3" /><span className="dot dot4" /><span className="dot dot5" /><span className="dot dot6" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Main Dice Game
const DiceGame = () => {
    const dice1Ref = useRef(null);
    const dice2Ref = useRef(null);

    const [demoChips, setDemoChips] = useState(1000);
    const [betAmount, setBetAmount] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const chipButtons = [20, 50, 100, 500];
    const options = [
        { label: 'Below 6', multiplier: 5 },
        { label: 'Equal 7', multiplier: 100 },
        { label: 'Greater 7', multiplier: 8 }
    ];

    const toggleOption = (label) => {
        // Allow only one option to be selected at a time
        setSelectedOptions(prev => prev.includes(label) ? [] : [label]);
    };

    const handleSpin = () => {
        if (betAmount <= 0 || betAmount > demoChips || selectedOptions.length === 0) {
            toast.error('Select an option and a valid bet amount.');
            return;
        }

        // Generate the final dice values here, once.
        const dice1Value = Math.floor(Math.random() * 6) + 1;
        const dice2Value = Math.floor(Math.random() * 6) + 1;
        
        // Use Promise.all() to wait for both animations to complete
        Promise.all([
            dice1Ref.current.roll(dice1Value),
            dice2Ref.current.roll(dice2Value)
        ]).then(() => {
            // This code only runs AFTER both dice have finished their animations
            const total = dice1Value + dice2Value;
            const selectedOption = selectedOptions[0]; // Assuming only one option is selected
            let totalWin = 0;

            const isWin =
                (selectedOption === 'Below 6' && total < 6) ||
                (selectedOption === 'Equal 7' && total === 7) ||
                (selectedOption === 'Greater 7' && total > 7);

            const multiplier = options.find(o => o.label === selectedOption).multiplier;

            if (isWin) {
                const win = betAmount * multiplier;
                totalWin = win;
                toast.success(`You rolled ${total}! You won ${win} chips! 🎉`);
            } else {
                totalWin = -betAmount;
                toast.error(`You rolled ${total}. You lost ${betAmount} chips. 😥`);
            }

            setDemoChips(prev => prev + totalWin);
            setBetAmount(0);
            setSelectedOptions([]);
        });
    };

    return (
        <div className="full-page-wrapper">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="game-wrapper">
                <h1 className="title">Dice Betting Game</h1>
                <div className="dice-row">
                    <Diceface ref={dice1Ref} />
                    <Diceface ref={dice2Ref} />
                </div>

                <div className="bet-options">
                    {options.map(opt => (
                        <button
                            key={opt.label}
                            className={`bet-btn ${selectedOptions.includes(opt.label) ? 'selected' : ''}`}
                            onClick={() => toggleOption(opt.label)}
                        >
                            <p>{opt.label}</p>
                            <span>x{opt.multiplier}</span>
                        </button>
                    ))}
                </div>

                <div className="chip-row">
                    {chipButtons.map(chip => (
                        <button key={chip} className="chip-btn" onClick={() => setBetAmount(chip)}>{chip}</button>
                    ))}
                    <input
                        type="number"
                        min="1"
                        max={demoChips}
                        value={betAmount}
                        onChange={e => setBetAmount(Number(e.target.value))}
                        placeholder="Custom"
                    />
                </div>

                <button className="spin-btn" onClick={handleSpin}>Spin</button>
                <div className="demo-chips">Demo Chips: {demoChips}</div>
            </div>
        </div>
    );
};

export default DiceGame;