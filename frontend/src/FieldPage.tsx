/** Clasa pentru pagina de cautare a terenurilor sportive
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
import React, { useState, useEffect } from 'react';
// Import MapContainerProps to help debug types if needed
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import FieldCard from './FieldCard';
import './FieldsPage.css';

// Fix for default Leaflet marker icons in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const FieldsPage: React.FC = () => {
  const [fields, setFields] = useState<any[]>([]);

  useEffect(() => {
    const placeholderData = [
      { id: 1, name: 'Sunset Soccer Arena', address: '321 Sunset Dr, Northside', price: 60, players: 22, type: 'Soccer', lat: 44.4268, lng: 26.1025 },
      { id: 2, name: 'Downtown Courts', address: '555 Main St, Central', price: 30, players: 10, type: 'Basketball', lat: 44.4396, lng: 26.0963 },
      { id: 3, name: 'Grand Slam Tennis', address: '888 Victory Lane, Southside', price: 55, players: 4, type: 'Tennis', lat: 44.4150, lng: 26.1200 },
    ];
    setFields(placeholderData);
  }, []);

  // Use a simple array for the center to avoid type conflicts with LatLngExpression
  const mapCenter: [number, number] = [44.4268, 26.1025];

  return (
    <div className="fields-container">
      <section className="fields-header">
        <h1>Find Sports Fields</h1>
        <p>Discover and book the best sports venues in your area</p>
        {/* ... filter bar remains the same ... */}
      </section>

      <section className="map-section">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: '400px', width: '100%', borderRadius: '12px' }}
          scrollWheelZoom={false} // Recommended for better UX
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {fields.map(field => (
            <Marker key={field.id} position={[field.lat, field.lng]}>
              <Popup>
                <strong>{field.name}</strong><br />{field.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>

      <section className="fields-list">
        <h2>Showing {fields.length} fields</h2>
        <div className="fields-grid">
          {fields.map(field => (
            <FieldCard key={field.id} {...field} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default FieldsPage;