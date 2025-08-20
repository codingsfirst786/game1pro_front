import React from "react";

export default function Login() {
  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Login</h2>
        <form>
          
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
         
          <button type="submit">Sign Up</button>
        </form>
        <p className="login-text">
          Dont have an account? <a href="/login">signup</a>
        </p>
      </div>
    </div>
  );
}
