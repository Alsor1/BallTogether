/** BookingPage.tsx - Import corectat pentru structura ta de fișiere
 * @version 09 Ianuarie 2026
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingPage.css';

interface LocationData {
  id: number;
  name: string;
  address: string;
  price: number;
  imageUrl: string;
}

interface OccupiedSlot {
  id: number;
  startTime: string;
  endTime: string;
}

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  const [location, setLocation] = useState<LocationData | null>(null);
  const [occupiedSlots, setOccupiedSlots] = useState<OccupiedSlot[]>([]);
  
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedSport, setSelectedSport] = useState('Soccer');
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Fetch Location Details & Occupied Slots
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // Fetch Location
        const locRes = await fetch(`http://localhost:8080/api/locations/${id}`);
        if (locRes.ok) {
          const data = await locRes.json();
          // Fallback mapare pret daca vine ca price_per_hour
          setLocation({ ...data, price: data.price || data.price_per_hour });
        }

        // Fetch Occupied Slots
        const slotsRes = await fetch(`http://localhost:8080/api/bookings/occupied/${id}`);
        if (slotsRes.ok) {
          const slots = await slotsRes.json();
          setOccupiedSlots(slots);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  // 2. Calcul Preț & Validare Suprapunere
  useEffect(() => {
    setErrorMsg('');
    setTotalPrice(0);

    if (startTime && endTime && location) {
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (end <= start) {
        setErrorMsg("End time must be after start time.");
        return;
      }

      // Verificăm dacă există suprapunere cu sloturile ocupate
      const hasOverlap = occupiedSlots.some(slot => {
        const slotStart = new Date(slot.startTime);
        const slotEnd = new Date(slot.endTime);
        return start < slotEnd && end > slotStart;
      });

      if (hasOverlap) {
        setErrorMsg("⚠️ The selected time overlaps with an existing booking.");
        return;
      }

      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      setTotalPrice(diffHours * location.price);
    }
  }, [startTime, endTime, location, occupiedSlots]);

  // 3. Confirm Booking
  const handleConfirmBooking = async () => {
    if (errorMsg) return;

    let userId: number | null = null;
    const storedId = localStorage.getItem('userId');
    
    if (storedId) {
      userId = parseInt(storedId);
    } else {
      // Fallback: încercăm să parsam obiectul user întreg
      const userStr = localStorage.getItem('user'); 
      if (userStr) {
          try {
              const userObj = JSON.parse(userStr);
              userId = userObj.id || userObj.userId;
          } catch (e) { console.error("Error parsing user JSON", e); }
      }
    }

    if (!userId) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    const sportIdMap: { [key: string]: number } = {
      'Soccer': 1, 'Basketball': 2, 'Tennis': 3
    };

    const payload = {
      userId: userId,
      locationId: location?.id,
      sportId: sportIdMap[selectedSport] || 1,
      startTime: startTime,
      endTime: endTime,
      totalAmount: totalPrice
    };

    try {
      const response = await fetch('http://localhost:8080/api/bookings/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Booking Confirmed Successfully!");
        navigate('/dashboard');
      } else {
        const errText = await response.text();
        alert("Server Error: " + errText);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to connect to server.");
    }
  };

  if (!location) return <div className="loading">Loading location...</div>;

  return (
    <> 
    <div className="booking-container">
      <div className="booking-content">
        <section className="booking-form-section">
          <h1>Complete your Booking</h1>
          <p className="subtitle">Book your game at <strong>{location.name}</strong></p>
          
          {occupiedSlots.length > 0 && (
            <div className="occupied-alert">
              <h4>Unavailable Times:</h4>
              <ul>
                {occupiedSlots.map(slot => (
                  <li key={slot.id}>
                    {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleTimeString()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-group">
            <label>Sport</label>
            <select 
              value={selectedSport} 
              onChange={(e) => setSelectedSport(e.target.value)}
              className="input-field"
            >
              <option value="Soccer">Soccer</option>
              <option value="Basketball">Basketball</option>
              <option value="Tennis">Tennis</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input 
                type="datetime-local" 
                className={`input-field ${errorMsg ? 'input-error' : ''}`}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input 
                type="datetime-local" 
                className={`input-field ${errorMsg ? 'input-error' : ''}`}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          
          {errorMsg && <p className="error-message">{errorMsg}</p>}

          <div className="payment-method">
            <h3>Payment Method (Placeholder)</h3>
            <div className="card-placeholder">
              <span>💳 **** **** **** 4242</span>
              <span className="check-icon">✔</span>
            </div>
          </div>
        </section>

        <section className="booking-summary">
          <div className="summary-card">
            <div 
              className="summary-image" 
              style={{ backgroundImage: `url(${location.imageUrl})` }}
            ></div>
            <div className="summary-details">
              <h3>{location.name}</h3>
              <p className="summary-address">📍 {location.address}</p>
              <div className="divider"></div>
              
              <div className="price-row">
                <span>Hourly Rate</span>
                <span>${location.price} / hr</span>
              </div>
              <div className="price-row">
                <span>Duration</span>
                <span>{totalPrice > 0 ? (totalPrice / location.price).toFixed(1) : 0} hrs</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleConfirmBooking} 
                className="confirm-btn"
                disabled={!!errorMsg || !startTime || !endTime}
                style={{ opacity: (!!errorMsg || !startTime) ? 0.6 : 1 }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default BookingPage;