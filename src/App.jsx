import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Rigester.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/profile.jsx";
import "./App.css";
import TotalWins from "./components/TotalWins.jsx";
import Withdraws from "./components/Withdrawal.jsx";
import Purchasing from "./components/purchasing.jsx";
import WithdrawAccount from "./components/WithdrawalAccount.jsx";
import Settings from "./components/Settings.jsx";
import WheelGame from "./components/Wheelgame.jsx";
import Wheelgame from "./components/Wheelgame.jsx";
// import Diceface from "./components/Dice.jsx";
import DiceGame from "./components/DiceGame.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/total-wins"
          element={
            <ProtectedRoute>
              <TotalWins/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdraws"
          element={
            <ProtectedRoute>
              <Withdraws/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchasing"
          element={
            <ProtectedRoute>
              <Purchasing/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/account"
          element={
            <ProtectedRoute>
              <WithdrawAccount/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <WheelGame/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wheel"
          element={
            <ProtectedRoute>
              <Wheelgame/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Dice"
          element={
            <ProtectedRoute>
              <DiceGame/>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
