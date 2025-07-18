import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatRoom from './pages/ChatRoom';
import NotFound from './pages/NotFound';
import { SocketProvider } from './context/SocketContext';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <SocketProvider user={user}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register onLogin={setUser} />} />
          <Route
            path="/chat"
            element={user ? <ChatRoom user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;
