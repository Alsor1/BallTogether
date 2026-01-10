/** Clasa pentru LandingPage
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero Section - As seen in image_81e4ab.jpg */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Play Together, <span className="highlight">Pay Together</span></h1>
          <p>Find sports fields, invite your team, and split the cost effortlessly. Add a referee for the perfect game experience.</p>
          <div className="hero-btns">
            <button 
              className="btn-primary" 
              onClick={() => navigate('/fields')}
            >
              Find a Field →
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar - As seen in image_81e4cc.png */}
      <section className="stats-bar">
        <div className="stat-item">
            <span className="stat-icon">📍</span>
            <div><strong>50+</strong><p>Sports Fields</p></div>
        </div>
        <div className="stat-item">
            <span className="stat-icon">👥</span>
            <div><strong>1,000+</strong><p>Active Players</p></div>
        </div>
        <div className="stat-item">
            <span className="stat-icon">🛡️</span>
            <div><strong>25+</strong><p>Certified Referees</p></div>
        </div>
      </section>

      {/* How It Works - As seen in image_81e4cc.png */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p className="subtitle">Getting your team on the field has never been easier. Follow these simple steps.</p>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">📍</div>
            <div className="step-number">1</div>
            <h3>Find a Field</h3>
            <p>Browse available sports fields near you on our interactive map</p>
          </div>
          <div className="step">
            <div className="step-icon">📅</div>
            <div className="step-number">2</div>
            <h3>Pick a Time</h3>
            <p>Choose your preferred date and time slot for your game</p>
          </div>
          <div className="step">
            <div className="step-icon">👥</div>
            <div className="step-number">3</div>
            <h3>Invite Friends</h3>
            <p>Send invites to your teammates and split the cost equally</p>
          </div>
          <div className="step">
            <div className="step-icon">💳</div>
            <div className="step-number">4</div>
            <h3>Split & Pay</h3>
            <p>Everyone pays their share securely through the app</p>
          </div>
        </div>
      </section>

      {/* Ready to Play CTA - As seen in image_81e523.png */}
      <section className="cta-section">
        <h3>Ready to Play?</h3>
        <p>Join thousands of players who use BallTogether to organize games, book fields, and connect with teammates.</p>
        <button className="btn-primary" onClick={() => navigate('/fields')}>Book Your First Game →</button>
      </section>
    </div>
  );
};

export default LandingPage;