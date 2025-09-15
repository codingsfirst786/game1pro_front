import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../Css/Home.css";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";

const games = [
  { id: 1, title: "Zoo Roullete", img: img1, path: "/roullete" },
  { id: 2, title: "Lucky Dice", img: img2, path: "/dice" },
  { id: 3, title: "Aviator Crash", img: img3, path: "/Aviator" },
  { id: 4, title: "Lucky Spin", img: img4, path: "/spinlucky" },
  { id: 5, title: "Battle Arena", path: "/battlearena" },
  { id: 6, title: "Treasure Hunt", path: "/treasurehunt" },
  { id: 7, title: "Dragon Quest", path: "/luckydice" },
  { id: 8, title: "Crypto Spin", path: "/cryptospin" },
  { id: 9, title: "Jackpot Frenzy", path: "/jackpotfrenzy" },
];

const Home = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch real win history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/game/winhistory");
        const data = await res.json();

        if (data.success) {
          // only keep latest 10
          setNotifications(data.history.slice(0, 10));
        }
      } catch (err) {
        console.error("Error fetching win history:", err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000); // refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  const handleGameClick = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <div className="main-content">
        {games.map((game, index) => (
          <div
            key={game.id}
            className={`game-card ${index < 4 ? "hover-card" : "coming-soon"}`}
            onClick={() => game.path && handleGameClick(game.path)}
            style={{ cursor: game.path ? "pointer" : "default" }}
          >
            {game.img && <img src={game.img} alt={game.title} />}
            <p>{game.title}</p>
          </div>
        ))}
      </div>

      <div className="sidebar">
        <h2>Lucky Winners</h2>
        <div className="notifications-container">
          {notifications.map((note) => (
            <div key={note.id} className="notification-box">
              {/* ✅ show shortened ID and amount */}
              {String(note.id).slice(0, 4)}...{String(note.id).slice(-4)}  won {note.amount}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
