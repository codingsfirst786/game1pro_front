import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react"; // ✅ Import useEffect
import { toast } from "react-toastify"; // ✅ Import toast
import Login from "./components/Login.jsx";
import Register from "./components/Rigester.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/profile.jsx";
import Navbar from "./components/Navbar.jsx";
import TotalWins from "./components/TotalWins.jsx";
import Withdraws from "./components/Withdrawal.jsx";
// import Purchasing from "./components/purchasing.jsx";
import WithdrawAccount from "./components/WithdrawalAccount.jsx";
import Settings from "./components/Settings.jsx";
import DiceGame from "./LuckyDice/DiceGame.jsx";
import AgentsScreen from "./Agents/AgentsScreen.jsx";
import Order from "./components/Order.jsx";
import PaymentDetails from "./components/PaymentDetails.jsx";
import Cashout from "./components/Cashout.jsx";
import AddcoinsUser from "./components/AddcoinsUser.jsx";
import "./App.css";
import AviatorPage from "./Aviator/Aviator.jsx";
import AudioProvider from "./context/AudioProvider.jsx";
import Gamerules from "./components/Gamerules.jsx";
import Roullete from "./Roullete/Roullete.jsx";
import Luckyspin from "./LuckySpin/Luckyspin.jsx";
import BattleArenapage from "./BattleArena/BattleArenapage.jsx";
import Teenpatti from "./TeenPatti/Teenpatti.jsx";

// Layout component to include Navbar for protected routes
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const App = () => {
  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // ✅ Auto logout if blocked
        if (data.status === "block") {
          localStorage.clear();
          toast.error("You have been blocked. Logging out...");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Status check failed:", err);
      }
    };

    checkStatus();

    // ✅ Repeat check every 15s (real-time like effect)
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AudioProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game-rules"
            element={
              <ProtectedRoute>
                <Layout>
                  <Gamerules />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roullete"
            element={
              <ProtectedRoute>
                <Layout>
                  <Roullete />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/spinlucky"
            element={
              <ProtectedRoute>
                <Layout>
                  <Luckyspin />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agentscreen"
            element={
              <ProtectedRoute>
                <Layout>
                  <AgentsScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/total-wins"
            element={
              <ProtectedRoute>
                <Layout>
                  <TotalWins />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/addcoinsUser"
            element={
              <ProtectedRoute roles={["agent"]}>
                <Layout>
                  <AddcoinsUser />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdraws"
            element={
              <ProtectedRoute>
                <Layout>
                  <Withdraws />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["agent"]}>
                <Layout>
                  <Order />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashout"
            element={
              <ProtectedRoute>
                <Layout>
                  <Cashout />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-details"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaymentDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* <Route
          path="/purchasing"
          element={
            <ProtectedRoute>
              <Layout>
                <Purchasing />
              </Layout>
            </ProtectedRoute>
          }
        /> */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Layout>
                  <WithdrawAccount />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dice"
            element={
              <ProtectedRoute>
                <Layout>
                  <DiceGame />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Aviator"
            element={
              <ProtectedRoute>
                <Layout>
                  <AviatorPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cricketarena"
            element={
              <ProtectedRoute>
                <Layout>
                  <BattleArenapage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teenpatti"
            element={
              <ProtectedRoute>
                <Layout>
                  <Teenpatti />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown paths */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AudioProvider>
  );
};

export default App;
