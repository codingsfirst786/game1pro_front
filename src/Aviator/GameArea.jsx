// frontend/components/GameArea.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAviator } from "../context/useAviator";
import planefly from "../assets/plane.gif";

const GameArea = () => {
  const { multiplier, phase, timeLeft } = useAviator();

  const [progress, setProgress] = useState(0);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const el = document.getElementById("game-container");
      if (el) setContainerDimensions({ width: el.offsetWidth, height: el.offsetHeight });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (phase !== "RUNNING") {
      setProgress(0);
      return;
    }
    if (containerDimensions.width && containerDimensions.height) {
      const maxMultiplier = 40;
      const progressPercent = Math.min((multiplier / maxMultiplier) * 100, 100);
      setProgress(progressPercent);
    }
  }, [multiplier, phase, containerDimensions]);

  const progressRatio = progress / 100;
  const planeLeft = progressRatio * containerDimensions.width * 0.85;
  const planeBottom = progressRatio * containerDimensions.height * 0.75;
  const planeRotation = progressRatio * 25;

  const shadowLeft = planeLeft * 0.98;
  const shadowOpacity = Math.max(0.18, 0.55 - progressRatio * 0.35);
  const shadowScaleX = Math.max(0.6, 1 - progressRatio * 0.25);
  const shadowScaleY = Math.max(0.5, 0.9 - progressRatio * 0.35);

  return (
    <div id="game-container" className="game-area-container">
      {phase === "BETTING" && (
        <div className="game-timer-overlay">
          <div className="game-timer-content">
            <motion.div
              key={timeLeft}
              className="game-timer-text"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {timeLeft > 0 ? timeLeft : "0"}
            </motion.div>
          </div>
        </div>
      )}

      <div className="game-multiplier">{multiplier?.toFixed(2) || "1.00"}x</div>

      {/* Diagonal red fill: bottom-left -> top-right, height grows with progress */}
      {phase === "RUNNING" && (
        <motion.div
          className="game-progress-fill"
          style={{ height: `${progress}%` }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      )}

      {phase === "RUNNING" && (
        <motion.div
          className="game-plane-shadow"
          style={{
            left: shadowLeft,
            bottom: 4,
            opacity: shadowOpacity,
            transform: `scaleX(${shadowScaleX}) scaleY(${shadowScaleY})`,
            filter: "blur(2px)",
            borderRadius: "9999px",
            background: "rgba(0,0,0,0.35)",
            width: 110,
            height: 18,
          }}
          animate={{ left: shadowLeft, transition: { duration: 0.1, ease: "linear" } }}
        />
      )}

      {phase === "RUNNING" && (
        <motion.div
          className="game-plane"
          style={{ left: planeLeft, bottom: planeBottom, transform: `rotate(${planeRotation}deg)` }}
          animate={{ left: planeLeft, bottom: planeBottom, transition: { duration: 0.1, ease: "linear" } }}
        >
          <img src={planefly} alt="Flying plane" className="game-plane-img" />
        </motion.div>
      )}
    </div>
  );
};

export default GameArea;
