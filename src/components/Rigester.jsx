import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Css/Register.css";
import { useRegisterMutation } from "../Api/Slices/userApi";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      setFormError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    setFormError("");

    try {
      const result = await registerUser({ email, username, password }).unwrap();

      if (result.auth) {
        localStorage.setItem("token", result.auth);
      }

      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register Now</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {formError && (
            <p style={{ color: "red", textAlign: "center" }}>{formError}</p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
