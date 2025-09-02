import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import "../Css/Login.css";
import {
  useLoginUserMutation,
  useGoogleLoginMutation,
} from "../Api/Slices/userApi";
import { useGoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ RTK Query mutations
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [googleLogin, { isLoading: googleLoading }] = useGoogleLoginMutation();

  // Normal login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password }).unwrap();
      if (res.success) {
        toast.success(res.message || "Login successful ✅");
        navigate("/home");
      } else {
        toast.error(res.message || "Login failed ❌");
      }
    } catch (err) {
      const msg = err?.data?.message || "Server error";
      toast.error(msg);
    }
  };

  // Google login handler
  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        const res = await googleLogin({ code: codeResponse.code }).unwrap();
        if (res.success) {
          toast.success(res.message || "Google login successful ✅");
          navigate("/home");
        } else {
          toast.error(res.message || "Google login failed ❌");
        }
      } catch (err) {
        const msg = err?.data?.message || "Google login error";
        toast.error(msg);
      }
    },
    onError: (err) => {
      console.error("❌ Google login failed:", err);
      toast.error("Google login failed ❌");
    },
  });

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

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          className="google-btn"
          onClick={() => handleGoogleLogin()}
          disabled={googleLoading}
        >
          <FcGoogle size={22} style={{ marginRight: "8px" }} />
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <p className="login-text">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}
