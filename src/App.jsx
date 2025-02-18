import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EmailAliasList from './components/EmailAliasList';
import { useAuth } from './context/AuthContext';
import './App.css'
import AccountInfo from './components/AccountInfo';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function MenuBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="top-nav">
      <div className="menu-container">
        <button 
          className="menu-button" 
          aria-label="Menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="hamburger-icon">☰</span>
        </button>
        {isMenuOpen && (
          <div className="menu-dropdown">
            <button onClick={handleLogout}>Log out</button>
            <button onClick={() => navigate('/account')}>Account info</button>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="app-container">
      <MenuBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/aliases" 
          element={
            <PrivateRoute>
              <EmailAliasList />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route 
          path="/account" 
          element={
            <PrivateRoute>
              <AccountInfo />
            </PrivateRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
