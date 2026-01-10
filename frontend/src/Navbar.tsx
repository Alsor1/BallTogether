/** Clasa pentru Navbar
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  
  let user = null;
  let isAdmin = false;
  let isLoggedIn = false;
  
  if (userStr) {
    try {
      const parsed = JSON.parse(userStr);
      if (parsed && typeof parsed === 'object' && (parsed.id || parsed.email)) {
        user = parsed;
        isAdmin = user.role === 'Admin';
        isLoggedIn = true;
      }
    } catch {
      if (localStorage.getItem('userId')) {
        isLoggedIn = true;
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
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
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link admin-link">⚙️ Admin</Link>
            )}
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