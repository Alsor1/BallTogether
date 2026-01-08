/** Navbar.tsx
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();

  // Helper function to check if a link is active for styling
  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <nav className="main-navbar">
      <div className="nav-left">
        <Link to="/" className="brand-logo">
          <span className="logo-icon">⚽</span> BallTogether
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
        
        {/* Redirection to Fields Page */}
        <Link to="/fields" className={`nav-link ${isActive('/fields')}`}>
          <span className="icon">📍</span> Fields
        </Link>
        
        {/* Redirection to Referees Page */}
        <Link to="/referees" className={`nav-link ${isActive('/referees')}`}>
          <span className="icon">👥</span> Referees
        </Link>
        
        {/* Dynamic Login Button */}
        <Link to="/login" className="login-pill">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;