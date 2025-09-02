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
import Wheelgame from "./components/Wheelgame.jsx";
import DiceGame from "./components/DiceGame.jsx";
import AgentsScreen from "./Agents/AgentsScreen.jsx";
import Order from "./components/Order.jsx";
import PaymentDetails from "./components/PaymentDetails.jsx";
import Cashout from "./components/Cashout.jsx";
import Navbar from "./components/Navbar.jsx";
import AddcoinsUser from "./components/AddcoinsUser.jsx";

const App = () => {
  return (
    <Router>
    <Navbar/>
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
          path="/agentscreen"
          element={
            <ProtectedRoute>
              <AgentsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/total-wins"
          element={
            <ProtectedRoute>
              <TotalWins />
            </ProtectedRoute>
          }
        />
         <Route
          path="/addcoinsUser"
          element={
            <ProtectedRoute>
              <AddcoinsUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdraws"
          element={
            <ProtectedRoute>
              <Withdraws />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />
         <Route
          path="/cashout"
          element={
            <ProtectedRoute>
              <Cashout />
            </ProtectedRoute>
          }
        />
            <Route
          path="/payment-details"
          element={
            <ProtectedRoute>
              <PaymentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchasing"
          element={
            <ProtectedRoute>
              <Purchasing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <WithdrawAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wheel"
          element={
            <ProtectedRoute>
              <Wheelgame />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Dice"
          element={
            <ProtectedRoute>
              <DiceGame />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
