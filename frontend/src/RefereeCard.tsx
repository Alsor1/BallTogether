/** Clasa pentru reprezentarea unui card de arbitru (Vizualizare simplificata)
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
import React from 'react';
import './RefereesPage.css';

interface RefereeProps {
  fullName: string;
  rating: number;
  bio: string;
  sports: string[];
  ratePerHour: number;
  imageUrl: string;
}

const RefereeCard: React.FC<RefereeProps> = ({ 
  fullName, rating, bio, sports, ratePerHour, imageUrl 
}) => {
  return (
    <div className="referee-card">
      <div className="referee-avatar">
        <img src={imageUrl} alt={fullName} />
      </div>
      <div className="referee-info">
        <h3>{fullName}</h3>
        <div className="rating">⭐ {rating}</div>
        <p className="short-bio">{bio}</p>
        
        <div className="sports-tags">
          {sports.map(sport => (
            <span key={sport} className="sport-tag">{sport}</span>
          ))}
        </div>
        
        <div className="rate-info">
          <span className="price">${ratePerHour}/hr</span>
        </div>
      </div>
    </div>
  );
};

export default RefereeCard;