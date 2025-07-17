import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/api/profile")
      .then(res => setUser(res.data))
      .catch(() => alert("Failed to load profile – please login"));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-card">
        <img
          src={user.avatar_url || "https://images.mubicdn.net/images/cast_member/2184/cache-2992-1547409411/image-w856.jpg"}
          alt="Avatar"
          className="profile-avatar"
        />
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Display Name:</strong> {user.display_name || "Not set"}</p>
        <p><strong>Joined:</strong> {new Date(user.joined_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
