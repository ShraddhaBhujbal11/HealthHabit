import React, { useState, useEffect } from "react";
import axios from "./axios";             // Your axios setup with `withCredentials = true`
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Contact from "./components/Contact";
import HealthInfo from "./components/HealthInfo";
import Logout from "./components/Logout";


// Route guard component


;

function RequireAuth({ isAuth, children }) {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      const timer = setTimeout(() => {
        setRedirect(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [isAuth]);

  if (!isAuth) {
    if (redirect) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div style={{
        padding: "2rem",
        textAlign: "center",
        color: "#cc0000",
        fontWeight: "bold",
        fontSize: "1.2rem"
      }}>
        Please log in to access this page.
        <br />
        Redirecting to login in 10 seconds...
      </div>
    );
  }

  return children;
}




export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined); // undefined = checking

  useEffect(() => {
    axios.get("/api/user")
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === undefined) {
    return <div>Loading...</div>; // or a spinner
  }

  return (
    <BrowserRouter>
      <NavBar isLoggedIn={isLoggedIn} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setAuth={setIsLoggedIn} />}
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth isAuth={isLoggedIn}>
              <Dashboard />
            </RequireAuth>
          }
        />

        <Route path="/contact" element={<Contact />} />
        <Route path="/health" element={<HealthInfo />} />
        <Route path="/logout" element={<Logout setAuth={setIsLoggedIn} />} />


        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
