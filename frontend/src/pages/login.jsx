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
    setLoading(true);
    
    try {
      // 1. Call your FastAPI Backend
      await loginUser(username);
      
      // 2. If successful, update global state
      setUser(username);
      
      // 3. Redirect to Chat
      navigate('/chat');
    } catch (err) {
      alert("Login Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Enter a username to join the real-time chat</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input 
              className="w-full p-4 rounded-xl bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. arpit_dev"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            {loading ? "Connecting..." : "Join Chat Room"}
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-500 mt-6 uppercase tracking-widest">
          FastAPI + Redis + WebSockets
        </p>
      </div>
    </div>
  );
};

export default Login;