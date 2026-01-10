import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface Sport {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  price: number;
  players: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  sports: Sport[];
}

interface Referee {
  id: number;
  user: User;
  bio: string;
  ratePerHour: number;
  imageUrl: string;
  sports: Sport[];
}

interface Event {
  id: number;
  host: User;
  participants: User[];
  location: Location;
  sport: Sport;
  startTime: string;
  endTime: string;
  status: string;
  referee: Referee | null;
}

type TabType = 'users' | 'events' | 'referees' | 'locations';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [showAddRefereeModal, setShowAddRefereeModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [refereeUserSearch, setRefereeUserSearch] = useState('');

  // Form states
  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    price: 0,
    capacity: 10,
    latitude: 0,
    longitude: 0,
    imageUrl: '',
    sportIds: [] as number[]
  });

  const [refereeForm, setRefereeForm] = useState({
    userId: 0,
    bio: '',
    ratePerHour: 50,
    imageUrl: '',
    sportIds: [] as number[]
  });

  // Check if user is admin
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') {
        navigate('/dashboard');
        return;
      }
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [usersRes, eventsRes, refereesRes, locationsRes, sportsRes] = await Promise.all([
          fetch('http://localhost:8080/api/admin/users'),
          fetch('http://localhost:8080/api/admin/events'),
          fetch('http://localhost:8080/api/admin/referees'),
          fetch('http://localhost:8080/api/admin/locations'),
          fetch('http://localhost:8080/api/admin/sports')
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
        if (refereesRes.ok) setReferees(await refereesRes.json());
        if (locationsRes.ok) setLocations(await locationsRes.json());
        if (sportsRes.ok) setSports(await sportsRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('error', 'Failed to load data');
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, refereesRes, locationsRes, sportsRes] = await Promise.all([
        fetch('http://localhost:8080/api/admin/users'),
        fetch('http://localhost:8080/api/admin/events'),
        fetch('http://localhost:8080/api/admin/referees'),
        fetch('http://localhost:8080/api/admin/locations'),
        fetch('http://localhost:8080/api/admin/sports')
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (refereesRes.ok) setReferees(await refereesRes.json());
      if (locationsRes.ok) setLocations(await locationsRes.json());
      if (sportsRes.ok) setSports(await sportsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('error', 'Failed to load data');
    }
    setLoading(false);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // ==================== USER ACTIONS ====================
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'User deleted successfully');
        fetchAllData();
      } else {
        const error = await res.text();
        showMessage('error', error);
      }
    } catch (error) {
      showMessage('error', 'Failed to delete user');
    }
  };

  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        showMessage('success', `Role changed to ${newRole}`);
        fetchAllData();
      } else {
        const error = await res.text();
        showMessage('error', error);
      }
    } catch (error) {
      showMessage('error', 'Failed to change role');
    }
  };

  // ==================== EVENT ACTIONS ====================
  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/admin/events/${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Event deleted successfully');
        fetchAllData();
        setShowEventDetailsModal(false);
      } else {
        const error = await res.text();
        showMessage('error', error);
      }
    } catch (error) {
      showMessage('error', 'Failed to delete event');
    }
  };

  const handleUpdateEventStatus = async (eventId: number, status: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/events/${eventId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showMessage('success', `Event status updated to ${status}`);
        fetchAllData();
      } else {
        const error = await res.text();
        showMessage('error', error);
      }
    } catch (error) {
      showMessage('error', 'Failed to update event status');
    }
  };

  const handleAddParticipant = async () => {
    if (!selectedEvent || !newParticipantEmail.trim()) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/admin/events/${selectedEvent.id}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newParticipantEmail.trim() })
      });
      if (res.ok) {
        showMessage('success', 'Participant added successfully');
        setNewParticipantEmail('');
        fetchAllData();
        // Refresh selected event
        const updatedEvent = events.find(e => e.id === selectedEvent.id);
        if (updatedEvent) setSelectedEvent(updatedEvent);
      } else {
        const error = await res.text();
        showMessage('error', error);
      }
    } catch (error) {
      showMessage('error', 'Failed to add participant');
    }
  };

  const handleRemoveParticipant = async (eventId: number, userId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/events/${eventId}/participants/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showMessage('success', 'Participant removed');
        fetchAllData();
      } else {
        const error = await res.text();
        showMessage('error', error);
      }
    } catch (error) {
      showMessage('error', 'Failed to remove participant');
    }
  };

  // ==================== REFEREE ACTIONS ====================
  const handleCreateReferee = async () => {
    if (!refereeForm.userId) {
      showMessage('error', 'Please select a user');
      return;
    }
    if (refereeForm.sportIds.length === 0) {
      showMessage('error', 'Please select at least one sport for this referee');
      return;
    }
    
    try {
      const res = await fetch('http://localhost:8080/api/admin/referees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refereeForm)
      });
      if (res.ok) {
        showMessage('success', 'Referee created successfully');
        setShowAddRefereeModal(false);
        setRefereeForm({ userId: 0, bio: '', ratePerHour: 50, imageUrl: '', sportIds: [] });
        setRefereeUserSearch('');
        fetchAllData();
      } else {
        const error = await res.text();
        showMessage('error', error);
      }
    } catch (error) {
      showMessage('error', 'Failed to create referee');
    }
  };

  const handleRevokeReferee = async (refereeId: number) => {
    if (!window.confirm('Are you sure you want to revoke this referee status?')) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/admin/referees/${refereeId}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Referee status revoked');
        fetchAllData();
      } else {
        const error = await res.text();
        showMessage('error', error);
      }
    } catch (error) {
      showMessage('error', 'Failed to revoke referee');
    }
  };

  // ==================== LOCATION ACTIONS ====================
  const handleCreateLocation = async () => {
    if (!locationForm.name || !locationForm.address) {
      showMessage('error', 'Name and address are required');
      return;
    }
    if (locationForm.sportIds.length === 0) {
      showMessage('error', 'Please select at least one sport for this location');
      return;
    }
    
    try {
      const res = await fetch('http://localhost:8080/api/admin/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationForm)
      });
      if (res.ok) {
        showMessage('success', 'Location created successfully');
        setShowAddLocationModal(false);
        setLocationForm({ name: '', address: '', price: 0, capacity: 10, latitude: 0, longitude: 0, imageUrl: '', sportIds: [] });
        fetchAllData();
      } else {
        const error = await res.text();
        showMessage('error', error);
      }
    } catch (error) {
      showMessage('error', 'Failed to create location');
    }
  };

  const handleDeleteLocation = async (locationId: number) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/admin/locations/${locationId}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Location deleted successfully');
        fetchAllData();
      } else {
        const error = await res.text();
        showMessage('error', error);
      }
    } catch (error) {
      showMessage('error', 'Failed to delete location');
    }
  };

  // Filter data based on search term
  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(e =>
    e.location?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.host?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.sport?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLocations = locations.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get non-referee users for the referee creation dropdown
  // Exclude users who are already referees (check both role and referees list)
  const refereeUserIds = referees.map(r => r.user?.id).filter(Boolean);
  const nonRefereeUsers = users.filter(u => 
    u.role !== 'Referee' && 
    !refereeUserIds.includes(u.id)
  );

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ro-RO', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'role-badge role-admin';
      case 'referee': return 'role-badge role-referee';
      default: return 'role-badge role-user';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'planned': return 'status-badge status-planned';
      case 'active':
      case 'in_progress': return 'status-badge status-active';
      case 'completed':
      case 'finished': return 'status-badge status-completed';
      case 'cancelled':
      case 'suspended': return 'status-badge status-cancelled';
      default: return 'status-badge';
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1><span className="admin-icon">⚙️</span> Admin Panel</h1>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
        >
          👥 Users ({users.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => { setActiveTab('events'); setSearchTerm(''); }}
        >
          📅 Events ({events.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'referees' ? 'active' : ''}`}
          onClick={() => { setActiveTab('referees'); setSearchTerm(''); }}
        >
          🏃 Referees ({referees.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'locations' ? 'active' : ''}`}
          onClick={() => { setActiveTab('locations'); setSearchTerm(''); }}
        >
          📍 Locations ({locations.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>👥 User Management</h2>
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <p>No users found</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="actions">
                      <select
                        value={user.role || 'User'}
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem' }}
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="Referee">Referee</option>
                      </select>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="admin-section">
          <h2>📅 Event Management</h2>
          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <p>No events found</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Sport</th>
                  <th>Host</th>
                  <th>Date/Time</th>
                  <th>Participants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(event => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.location?.name || 'N/A'}</td>
                    <td>{event.sport?.name || 'N/A'}</td>
                    <td>{event.host?.fullName || 'N/A'}</td>
                    <td>{formatDateTime(event.startTime)}</td>
                    <td>{event.participants?.length || 0}</td>
                    <td>
                      <span className={getStatusBadgeClass(event.status)}>
                        {event.status || 'PLANNED'}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn btn-info"
                        onClick={() => { setSelectedEvent(event); setShowEventDetailsModal(true); }}
                      >
                        👁️ Details
                      </button>
                      <select
                        value={event.status || 'PLANNED'}
                        onChange={(e) => handleUpdateEventStatus(event.id, e.target.value)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem' }}
                      >
                        <option value="PLANNED">Planned</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Referees Tab */}
      {activeTab === 'referees' && (
        <div className="admin-section">
          <h2>
            🏃 Referee Management
            <button 
              className="btn btn-primary" 
              style={{ marginLeft: 'auto' }}
              onClick={() => setShowAddRefereeModal(true)}
            >
              ➕ Add Referee
            </button>
          </h2>
          {referees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏃</div>
              <p>No referees found</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Rate/Hour</th>
                  <th>Sports</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {referees.map(referee => (
                  <tr key={referee.id}>
                    <td>{referee.id}</td>
                    <td>{referee.user?.fullName || 'N/A'}</td>
                    <td>{referee.user?.email || 'N/A'}</td>
                    <td>${referee.ratePerHour}</td>
                    <td>
                      <div className="sports-tags">
                        {referee.sports?.map(sport => (
                          <span key={sport.id} className="sport-tag">{sport.name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleRevokeReferee(referee.id)}
                      >
                        ❌ Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div className="admin-section">
          <h2>
            📍 Location Management
            <button 
              className="btn btn-primary" 
              style={{ marginLeft: 'auto' }}
              onClick={() => setShowAddLocationModal(true)}
            >
              ➕ Add Location
            </button>
          </h2>
          {filteredLocations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📍</div>
              <p>No locations found</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Price/Hour</th>
                  <th>Capacity</th>
                  <th>Sports</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocations.map(location => (
                  <tr key={location.id}>
                    <td>{location.id}</td>
                    <td>{location.name}</td>
                    <td>{location.address}</td>
                    <td>${location.price}</td>
                    <td>{location.players}</td>
                    <td>
                      <div className="sports-tags">
                        {location.sports?.map(sport => (
                          <span key={sport.id} className="sport-tag">{sport.name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteLocation(location.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetailsModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowEventDetailsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>📅 Event Details - #{selectedEvent.id}</h3>
            
            <div className="form-group">
              <label>Location:</label>
              <p>{selectedEvent.location?.name} - {selectedEvent.location?.address}</p>
            </div>
            
            <div className="form-group">
              <label>Sport:</label>
              <p>{selectedEvent.sport?.name}</p>
            </div>
            
            <div className="form-group">
              <label>Host:</label>
              <p>{selectedEvent.host?.fullName} ({selectedEvent.host?.email})</p>
            </div>
            
            <div className="form-group">
              <label>Time:</label>
              <p>{formatDateTime(selectedEvent.startTime)} - {formatDateTime(selectedEvent.endTime)}</p>
            </div>
            
            <div className="form-group">
              <label>Referee:</label>
              <p>{selectedEvent.referee?.user?.fullName || 'None assigned'}</p>
            </div>
            
            <div className="form-group">
              <label>Participants ({selectedEvent.participants?.length || 0}):</label>
              <div className="participants-list">
                {selectedEvent.participants?.map(p => (
                  <span key={p.id} className="participant-chip">
                    {p.fullName}
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveParticipant(selectedEvent.id, p.id)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Add Participant:</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={newParticipantEmail}
                  onChange={(e) => setNewParticipantEmail(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-primary" onClick={handleAddParticipant}>
                  Add
                </button>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowEventDetailsModal(false)}>
                Close
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                🗑️ Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Location Modal */}
      {showAddLocationModal && (
        <div className="modal-overlay" onClick={() => setShowAddLocationModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>➕ Add New Location</h3>
            
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={locationForm.name}
                onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
                placeholder="e.g., Central Stadium"
              />
            </div>
            
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                value={locationForm.address}
                onChange={(e) => setLocationForm({...locationForm, address: e.target.value})}
                placeholder="e.g., 123 Main Street"
              />
            </div>
            
            <div className="form-group">
              <label>Price per Hour ($)</label>
              <input
                type="number"
                value={locationForm.price}
                onChange={(e) => setLocationForm({...locationForm, price: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div className="form-group">
              <label>Capacity (players)</label>
              <input
                type="number"
                value={locationForm.capacity}
                onChange={(e) => setLocationForm({...locationForm, capacity: parseInt(e.target.value) || 10})}
              />
            </div>
            
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                step="0.000001"
                value={locationForm.latitude}
                onChange={(e) => setLocationForm({...locationForm, latitude: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="0.000001"
                value={locationForm.longitude}
                onChange={(e) => setLocationForm({...locationForm, longitude: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={locationForm.imageUrl}
                onChange={(e) => setLocationForm({...locationForm, imageUrl: e.target.value})}
                placeholder="https://..."
              />
            </div>
            
            <div className="form-group">
              <label>Sports *</label>
              <div className="checkbox-grid">
                {sports.map(sport => (
                  <label key={sport.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={locationForm.sportIds.includes(sport.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLocationForm({...locationForm, sportIds: [...locationForm.sportIds, sport.id]});
                        } else {
                          setLocationForm({...locationForm, sportIds: locationForm.sportIds.filter(id => id !== sport.id)});
                        }
                      }}
                    />
                    <span className="checkbox-label">{sport.name}</span>
                  </label>
                ))}
              </div>
              {sports.length === 0 && <p className="hint-text">No sports available in database</p>}
            </div>
            
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddLocationModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateLocation}>
                ➕ Create Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Referee Modal */}
      {showAddRefereeModal && (
        <div className="modal-overlay" onClick={() => setShowAddRefereeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>➕ Make User a Referee</h3>
            
            <div className="form-group">
              <label>Search & Select User * ({nonRefereeUsers.length} available)</label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={refereeUserSearch}
                onChange={(e) => setRefereeUserSearch(e.target.value)}
                style={{ marginBottom: '0.5rem' }}
              />
              <div className="user-selection-list">
                {nonRefereeUsers
                  .filter(u => 
                    u.fullName?.toLowerCase().includes(refereeUserSearch.toLowerCase()) ||
                    u.email?.toLowerCase().includes(refereeUserSearch.toLowerCase())
                  )
                  .map(user => (
                    <label 
                      key={user.id} 
                      className={`user-selection-item ${refereeForm.userId === user.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="refereeUser"
                        checked={refereeForm.userId === user.id}
                        onChange={() => setRefereeForm({...refereeForm, userId: user.id})}
                      />
                      <div className="user-info">
                        <span className="user-name">{user.fullName || 'No Name'}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </label>
                  ))
                }
                {nonRefereeUsers.filter(u => 
                  u.fullName?.toLowerCase().includes(refereeUserSearch.toLowerCase()) ||
                  u.email?.toLowerCase().includes(refereeUserSearch.toLowerCase())
                ).length === 0 && (
                  <p className="hint-text">No users found matching your search</p>
                )}
              </div>
              {refereeForm.userId > 0 && (
                <p className="selected-user-hint">
                  ✓ Selected: {users.find(u => u.id === refereeForm.userId)?.email}
                </p>
              )}
            </div>
            
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={refereeForm.bio}
                onChange={(e) => setRefereeForm({...refereeForm, bio: e.target.value})}
                placeholder="Brief description about the referee..."
              />
            </div>
            
            <div className="form-group">
              <label>Rate per Hour ($)</label>
              <input
                type="number"
                value={refereeForm.ratePerHour}
                onChange={(e) => setRefereeForm({...refereeForm, ratePerHour: parseFloat(e.target.value) || 50})}
              />
            </div>
            
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={refereeForm.imageUrl}
                onChange={(e) => setRefereeForm({...refereeForm, imageUrl: e.target.value})}
                placeholder="https://..."
              />
            </div>
            
            <div className="form-group">
              <label>Sports *</label>
              <div className="checkbox-grid">
                {sports.map(sport => (
                  <label key={sport.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={refereeForm.sportIds.includes(sport.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRefereeForm({...refereeForm, sportIds: [...refereeForm.sportIds, sport.id]});
                        } else {
                          setRefereeForm({...refereeForm, sportIds: refereeForm.sportIds.filter(id => id !== sport.id)});
                        }
                      }}
                    />
                    <span className="checkbox-label">{sport.name}</span>
                  </label>
                ))}
              </div>
              {sports.length === 0 && <p className="hint-text">No sports available in database</p>}
            </div>
            
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddRefereeModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateReferee}>
                ➕ Create Referee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
