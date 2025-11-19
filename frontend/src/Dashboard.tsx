import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user') || 'Player';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-container">
      <h1>Welcome to the Court, {user}! 🏀</h1>
      <p>This is your player dashboard.</p>
      
      <button 
        onClick={handleLogout} 
        className="login-btn" 
        style={{ backgroundColor: '#dc3545', marginTop: '20px' }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;