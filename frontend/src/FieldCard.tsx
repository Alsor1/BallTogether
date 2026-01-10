/** Clasa pentru reprezentarea unui card de teren cu imagine dinamica
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FieldsPage.css';

interface FieldProps {
  id: number;
  name: string;
  address: string;
  price: number;
  players: number;
  type: string;
  imageUrl: string; // Dynamic image from DB
  sports?: { id: number; name: string }[]; // Sporturile disponibile
}

const FieldCard: React.FC<FieldProps> = ({ id, name, address, price, players, type, imageUrl, sports }) => {
  const navigate = useNavigate();

  return (
    <div className="field-card">
      <div 
        className="card-img-container" 
        style={{ 
          backgroundImage: `url(${imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '200px',
          borderRadius: '12px 12px 0 0',
          position: 'relative'
        }}
      >
        <span className="badge">{type}</span>
      </div>
      <div className="card-info">
        <h3>{name}</h3>
        <p className="address">📍 {address}</p>
        
        {/* Afișare sporturi disponibile */}
        {sports && sports.length > 0 && (
          <div className="sports-tags">
            {sports.map((sport) => (
              <span key={sport.id} className="sport-tag-field">{sport.name}</span>
            ))}
          </div>
        )}
        
        <div className="card-footer-info">
          <span className="price"><strong>$</strong> {price}/hr</span>
          <span className="players">👥 {players} players</span>
        </div>

        <button 
          className="book-btn" 
          onClick={() => navigate(`/book/${id}`)} // Redirect to booking
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default FieldCard;