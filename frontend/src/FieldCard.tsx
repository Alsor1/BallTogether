/** Clasa pentru reprezentarea unui card de teren individual
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
}

const FieldCard: React.FC<FieldProps> = ({ id, name, address, price, players, type }) => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    // Navigates to the booking route with the specific field ID
    navigate(`/book/${id}`);
  };

  return (
    <div className="field-card">
      <div className="card-img-placeholder">
        {/* Type badge (e.g., Soccer, Basketball) */}
        <span className="badge">{type}</span>
      </div>
      <div className="card-info">
        <h3>{name}</h3>
        <p className="address">📍 {address}</p>
        
        <div className="card-footer-info">
          <span className="price"><strong>$</strong> {price}/hr</span>
          <span className="players">👥 {players} players</span>
        </div>

        {/* This button now triggers the redirection to the Booking Page */}
        <button 
          className="book-btn" 
          onClick={handleBookingClick}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default FieldCard;