import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">BallTogether 🏀</Link>
      <div className="navbar-right">
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;