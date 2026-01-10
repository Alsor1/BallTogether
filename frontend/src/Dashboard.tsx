/** Clasa pentru Dashboard
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
 */
import React, { useEffect, useState } from 'react';
import './Dashboard.css';

interface Event {
  id: number;
  host: {
    id: number;
    email: string;
    fullName: string;
  };
  location: {
    id: number;
    name: string;
    address: string;
  };
  sport: {
    id: number;
    name: string;
  } | null;
  startTime: string;
  endTime: string;
  status: string;
  participants?: any[];
  referee?: {
    id: number;
    bio: string;
    ratePerHour: number;
    user: {
      id: number;
      email: string;
      fullName: string;
    };
  } | null;
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || 'Player';

  const fetchMyEvents = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/events/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [userId]);

  const handleInvite = async (eventId: number) => {
    if (!inviteEmail) {
      alert('Please enter an email address');
      return;
    }

    setInviteLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/events/${eventId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail })
      });

      if (response.ok) {
        alert('Invitation sent successfully!');
        setInviteEmail('');
        setSelectedEventId(null);
        fetchMyEvents();
      } else {
        const errorMsg = await response.text();
        alert(`Failed: ${errorMsg}`);
      }
    } catch (err) {
      console.error('Error inviting user:', err);
      alert('Error sending invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const isHost = (event: Event) => {
    if (userId && event.host) return event.host.id === parseInt(userId);
    return false;
  };

  const isReferee = (event: Event) => {
    if (userId && event.referee?.user) return event.referee.user.id === parseInt(userId);
    return false;
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {userName}!</h1>
        <p>Manage your hosted games and upcoming matches.</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading your schedule...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📅</span>
          <h3>No events found</h3>
          <p>You haven't booked any fields or been invited to any games yet.</p>
          <a href="/fields" className="action-btn">Book a Field</a>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div 
              key={event.id} 
              className={`event-card ${isReferee(event) ? 'referee-card' : ''}`}
              data-sport={event.sport?.name || 'Generic'}
            >
              
              {/* Header Card */}
              <div className="card-header">
                <span className="sport-badge">{event.sport?.name || 'Sport'}</span>
                <span className={`status-badge ${event.status.toLowerCase()}`}>{event.status}</span>
              </div>

              {/* Body Card */}
              <div className="card-body">
                <h3 className="location-name">{event.location?.name}</h3>
                <p className="location-address">📍 {event.location?.address}</p>

                <div className="time-info">
                  <div className="date-box">
                    <span className="date-day">{formatEventDate(event.startTime)}</span>
                  </div>
                  <div className="time-box">
                    <span>{formatEventTime(event.startTime)}</span>
                    <span className="arrow">→</span>
                    <span>{formatEventTime(event.endTime)}</span>
                  </div>
                </div>

                <div className="role-indicator">
                   {isReferee(event) ? (
                      <span className="role-tag referee">🏁 You are the Referee</span>
                   ) : isHost(event) ? (
                      <span className="role-tag host">👑 You are Hosting</span>
                   ) : (
                      <span className="role-tag participant">👤 You are Playing</span>
                   )}
                   <span className="participant-count">
                      👥 {event.participants ? event.participants.length + 1 : 1} Players
                   </span>
                </div>

                {/* Referee Info Section - afișează arbitrul dacă există */}
                {event.referee && (
                  <div className="referee-info">
                    <span className="referee-label">🏁 Referee:</span>
                    <span className="referee-name">
                      {event.referee.user?.fullName || event.referee.bio || 'Assigned'}
                    </span>
                  </div>
                )}
                
                {/* Debug: Show event ID */}
                <div className="event-id-debug" style={{fontSize: '0.75rem', color: '#888', marginTop: '0.5rem'}}>
                  Event ID: {event.id}
                </div>
              </div>

              {/* Footer (Doar pentru Host) */}
              {isHost(event) && (
                <div className="card-footer">
                  {selectedEventId === event.id ? (
                    <div className="invite-drawer">
                      <input 
                        type="email" 
                        placeholder="Friend's email..." 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                      <div className="drawer-actions">
                        <button 
                          onClick={() => handleInvite(event.id)} 
                          className="send-btn"
                          disabled={inviteLoading}
                        >
                          {inviteLoading ? 'Sending...' : 'Send'}
                        </button>
                        <button onClick={() => setSelectedEventId(null)} className="cancel-btn">✕</button>
                      </div>
                    </div>
                  ) : (
                    <button className="invite-toggle-btn" onClick={() => setSelectedEventId(event.id)}>
                      + Invite Friend
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;