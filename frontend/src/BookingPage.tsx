/** BookingPage.tsx - Cu Selectare Arbitru
 * @version 10 Ianuarie 2026
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
  sports?: { id: number; name: string }[];
}

interface OccupiedSlot {
  id: number;
  startTime: string;
  endTime: string;
}

// Interfață nouă pentru Arbitru (bazată pe DTO-ul creat anterior)
interface Referee {
  id: number;
  name: string;
  price: number; // ratePerHour
  imageUrl: string;
  sports: string[];
}

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  const [location, setLocation] = useState<LocationData | null>(null);
  const [occupiedSlots, setOccupiedSlots] = useState<OccupiedSlot[]>([]);
  
  // State-uri noi pentru Arbitri
  const [referees, setReferees] = useState<Referee[]>([]);
  const [selectedRefereeId, setSelectedRefereeId] = useState<number | null>(null);
  
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingReferees, setLoadingReferees] = useState(false);

  // 1. Fetch Data (Locație, Sloturi Ocupate)
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // Fetch Location
        const locRes = await fetch(`http://localhost:8080/api/locations/${id}`);
        if (locRes.ok) {
          const data = await locRes.json();
          setLocation({ ...data, price: data.price || data.price_per_hour });
          // Setare sport implicit din sporturile disponibile
          if (data.sports && data.sports.length > 0) {
            setSelectedSport(data.sports[0].name);
          }
        }

        // Fetch Occupied Slots
        const slotsRes = await fetch(`http://localhost:8080/api/bookings/occupied/${id}`);
        if (slotsRes.ok) {
          setOccupiedSlots(await slotsRes.json());
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  // 2. Fetch arbitri disponibili când se schimbă intervalul de timp
  useEffect(() => {
    const fetchAvailableReferees = async () => {
      if (!startTime || !endTime) {
        setReferees([]);
        return;
      }

      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (end <= start) {
        setReferees([]);
        return;
      }

      setLoadingReferees(true);
      try {
        const refRes = await fetch(
          `http://localhost:8080/api/referees/available?startTime=${startTime}&endTime=${endTime}`
        );
        if (refRes.ok) {
          setReferees(await refRes.json());
          setSelectedRefereeId(null); // Reset arbitru la schimbare de timp
        }
      } catch (error) {
        console.error("Error fetching available referees:", error);
      } finally {
        setLoadingReferees(false);
      }
    };
    
    fetchAvailableReferees();
  }, [startTime, endTime]);

  // 3. Calcul Preț (Include și Arbitrul)
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
      
      // Calculăm costul arbitrului (dacă e selectat)
      let refereeCostPerHour = 0;
      if (selectedRefereeId) {
        const referee = referees.find(r => r.id === selectedRefereeId);
        if (referee) refereeCostPerHour = referee.price;
      }

      // Preț total = (Preț Teren + Preț Arbitru) * Ore
      const totalHourlyRate = location.price + refereeCostPerHour;
      setTotalPrice(diffHours * totalHourlyRate);
    }
  }, [startTime, endTime, location, occupiedSlots, selectedRefereeId, referees]);

  // 3. Confirm Booking
  const handleConfirmBooking = async () => {
    if (errorMsg) return;

    // Logica de User ID (păstrată din codul tău)
    let userId: number | null = null;
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      userId = parseInt(storedId);
    } else {
      const userStr = localStorage.getItem('user'); 
      if (userStr) {
          try {
              const userObj = JSON.parse(userStr);
              userId = userObj.id || userObj.userId;
          } catch (e) { }
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
      refereeId: selectedRefereeId, // <--- Trimitem ID-ul arbitrului (poate fi null)
      startTime: startTime,
      endTime: endTime,
      // Backend-ul nu folosește totalAmount din frontend pentru validare, dar e bine să-l trimitem dacă e nevoie
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

  // Găsim arbitrul selectat pentru a-i afișa prețul în sumar
  const selectedReferee = referees.find(r => r.id === selectedRefereeId);

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

          {/* Selecție Sport - doar sporturile disponibile pe acest teren */}
          <div className="form-group">
            <label>Sport</label>
            {location.sports && location.sports.length > 0 ? (
              <select 
                value={selectedSport} 
                onChange={(e) => {
                  setSelectedSport(e.target.value);
                  setSelectedRefereeId(null); // Resetează arbitrul când se schimbă sportul
                }}
                className="input-field"
              >
                {location.sports.map((sport) => (
                  <option key={sport.id} value={sport.name}>{sport.name}</option>
                ))}
              </select>
            ) : (
              <p className="no-sports-warning">⚠️ No sports configured for this location</p>
            )}
          </div>

          {/* Selecție Timp - MUTAT ÎNAINTE DE ARBITRU */}
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

          {/* Selecție Arbitru - filtrat după sport ȘI disponibilitate în timp */}
          <div className="form-group">
            <label>Hire a Referee (Optional)</label>
            {!startTime || !endTime ? (
              <p className="hint-text" style={{color: '#888'}}>⏰ Please select a time slot first to see available referees</p>
            ) : loadingReferees ? (
              <p className="hint-text">Loading available referees...</p>
            ) : (
              <>
                <select 
                  value={selectedRefereeId || ''} 
                  onChange={(e) => setSelectedRefereeId(e.target.value ? parseInt(e.target.value) : null)}
                  className="input-field"
                  style={{ borderColor: selectedRefereeId ? '#00a878' : '#ddd' }}
                >
                  <option value="">No Referee</option>
                  {referees
                    .filter(ref => !selectedSport || ref.sports?.includes(selectedSport))
                    .map(ref => (
                      <option key={ref.id} value={ref.id}>
                        {ref.name} (+${ref.price}/hr) - {ref.sports?.join(', ') || 'General'}
                      </option>
                    ))}
                </select>
                {selectedRefereeId && <p className="hint-text">✨ Professional referee selected!</p>}
                {selectedSport && referees.filter(ref => ref.sports?.includes(selectedSport)).length === 0 && (
                  <p className="hint-text" style={{color: '#888'}}>No referees available for {selectedSport} at this time</p>
                )}
              </>
            )}
          </div>

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
                <span>Field Rate</span>
                <span>${location.price} / hr</span>
              </div>
              
              {/* Afișare cost arbitru în sumar */}
              {selectedReferee && (
                <div className="price-row highlight">
                  <span>Referee ({selectedReferee.name})</span>
                  <span>+${selectedReferee.price} / hr</span>
                </div>
              )}

              <div className="price-row">
                <span>Duration</span>
                <span>{startTime && endTime && !errorMsg ? ((new Date(endTime).getTime() - new Date(startTime).getTime()) / 3600000).toFixed(1) : 0} hrs</span>
              </div>
              
              <div className="divider"></div>
              
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