import React, { useState } from "react";
import axios from "axios"; // we'll use your own backend to relay OpenAI calls

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! I'm your habit coach. Ask me anything about health habits!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { messages: newMessages });
      const reply = res.data.reply;

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      alert("Failed to contact AI assistant.");
    }

    setLoading(false);
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>{m.content}</div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about habits..."
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
