import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/chatStrore";
import { connectWebSocket, sendMessage } from "../services/websocket";

export default function Chat() {
  const {
    user,
    setUser,
    onlineUsers,
    messages,
    selectedUser,
    setSelectedUser,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  // 🔌 Connect once
  useEffect(() => {
    if (user) {
      const sessionId = sessionStorage.getItem("sessionId")
      connectWebSocket(user,sessionId);
    }
  }, [user]);

  // 🔑 LOGIN
  if (!user) {
    return (
      <div style={styles.login}>
        <h2>Login</h2>
        <input
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Enter username"
        />
        <button onClick={() => setUser(usernameInput)}>Join</button>
      </div>
    );
  }

  // 📤 SEND MESSAGE
  const handleSend = () => {
    if (!input.trim()) return;

    if (selectedUser === null) {
      sendMessage({
        message: input,
      });
    } else {
      sendMessage({
        type: "private",
        to_user: selectedUser,
        message: input,
      });
    }

    setInput("");
  };

  // 📩 CURRENT MESSAGES
  const currentMessages =
    selectedUser === null
      ? messages.global
      : messages.private[selectedUser] || [];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3>Chats</h3>

        <div
          style={{
            ...styles.user,
            background: selectedUser === null ? "#ddd" : "",
          }}
          onClick={() => setSelectedUser(null)}
        >
          🌐 Global Chat
        </div>

        {onlineUsers.map((u) => (
          <div
            key={u}
            style={{
              ...styles.user,
              background: selectedUser === u ? "#ddd" : "",
            }}
            onClick={() => setSelectedUser(u)}
          >
            👤 {u}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={styles.chat}>
        <div style={styles.header}>
          {selectedUser === null
            ? "Global Chat"
            : `Chat with ${selectedUser}`}
        </div>

        <div style={styles.messages}>
          {currentMessages.map((msg, i) => (
            <div key={i} style={styles.msg}>
              {msg.type === "chat" && (
                <>
                  <b>{msg.user}: </b>
                  {msg.message}
                </>
              )}

              {msg.type === "private" && (
                <>
                  <b>{msg.from}: </b>
                  {msg.message}
                </>
              )}
            </div>
          ))}
        </div>

        <div style={styles.inputBox}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

// 🎨 SIMPLE UI
const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    width: "250px",
    borderRight: "1px solid #ccc",
    padding: "10px",
  },
  user: {
    padding: "8px",
    cursor: "pointer",
    borderRadius: "5px",
    marginBottom: "5px",
  },
  chat: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    fontWeight: "bold",
  },
  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
  },
  msg: {
    marginBottom: "10px",
  },
  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc",
  },
  login: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "100px",
  },
};