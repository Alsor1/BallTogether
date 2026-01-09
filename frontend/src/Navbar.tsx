/** Navbar.tsx
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user'); // Check if user email is stored

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear session
    navigate('/login');
  };

  return (
    <nav className="main-navbar">
      <div className="nav-left">
        <Link to="/" className="brand-logo">
          <span className="logo-icon">⚽</span> BallTogether
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/fields" className="nav-link">📍 Fields</Link>
        <Link to="/referees" className="nav-link">👥 Referees</Link>
        
        {/* Conditional Rendering based on Auth State */}
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={handleLogout} className="login-pill logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-pill">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;