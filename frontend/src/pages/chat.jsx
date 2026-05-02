import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/chatStrore";
import { useNavigate } from 'react-router-dom';
import { connectWebSocket, sendMessage } from "../services/websocket";

const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : "??";

const avatarColors = [
  { bg: '#e8e5ff', color: '#5340c0' },
  { bg: '#e8f5ee', color: '#1a7a45' },
  { bg: '#fce8e8', color: '#b03030' },
  { bg: '#fff3e0', color: '#b05e00' },
  { bg: '#e3f2fd', color: '#1565c0' },
];

const getAvatarStyle = (name) => {
  const idx = name ? name.charCodeAt(0) % avatarColors.length : 0;
  return avatarColors[idx];
};

export default function Chat() {
  const {
    user,
    setUser,
    onlineUsers,
    messages,
    selectedUser,
    setSelectedUser,
  } = useChatStore();

  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

useEffect(() => {
  const init = async () => {
    if (user) {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        connectWebSocket(user, data.sessionId);
      }
    } else {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.username);
        connectWebSocket(data.username, data.sessionId);
      } else {          // ← this was missing
        navigate('/login');
      }
    }
  };
  init();
}, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (selectedUser === null) {
      sendMessage({ type: "chat", message: input });
    } else {
      sendMessage({ type: "private", to_user: selectedUser, message: input });
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectChat = (u) => {
    setSelectedUser(u);
    setSidebarOpen(false);
  };

  const currentMessages = selectedUser === null
    ? messages.global
    : messages.private[selectedUser] || [];

  const chatTitle = selectedUser === null ? "Global Chat" : selectedUser;

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f6f3',
        fontFamily: "'DM Sans', sans-serif",
        padding: '1rem',
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');`}</style>
        <div style={{ background: '#fff', border: '0.5px solid #e0ddd8', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '300px' }}>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '0.75rem' }}>Enter username</p>
          <input
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="e.g. arpit_dev"
            style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e0ddd8', borderRadius: '8px', padding: '0.6rem 0.8rem', fontSize: '14px', marginBottom: '0.75rem' }}
          />
          <button
            onClick={() => setUser(usernameInput)}
            style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem', fontSize: '14px', cursor: 'pointer' }}
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100dvh',
      display: 'flex',
      background: '#f7f6f3',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .ch-user-row:hover { background: #fafaf8; }
        .ch-user-row.active { background: #f3f1ec; }
        .ch-send-btn:hover { background: #333 !important; }
        .ch-input:focus { border-color: #ccc !important; background: #fff !important; outline: none; }
        .ch-messages::-webkit-scrollbar { width: 4px; }
        .ch-messages::-webkit-scrollbar-track { background: transparent; }
        .ch-messages::-webkit-scrollbar-thumb { background: #e0ddd8; border-radius: 4px; }
        .ch-sidebar {
          width: 230px;
          min-width: 230px;
          background: #fff;
          border-right: 0.5px solid #e0ddd8;
          display: flex;
          flex-direction: column;
          height: 100%;
          flex-shrink: 0;
        }
        .ch-overlay { display: none; }
        .ch-hamburger { display: none !important; }
        @media (max-width: 640px) {
          .ch-sidebar {
            position: fixed;
            top: 0; left: 0;
            height: 100%;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            box-shadow: 4px 0 24px rgba(0,0,0,0.10);
            width: 80vw;
            min-width: unset;
          }
          .ch-sidebar.open { transform: translateX(0); }
          .ch-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.18);
            z-index: 99;
          }
          .ch-hamburger { display: flex !important; }
        }
      `}</style>

      {sidebarOpen && (
        <div className="ch-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`ch-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '1.1rem 1rem 0.75rem', borderBottom: '0.5px solid #f0ede8', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', fontWeight: '500', color: '#aaa', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            Chats
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.4rem 0' }}>
          <div
            className={`ch-user-row ${selectedUser === null ? 'active' : ''}`}
            onClick={() => handleSelectChat(null)}
            style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '0.55rem 1rem', cursor: 'pointer', transition: 'background 0.15s' }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#e8e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', flexShrink: 0,
            }}>🌐</div>
            <span style={{ fontSize: '13.5px', color: '#2a2a2a' }}>Global Chat</span>
          </div>

          {onlineUsers.filter(u => u !== user).length > 0 && (
            <>
              <div style={{ padding: '0.7rem 1rem 0.25rem' }}>
                <span style={{ fontSize: '11px', fontWeight: '500', color: '#aaa', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  Online
                </span>
              </div>
              {onlineUsers.filter(u => u !== user).map((u) => {
                const av = getAvatarStyle(u);
                return (
                  <div
                    key={u}
                    className={`ch-user-row ${selectedUser === u ? 'active' : ''}`}
                    onClick={() => handleSelectChat(u)}
                    style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '0.55rem 1rem', cursor: 'pointer', transition: 'background 0.15s' }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: av.bg, color: av.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: '500', flexShrink: 0,
                    }}>
                      {getInitials(u)}
                    </div>
                    <span style={{ fontSize: '13.5px', color: '#2a2a2a', flex: 1 }}>{u}</span>
                    <div style={{ width: '6px', height: '6px', background: '#34c96c', borderRadius: '50%', flexShrink: 0 }} />
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div style={{ padding: '0.85rem 1rem', borderTop: '0.5px solid #f0ede8', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: getAvatarStyle(user).bg, color: getAvatarStyle(user).color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: '500',
            }}>
              {getInitials(user)}
            </div>
            <span style={{ fontSize: '13px', color: '#555' }}>{user}</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
        {/* Topbar */}
        <div style={{
          padding: '0.85rem 1rem',
          borderBottom: '0.5px solid #e8e5e0',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
        }}>
          {/* Hamburger */}
          <button
            className="ch-hamburger"
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 6px 4px 0',
              flexDirection: 'column', gap: '4px', alignItems: 'center',
            }}
          >
            <div style={{ width: '18px', height: '1.5px', background: '#555' }} />
            <div style={{ width: '18px', height: '1.5px', background: '#555', marginTop: '4px' }} />
            <div style={{ width: '18px', height: '1.5px', background: '#555', marginTop: '4px' }} />
          </button>

          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: selectedUser ? getAvatarStyle(selectedUser).bg : '#e8e5ff',
            color: selectedUser ? getAvatarStyle(selectedUser).color : '#5340c0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: selectedUser ? '10px' : '14px', fontWeight: '500', flexShrink: 0,
          }}>
            {selectedUser ? getInitials(selectedUser) : '🌐'}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {chatTitle}
          </span>
          <span style={{ fontSize: '12px', color: '#aaa', flexShrink: 0 }}>
            {onlineUsers.length} online
          </span>
        </div>

        {/* Messages */}
        <div
          className="ch-messages"
          style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          {currentMessages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#ccc', fontSize: '13px', marginTop: '2rem' }}>
              No messages yet. Say hello!
            </div>
          )}
          {currentMessages.map((msg, i) => {
            if (msg.type === "system") {
              return (
                <div key={i} style={{
                  alignSelf: 'center',
                  fontSize: '11.5px',
                  color: '#bbb',
                  background: '#f0ede8',
                  padding: '3px 12px',
                  borderRadius: '20px',
                }}>
                  {msg.message}
                </div>
              );
            }
            const isMe = msg.user === user || msg.from === user;
            const senderName = msg.user || msg.from;
            return (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '78%',
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                alignItems: isMe ? 'flex-end' : 'flex-start',
              }}>
                {!isMe && selectedUser === null && (
                  <span style={{ fontSize: '11px', color: '#aaa', marginBottom: '3px', paddingLeft: '3px' }}>
                    {senderName}
                  </span>
                )}
                <div style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '14px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  background: isMe ? '#1a1a1a' : '#fff',
                  color: isMe ? '#fff' : '#1a1a1a',
                  border: isMe ? 'none' : '0.5px solid #e0ddd8',
                  borderBottomRightRadius: isMe ? '4px' : '14px',
                  borderBottomLeftRadius: isMe ? '14px' : '4px',
                  wordBreak: 'break-word',
                }}>
                  {msg.message}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '0.75rem 1rem',
          borderTop: '0.5px solid #e8e5e0',
          background: '#fff',
          display: 'flex',
          gap: '8px',
          flexShrink: 0,
        }}>
          <input
            className="ch-input"
            type="text"
            placeholder={selectedUser ? `Message ${selectedUser}...` : "Message everyone..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: '1px solid #e8e5e0',
              borderRadius: '10px',
              padding: '0.65rem 0.9rem',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#1a1a1a',
              background: '#fafaf8',
              transition: 'border-color 0.2s, background 0.2s',
              minWidth: 0,
            }}
          />
          <button
            className="ch-send-btn"
            onClick={handleSend}
            style={{
              background: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.65rem 1.1rem',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
