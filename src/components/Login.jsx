import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginUserMutation } from "../Api/Slices/userApi";
import "../Css/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password }).unwrap();

      // ✅ If backend says blocked → logout immediately
      if (res.blocked || res.status === "block") {
        localStorage.clear();
        toast.error("Your account is blocked. Contact admin.");
        navigate("/login");
        return;
      }

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res));
      localStorage.setItem("userId", res._id);
      toast.success("Login successful!");
      navigate("/home");
    } catch (err) {
      // 🚫 Extra handling for 403 from backend
      if (err?.status === 403) {
        localStorage.clear();
        toast.error("Your account is blocked. Contact admin.");
        navigate("/login");
      } else {
        toast.error(err?.data?.message || "Login failed");
      }
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="login-text">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}
