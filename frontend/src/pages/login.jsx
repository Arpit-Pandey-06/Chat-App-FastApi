import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useChatStore } from '../store/chatStrore';

const Login = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useChatStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    try {
      const data = await loginUser(username);
      setUser(username);
      navigate('/chat');
    } catch (err) {
      alert("Login Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f6f3',
      fontFamily: "'DM Sans', sans-serif",
      padding: '1.25rem 1rem',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:wght@500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .login-input { transition: border-color 0.2s, background 0.2s; }
        .login-input:focus { border-color: #1a1a1a !important; background: #fff !important; outline: none; }
        .login-btn { transition: background 0.2s; }
        .login-btn:hover:not(:disabled) { background: #333 !important; }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 420px) {
          .login-card { padding: 2rem 1.25rem !important; border-radius: 16px !important; }
          .login-title { font-size: 22px !important; }
          .login-sub { font-size: 13px !important; }
        }
      `}</style>

      <div
        className="login-card"
        style={{
          background: '#fff',
          border: '0.5px solid #e0ddd8',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          width: '100%',
          maxWidth: '380px',
        }}
      >
        {/* Logo mark */}
        <div style={{
          width: '38px',
          height: '38px',
          background: '#1a1a1a',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.75rem',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </div>

        <h1
          className="login-title"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '26px',
            fontWeight: '500',
            color: '#1a1a1a',
            margin: '0 0 0.35rem',
          }}
        >
          Welcome back
        </h1>
        <p
          className="login-sub"
          style={{
            fontSize: '13.5px',
            color: '#888',
            margin: '0 0 2rem',
            fontWeight: '300',
            lineHeight: '1.5',
          }}
        >
          Enter your username to join the conversation
        </p>

        <form onSubmit={handleLogin}>
          <label style={{
            display: 'block',
            fontSize: '11.5px',
            fontWeight: '500',
            color: '#555',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}>
            Username
          </label>
          <input
            className="login-input"
            type="text"
            placeholder="e.g. arpit_dev"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              border: '1px solid #e0ddd8',
              borderRadius: '10px',
              padding: '0.75rem 0.9rem',
              fontSize: '15px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#1a1a1a',
              background: '#fafaf8',
            }}
          />

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '1rem',
              background: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.85rem',
              fontSize: '15px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: '500',
              cursor: 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            {loading ? "Connecting..." : "Join Chat Room"}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '11px',
          color: '#c0bdb8',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          <span>FastAPI</span>
          <span style={{ width: '3px', height: '3px', background: '#d0cdc8', borderRadius: '50%', display: 'inline-block' }} />
          <span>Redis</span>
          <span style={{ width: '3px', height: '3px', background: '#d0cdc8', borderRadius: '50%', display: 'inline-block' }} />
          <span>WebSockets</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
