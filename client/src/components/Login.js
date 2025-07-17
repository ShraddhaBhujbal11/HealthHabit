// import React, { useState } from "react";
// import axios from "../axios";
// import { useNavigate } from "react-router-dom";

// export default function Login({ setAuth }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post("/api/login", { username: email, password });

//       alert(res.data.message || "Login successful");
//       setAuth(true);                 // ✅ set login status
//       navigate("/dashboard");        // ✅ navigate after successful login
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <h2>Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button onClick={handleLogin}>Login</button>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "../axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // ✅ Make sure this matches your filename

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/login", {
        username: email,
        password,
      });

      alert(res.data.message || "Login successful");
      setAuth(true);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <div className="input-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn" onClick={handleLogin}>
          Login
        </button>

        <p className="switch">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
