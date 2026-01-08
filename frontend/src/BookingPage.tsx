/** Clasa pentru pagina de rezervare a unui teren
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingPage.css';

// Mock data to represent the selected field based on your design
const mockFieldData = {
  id: 1,
  name: 'Central Park Soccer',
  type: 'Soccer • 5v5',
  address: '123 Central Ave, Downtown',
  pricePerHour: 50,
  // Using a placeholder image from Unsplash
  image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a3?auto=format&fit=crop&q=80&w=1000',
  amenities: ['Changing Rooms', 'Showers', 'Parking', 'Floodlights'],
  // Placeholder for a static map image
  locationImage: 'https://i.imgur.com/8Y8Y8Y8.png' 
};

const BookingPage: React.FC = () => {
  // We will use this ID later to fetch the specific field data from the backend
  const { fieldId } = useParams<{ fieldId: string }>();
  const field = mockFieldData; 

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [addReferee, setAddReferee] = useState(false);

  // Placeholder time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const refereePrice = 25;
  const totalPrice = field.pricePerHour + (addReferee ? refereePrice : 0);

  return (
    <div className="booking-container">
      <div className="booking-content">
        {/* Left Side - Booking Details Form */}
        <div className="booking-form-section">
          <h1>Complete Your Booking</h1>
          
          <div className="form-group">
            <label>Select Date</label>
            <DatePicker 
              selected={startDate} 
              onChange={(date: Date | null) => setStartDate(date)} 
              dateFormat="MMMM d, yyyy"
              className="date-picker-input"
              minDate={new Date()}
            />
          </div>

          <div className="form-group">
            <label>Select Time Slot ({timeSlots.length} available)</label>
            <div className="time-slots-grid">
              {timeSlots.map(time => (
                <button 
                  key={time} 
                  className={`time-slot-btn ${selectedTime === time ? 'active' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Organizer Details</label>
            <input type="text" placeholder="Full Name" className="form-input" />
            <input type="email" placeholder="Email Address" className="form-input" />
          </div>

          <div className="form-group referees-section">
            <div className="referee-toggle-label">
              <span>Need Referees? (+${refereePrice})</span>
              <p>Professional referees for a fair game.</p>
            </div>
            {/* Toggle Switch for Referee */}
            <label className="switch">
              <input 
                type="checkbox" 
                checked={addReferee} 
                onChange={() => setAddReferee(!addReferee)} 
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="price-summary">
            <div className="price-row">
              <span>Field Price (1 hr)</span>
              <span>${field.pricePerHour.toFixed(2)}</span>
            </div>
            {addReferee && (
              <div className="price-row">
                <span>Referee Fee</span>
                <span>${refereePrice.toFixed(2)}</span>
              </div>
            )}
            <div className="price-row total">
              <span>Total</span>
              <span className="total-amount">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button className="btn-confirm-booking" disabled={!startDate || !selectedTime}>
            Confirm Booking
          </button>
          <p className="terms-text">By confirming, you agree to the Terms of Service.</p>
        </div>

        {/* Right Side - Field Summary Card */}
        <div className="field-summary-section">
          <div className="summary-card">
            <div className="summary-image" style={{ backgroundImage: `url(${field.image})` }}></div>
            <div className="summary-details">
              <span className="summary-type">{field.type}</span>
              <h2>{field.name}</h2>
              <p className="summary-address">📍 {field.address}</p>
              
              <div className="amenities-list">
                {field.amenities.map(amenity => (
                  <span key={amenity} className="amenity-tag">✓ {amenity}</span>
                ))}
              </div>

              <div className="mini-map">
                {/* Placeholder for a static map image */}
                <img src={field.locationImage} alt="Location Map" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;