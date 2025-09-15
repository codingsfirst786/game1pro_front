import { useEffect, useRef } from "react";
import "../Css/Dice.css";

const Diceface = ({ id }) => {
  const cubeRef = useRef(null);
  const xRotation = useRef(0);
  const yRotation = useRef(0);

  useEffect(() => {
    const cube = cubeRef.current;

    function getRandom(max, min) {
      return (Math.floor(Math.random() * (max - min)) + min) * 90;
    }

    const roll = () => {
      xRotation.current += getRandom(24, 1);
      yRotation.current += getRandom(24, 1);
      cube.style.transform = `rotateX(${xRotation.current}deg) rotateY(${yRotation.current}deg)`;
    };

    cube.addEventListener("roll", roll);
    return () => cube.removeEventListener("roll", roll);
  }, []);

  return (
    <div className="dice3d-wrapper">
      <div className="outer-dice-border">
        <div className="dice3d-container">
          <div ref={cubeRef} id={id} className="dice3d-cube">
            {/* Face 1 */}
            <div className="dice3d-face dice3d-front">
              <span className="dice3d-dot dot1" />
            </div>

            {/* Face 2 */}
            <div className="dice3d-face dice3d-back">
              <span className="dice3d-dot dot1" />
              <span className="dice3d-dot dot2" />
            </div>

            {/* Face 3 */}
            <div className="dice3d-face dice3d-right">
              <span className="dice3d-dot dot1" />
              <span className="dice3d-dot dot2" />
              <span className="dice3d-dot dot3" />
            </div>

            {/* Face 4 */}
            <div className="dice3d-face dice3d-left">
              <span className="dice3d-dot dot1" />
              <span className="dice3d-dot dot2" />
              <span className="dice3d-dot dot3" />
              <span className="dice3d-dot dot4" />
            </div>

            {/* Face 5 */}
            <div className="dice3d-face dice3d-top">
              <span className="dice3d-dot dot1" />
              <span className="dice3d-dot dot2" />
              <span className="dice3d-dot dot3" />
              <span className="dice3d-dot dot4" />
              <span className="dice3d-dot dot5" />
            </div>

            {/* Face 6 */}
            <div className="dice3d-face dice3d-bottom">
              <span className="dice3d-dot dot1" />
              <span className="dice3d-dot dot2" />
              <span className="dice3d-dot dot3" />
              <span className="dice3d-dot dot4" />
              <span className="dice3d-dot dot5" />
              <span className="dice3d-dot dot6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diceface;