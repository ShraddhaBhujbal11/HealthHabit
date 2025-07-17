import React, { useState, useEffect } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
          reveals[i].classList.add("visible");
        }
      }
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  const handleRegister = async () => {
    try {
      const res = await axios.post("/api/register", { username: email, password });
      alert(res.data.message);
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="login-page gradient-bg">
      <div className="login-card glass reveal">
        <h2>Create Account</h2>

        <div className="input-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="btn" onClick={handleRegister}>
          Register
        </button>

        <div className="switch">
          Already registered? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
