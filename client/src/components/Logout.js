import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

export default function Logout({ setAuth }) {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post("/api/logout"); // assumes this endpoint exists
        setAuth(false);
        navigate("/");
      } catch (err) {
        console.error("Logout failed", err);
        navigate("/");
      }
    };

    logout();
  }, [navigate, setAuth]);

  return <div>Logging out...</div>; // Optional loading message
}
