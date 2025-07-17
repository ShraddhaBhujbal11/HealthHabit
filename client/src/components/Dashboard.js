
import React, { useState, useEffect } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import "./Profile.css"; // reuse styling
//import Chatbot from "./Chatbot.js";



export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [date, setDate] = useState("");
  const [activity, setActivity] = useState("");
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [reminderTime, setReminderTime] = useState("");
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedAvatar, setEditedAvatar] = useState("");
  const [userMessage, setUserMessage] = useState("");
const [chatHistory, setChatHistory] = useState([]);

const sendMessage = async () => {
  if (!userMessage.trim()) return;

  const newChat = [...chatHistory, { role: "user", content: userMessage }];
  setChatHistory(newChat);
  setUserMessage("");

  try {
    const res = await axios.post("/api/chat", { message: userMessage });
    setChatHistory([...newChat, { role: "ai", content: res.data.reply }]);
  } catch {
    setChatHistory([
      ...newChat,
      { role: "ai", content: "❌ Failed to fetch response" },
    ]);
  }
};





  const fetchHabits = async () => {
    try {
      const res = await axios.get("/api/habits");
      setHabits(res.data);
    } catch {
      alert("Fetch failed – please log in");
    }
  };

 const saveHabit = async () => {
  if (!date || !activity || !value) return alert("Please fill all fields");

  try {
    if (editingId) {
      // Edit existing habit
      await axios.put(`/api/habits/${editingId}`, { date, activity, value });
      setEditingId(null); // clear edit mode
    } else {
      // Add new habit
      await axios.post("/api/habits", { date, activity, value, reminder_time : reminderTime });
    }

    setDate("");
    setActivity("");
    setValue("");
    setReminderTime("");
    fetchHabits();
  } catch (err) {
    alert("Error saving habit");
  }
};


const deleteHabit = async (id) => {
  if (!window.confirm("Are you sure you want to delete this habit?")) return;

  try {
    await axios.delete(`/api/habits/${id}`);
    fetchHabits();
  } catch (err) {
    alert("Error deleting habit");
  }
};

const handleEdit = (habit) => {
  setDate(habit.date);
  setActivity(habit.activity);
  setValue(habit.value);
  setEditingId(habit.id);
};


  useEffect(() => { fetchHabits();
      axios.get("/api/profile")
    .then(res => setProfile(res.data))
    .catch(() => console.log("Profile load failed"));


    if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
   }, []);

   useEffect(() => {
  const checkReminders = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM" format

    habits.forEach(h => {
      if (h.reminder_time === currentTime) {
        new Notification("⏰ HealthHabit Reminder", {
          body: `Time to log: ${h.activity}`
        });
      }
    });
  };

  const interval = setInterval(checkReminders, 60000); // Check every minute

  return () => clearInterval(interval);
}, [habits]);

useEffect(() => {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("🔔 Notification permission granted");
      } else {
        console.log("⚠️ Notification permission denied");
      }
    });
  }
}, []);

const fetchProfile = async () => {
  try {
    const res = await axios.get("/api/profile");
    setProfile(res.data);
    setEditedName(res.data.name || "");
    setEditedAvatar(res.data.avatar || "");
  } catch (err) {
    console.error("Error loading profile", err);
  }
};

const saveProfile = async () => {
  try {
    await axios.put("/api/profile", {
      name: editedName,
      avatar: editedAvatar,
    });

    setProfile(prev => ({
      ...prev,
      name: editedName,
      avatar: editedAvatar,
    }));

    setEditMode(false);
  } catch (err) {
    alert("Error updating profile");
  }
};


const toggleCompleted = async (id, status) => {
  try {
    await axios.put(`/api/habits/${id}/complete`, { completed: status });
    fetchHabits(); // Refresh after update
  } catch (err) {
    alert("Failed to update status");
  }
};


useEffect(() => {
  fetchProfile();
}, []);



  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>HealthHabit</h3>
     {profile && (
  <div className="profile-card">
    <img
      src={editMode ? editedAvatar : profile.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMgWB-OSrceVigaT_60yesFEXTDvD5_X1FlQ&s"}
      alt="avatar"
      className="avatar"
    />
    {editMode ? (
      <>
        <input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          placeholder="Name"
        />
        <input
          value={editedAvatar}
          onChange={(e) => setEditedAvatar(e.target.value)}
          placeholder="Avatar URL"
        />
        <button onClick={saveProfile}>💾 Save</button>
        <button onClick={() => setEditMode(false)}>❌ Cancel</button>
      </>
    ) : (
      <>
        <h3>{profile.name || profile.email}</h3>
        <p>{profile.email}</p>
        <button onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
      </>
    )}
  </div>
)}


        <ul>
          <li><a href="#overview"className="active">Overview</a></li>
          <li><Link to="/logout" className="logout-link">Logout</Link></li>
         
        </ul>
      </aside>

      <main className="main">
       <div className="chatbot-section">
  <h3>💬 AI Health Assistant</h3>
  <div className="chat-box">
    {chatHistory.map((msg, idx) => (
      <div key={idx} className={msg.role === "user" ? "user-msg" : "ai-msg"}>
        <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
      </div>
    ))}
  </div>
  <input
    type="text"
    placeholder="Ask something about health habits..."
    value={userMessage}
    onChange={(e) => setUserMessage(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  />
  <button onClick={sendMessage}>Send</button>
</div>

        <div className="habit-form">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input
            type="time"
            value={reminderTime}
            onChange={e => setReminderTime(e.target.value)}
            placeholder="Reminder Time"
          />

          <input placeholder="Activity" value={activity} onChange={e => setActivity(e.target.value)} />
          <input placeholder="Value" value={value} onChange={e => setValue(e.target.value)} />
          
          <ul className="habit-list">
            {habits.length > 0 && (
  <div className="progress-report">
    ✅ {habits.filter(h => h.completed).length} of {habits.length} habits completed
  </div>
)}

            <button onClick={saveHabit}>Save Habit</button>
            {habits.map(h => (
              <li key={h.id} className={h.completed ? "completed" : ""}>
                  <input
                    type="checkbox"
                    checked={h.completed}
                    onChange={() => toggleCompleted(h.id, !h.completed)}
                  />
                <span><strong>{h.activity}</strong> – {h.value}
                   {h.reminder_time && <> 🕒 {h.reminder_time}</>}</span>
                <span className="date">{h.date}</span>
                
                <button onClick={() => handleEdit(h)}>✏️</button>
                <button onClick={() => deleteHabit(h.id)}>🗑️</button>
              </li>
            ))}
          </ul>

          
        </div>

        <ul className="habit-list">
          {habits.map(h => (
            <li key={h.id}>
              <span><strong>{h.activity}</strong> – {h.value}</span>
              <span className="date">{h.date}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>

    
  );
}
