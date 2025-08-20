import React from "react";
import "../Css/Register.css";

export default function Register() {
  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register Now</h2>
        <form>
          
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit">Sign Up</button>
        </form>
        <p className="login-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
