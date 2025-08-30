import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <- Add this
import Navbar from "./Navbar";
import "../Css/Home.css";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";

const games = [
  { id: 1, title: "Lucky wheel", img: img1, path: "/wheel" },
  { id: 2, title: "Dragon Quest", img: img2, path: "/Dice" },
  { id: 3, title: "Galaxy Shooter", img: img3, path: "/galaxyshooter" },
  { id: 4, title: "Mystic Slots", path: "/mysticslots" },
  { id: 5, title: "Battle Arena", path: "/battlearena" },
  { id: 6, title: "Treasure Hunt", path: "/treasurehunt" },
  { id: 7, title: "Lucky Dice", path: "/luckydice" },
  { id: 8, title: "Crypto Spin", path: "/cryptospin" },
  { id: 9, title: "Jackpot Frenzy", path: "/jackpotfrenzy" },
];

const Home = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate(); // <- Initialize navigate

  const generateNotification = () => {
    const randomId = `${Math.floor(Math.random() * 9000) + 1000}**${
      Math.floor(Math.random() * 900) + 100
    }`;
    const randomAmount = Math.floor(Math.random() * 10000) + 100;
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    return {
      id: Date.now(),
      text: `ID: ${randomId} won ${randomAmount} Pkr (${formattedDate} ${formattedTime})`,
      fading: false,
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = generateNotification();
      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        if (updated.length > 8) {
          updated[updated.length - 1].fading = true;
        }
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications((prev) => prev.filter((n) => !n.fading));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const handleGameClick = (path) => {
    navigate(path); // Navigate to the game's path
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="main-content">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`game-card ${index < 3 ? "hover-card" : "coming-soon"}`}
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
              <div
                key={note.id}
                className={`notification-box ${note.fading ? "fade-out" : ""}`}
              >
                {note.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
