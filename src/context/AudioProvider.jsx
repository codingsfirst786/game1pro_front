import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import gameSound from "../assets/gamesound.mp3";

// 🔊 Create Context
const AudioContext = createContext();

const AudioProvider = ({ children }) => {
  // ✅ Load saved state or defaults
  const [soundOn, setSoundOn] = useState(() => {
    return JSON.parse(localStorage.getItem("soundOn")) ?? true; // default ON
  });
  const [musicOn, setMusicOn] = useState(() => {
    return JSON.parse(localStorage.getItem("musicOn")) ?? false;
  });

  const audioRef = useRef(null);

  // ✅ Handle sound toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (soundOn) {
      audio.play().catch((err) => {
        console.warn("Autoplay blocked, waiting for user click:", err);
      });
    } else {
      audio.pause();
    }

    localStorage.setItem("soundOn", JSON.stringify(soundOn));
  }, [soundOn]);

  // ✅ Save music toggle separately
  useEffect(() => {
    localStorage.setItem("musicOn", JSON.stringify(musicOn));
  }, [musicOn]);

  // ✅ Try autoplay on site load (with fallback click listener)
  useEffect(() => {
    const tryPlay = () => {
      if (soundOn && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener("click", tryPlay); // run once
    };

    tryPlay(); // run immediately
    document.addEventListener("click", tryPlay);

    return () => document.removeEventListener("click", tryPlay);
  }, [soundOn]);

  return (
    <AudioContext.Provider value={{ soundOn, setSoundOn, musicOn, setMusicOn }}>
      {children}
      {/* 🔊 Global hidden audio player */}
      <audio ref={audioRef} src={gameSound} loop preload="auto" />
    </AudioContext.Provider>
  );
};

// ✅ Export default (so App.jsx import works)
export default AudioProvider;

// ✅ Hook for usage inside components (like Settings)
export const useAudio = () => useContext(AudioContext);
