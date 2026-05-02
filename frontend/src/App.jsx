import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Chat from './pages/chat';
import { useChatStore } from './store/chatStrore'

function App() {
  const user = useChatStore((state) => state.user);
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Protected Route: Redirect to Login if no user exists in state */}
        <Route 
          path="/chat" 
          element={user ? <Chat /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;