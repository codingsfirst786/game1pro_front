import React, { useRef, forwardRef, useImperativeHandle } from 'react';

const Diceface = forwardRef((props, ref) => {
  const cubeRef = useRef(null);

  useImperativeHandle(ref, () => ({
    roll: (callback) => {
      const cube = cubeRef.current;

      // Completely random X/Y rotations
      const spinsX = Math.floor(Math.random() * 360) + 720; // at least 2 spins
      const spinsY = Math.floor(Math.random() * 360) + 720;

      cube.style.transition = 'transform 2s ease-in-out';
      cube.style.transform = `rotateX(${spinsX}deg) rotateY(${spinsY}deg)`;

      setTimeout(() => {
        // Calculate top face based on X rotation (simple approximation)
        const xMod = spinsX % 360;
        let num;
        if ((xMod >= 0 && xMod < 60) || (xMod >= 300 && xMod < 360)) num = 1;
        else if (xMod >= 60 && xMod < 120) num = 5;
        else if (xMod >= 120 && xMod < 180) num = 6;
        else if (xMod >= 180 && xMod < 240) num = 2;
        else if (xMod >= 240 && xMod < 300) num = 4;

        callback(num);
      }, 2000);
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

export default Diceface;
