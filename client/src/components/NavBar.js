import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo">HealthHabit</div>
      <ul className="menu">
        <li><NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink></li>
        <li><NavLink to="/register" className={({isActive}) => isActive ? "active" : ""}>Register</NavLink></li>
        <li><NavLink to="/login" className={({isActive}) => isActive ? "active" : ""}>Login</NavLink></li>
        <li><NavLink to="/dashboard" className={({isActive}) => isActive ? "active" : ""}>Dashboard</NavLink></li>
        <li><NavLink to="/contact" className={({isActive}) => isActive ? "active" : ""}>Contact</NavLink></li>
        <li><NavLink to="/health" className={({isActive}) => isActive ? "active" : ""}>Health Info</NavLink></li>
      </ul>
    </nav>
  );
}
