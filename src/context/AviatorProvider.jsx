// frontend/context/AviatorProvider.js  (update the 'cashed' listener to use profit, not total payout)
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

export const AviatorContext = createContext();

export const useAviator = () => {
  const context = useContext(AviatorContext);
  if (!context) {
    throw new Error("useAviator must be used within an AviatorProvider");
  }
  return context;
};

export const AviatorProvider = ({ children }) => {
  const [phase, setPhase] = useState("WAITING");
  const [multiplier, setMultiplier] = useState(1.0);
  const [roundId, setRoundId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isRunning, setIsRunning] = useState(false);

  const [publicBets, setPublicBets] = useState([]);
  const [socket, setSocket] = useState(null);
  const [balance, setBalance] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  const [userBets, setUserBets] = useState([]);
  const lastRoundId = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBalance(Math.ceil(data.coins || 0));
        } else {
          setBalance(0);
        }
      } catch {
        setBalance(0);
      }
    })();
  }, []);

  useEffect(() => {
    const s = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 8,
      timeout: 15000,
      withCredentials: true,
    });
    setSocket(s);
    setConnectionStatus("Connecting...");

    s.on("connect", () => setConnectionStatus("Connected"));

    s.on("disconnect", () => {
      setConnectionStatus("Disconnected");
      setIsRunning(false);
      setPhase("WAITING");
    });

    s.on("gamePhase", (data) => {
      setPhase(data.phase);
      setIsRunning(data.phase === "RUNNING");
      setRoundId(data.roundId || null);
      setTimeLeft(Math.ceil((data.betWindowRemaining || 0) / 1000));
      setPublicBets(Array.isArray(data.currentRoundBets) ? data.currentRoundBets : []);

      if (lastRoundId.current && lastRoundId.current !== data.roundId) {
        setUserBets((prev) =>
          prev.map((b) =>
            b.roundId === lastRoundId.current && b.active && !b.cashedAt
              ? { ...b, active: false, crashed: true }
              : b
          )
        );
      }
      lastRoundId.current = data.roundId || null;
    });

    s.on("timerUpdate", (data) => setTimeLeft(data.timeLeft));
    s.on("multiplier", (data) => setMultiplier(data.multiplier));

    s.on("roundEnd", () => {
      setPhase("ENDED");
      setIsRunning(false);
      setPublicBets([]);
      setUserBets((prev) =>
        prev.map((bet) => (bet.active && !bet.cashedAt ? { ...bet, active: false, crashed: true } : bet))
      );
    });

    s.on("publicBetPlaced", ({ id, amount }) => setPublicBets((p) => [{ id, amount }, ...p]));
    s.on("publicCashed", ({ betId }) => setPublicBets((p) => p.filter((b) => b.id !== betId)));

    s.on("betPlacedPrivate", ({ newBalance }) => {
      if (newBalance !== undefined) setBalance(Math.ceil(newBalance));
    });

    // UPDATED: use profit (not total payout) in the toast; update bet with cashedAt
    s.on("cashed", (data) => {
      const profit = Math.ceil(data?.profit ?? 0);
      setBalance(Math.ceil(data.newBalance));
      setUserBets((prev) =>
        prev.map((bet) => (bet.id === data.betId ? { ...bet, cashedAt: data.cashedAt, active: false } : bet))
      );
      if (profit > 0) toast.success(`+${profit} PKR`);
    });

    s.on("betCanceled", (data) => {
      setBalance(Math.ceil(data.newBalance));
      setUserBets((prev) => prev.filter((bet) => bet.id !== data.betId));
    });

    return () => {
      s.close();
      setConnectionStatus("Disconnected");
    };
  }, []);

  const placeBet = (amount, side = "left") =>
    new Promise((resolve) => {
      if (!socket || !socket.connected) {
        return resolve({ ok: false, message: "Not connected to server" });
      }
      if (phase !== "BETTING") {
        return resolve({ ok: false, message: "Betting closed" });
      }
      if (amount > balance) {
        return resolve({ ok: false, message: "Insufficient balance" });
      }
      const token = localStorage.getItem("token");
      socket.emit("placeBet", { amount, token }, (response) => {
        if (response.ok) {
          const bet = {
            id: response.bet.id,
            amount: response.bet.amount,
            placedAt: Date.now(),
            cashedAt: null,
            active: true,
            crashed: false,
            side,
            roundId,
          };
          setUserBets((prev) => [bet, ...prev]);
        }
        resolve(response);
      });
    });

  const cashOut = (betId) =>
    new Promise((resolve) => {
      if (!socket || !socket.connected) {
        return resolve({ ok: false, message: "Not connected to server" });
      }
      if (phase !== "RUNNING") {
        return resolve({ ok: false, message: "Round not running" });
      }
      const token = localStorage.getItem("token");
      socket.emit("cashOut", { betId, token }, (response) => resolve(response));
    });

  const cancelBet = (betId) =>
    new Promise((resolve) => {
      if (!socket || !socket.connected) {
        return resolve({ ok: false, message: "Not connected to server" });
      }
      if (phase !== "BETTING") {
        return resolve({ ok: false, message: "Can only cancel during betting" });
      }
      const token = localStorage.getItem("token");
      socket.emit("cancelBet", { betId, token }, (response) => resolve(response));
    });

  const value = useMemo(
    () => ({
      phase,
      multiplier,
      roundId,
      timeLeft,
      isRunning,
      balance,
      connectionStatus,
      socket,
      publicBets,
      userBets,
      placeBet,
      cashOut,
      cancelBet,
      setBalance,
      setUserBets,
    }),
    [phase, multiplier, roundId, timeLeft, isRunning, balance, connectionStatus, socket, publicBets, userBets]
  );

  return <AviatorContext.Provider value={value}>{children}</AviatorContext.Provider>;
};

export default AviatorContext;
