/** Clasa pentru pagina de vizualizare a arbitrilor (Fara cautare)
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
import React, { useState, useEffect } from 'react';
import RefereeCard from './RefereeCard';
import './RefereesPage.css';

const RefereesPage: React.FC = () => {
  const [allReferees, setAllReferees] = useState<any[]>([]);
  const [filteredReferees, setFilteredReferees] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // Simulated fetch from Backend RefereeController
    const placeholderReferees = [
      { id: 1, fullName: 'Marcus Johnson', rating: 4.9, bio: '10+ years of professional refereeing experience. FIFA certified for soccer matches.', sports: ['Soccer', 'Futsal'], ratePerHour: 25, imageUrl: 'https://i.pravatar.cc/150?u=1' },
      { id: 2, fullName: 'Sarah Chen', rating: 4.8, bio: 'Former professional basketball player turned referee. NCAA certified official.', sports: ['Basketball'], ratePerHour: 30, imageUrl: 'https://i.pravatar.cc/150?u=2' },
      { id: 3, fullName: 'Daniel Rodriguez', rating: 4.7, bio: 'Multi-sport certified referee with 8 years experience in community leagues.', sports: ['Soccer', 'Basketball', 'Volleyball'], ratePerHour: 28, imageUrl: 'https://i.pravatar.cc/150?u=3' },
      { id: 4, fullName: 'Emily Thompson', rating: 4.9, bio: 'Tennis umpire with ITF certification. Experienced in both singles and doubles.', sports: ['Tennis'], ratePerHour: 35, imageUrl: 'https://i.pravatar.cc/150?u=4' },
      { id: 5, fullName: 'Michael Park', rating: 4.6, bio: 'Certified referee for youth and adult soccer leagues. Passionate about fair play.', sports: ['Soccer'], ratePerHour: 22, imageUrl: 'https://i.pravatar.cc/150?u=5' },
      { id: 6, fullName: 'Alex Rivera', rating: 4.8, bio: 'Beach volleyball and indoor volleyball specialist. FIVB certified official.', sports: ['Volleyball'], ratePerHour: 27, imageUrl: 'https://i.pravatar.cc/150?u=6' }
    ];
    setAllReferees(placeholderReferees);
    setFilteredReferees(placeholderReferees);
  }, []);

  const handleFilter = (sport: string) => {
    setActiveFilter(sport);
    if (sport === 'All') {
      setFilteredReferees(allReferees);
    } else {
      setFilteredReferees(allReferees.filter(ref => ref.sports.includes(sport)));
    }
  };

  const sports = ['All', 'Soccer', 'Basketball', 'Tennis', 'Volleyball'];

  return (
    <div className="referees-container">
      <header className="referees-header">
        <h1>Our Certified Referees</h1>
        <p>Professional referees ready to officiate your games. All referees are certified and background-checked for your safety.</p>
        
        <div className="filter-bar-only">
          <div className="filter-chips">
            {sports.map(sport => (
              <button 
                key={sport} 
                className={`chip ${activeFilter === sport ? 'active' : ''}`}
                onClick={() => handleFilter(sport)}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
        <p className="results-count">Showing {filteredReferees.length} referees</p>
      </header>

      <section className="referees-grid">
        {filteredReferees.map(ref => (
          <RefereeCard key={ref.id} {...ref} />
        ))}
      </section>

      <section className="why-referee-section">
        <h2>Why Book a Referee?</h2>
        <p>Having a certified referee ensures fair play, enforces rules properly, and keeps your game running smoothly.</p>
        <div className="benefits-grid">
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <h4>Certified Pros</h4>
            <p>All referees are certified for their sports</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">⭐</span>
            <h4>Highly Rated</h4>
            <p>Top-rated by thousands of players</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🔒</span>
            <h4>Background Checked</h4>
            <p>Safety and trust guaranteed</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefereesPage;