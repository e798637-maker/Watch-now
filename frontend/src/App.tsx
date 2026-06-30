import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSelect from './pages/ProfileSelect';
import Dashboard from './pages/Dashboard';
import WatchMovie from './pages/WatchMovie';
import AdminPanel from './pages/AdminPanel';
import ProfileSettings from './pages/ProfileSettings';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profiles" element={<ProtectedRoute><ProfileSelect /></ProtectedRoute>} />
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/watch/:id" element={<ProtectedRoute><WatchMovie /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
