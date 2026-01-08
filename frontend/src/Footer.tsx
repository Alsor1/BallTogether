/** Footer.tsx
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-brand-section">
          <div className="brand-logo white">
             <span className="logo-icon">⚽</span> BallTogether
          </div>
          <p>Connecting players, fields, and referees for the perfect game experience.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="/fields">Find Fields</a>
            <a href="/dashboard">Book Now</a>
            <a href="/referees">Our Referees</a>
          </div>
          <div className="footer-col">
            <h4>Sports</h4>
            <a href="#">Soccer</a>
            <a href="#">Basketball</a>
            <a href="#">Tennis</a>
            <a href="#">Volleyball</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>hello@balltogether.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 BallTogether. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;