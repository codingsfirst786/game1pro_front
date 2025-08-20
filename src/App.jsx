import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx"
import Register from "./components/Rigester.jsx";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Register />} />

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
