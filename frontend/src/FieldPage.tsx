/** FieldsPage.tsx - Corectat pentru a folosi latitude/longitude
 * @version 10 Decembrie 2025
 */
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import FieldCard from './FieldCard';
import './FieldsPage.css';

// Fix pentru iconițele Leaflet care lipsesc uneori în React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Definim interfața exact cum vine din Backend (Java Location Entity)
interface FieldData {
  id: number;
  name: string;
  address: string;
  price: number;       // Mapare automată din price_per_hour
  players: number;     // Mapare automată din capacity
  latitude: number;    // <--- NUME CORECTAT (era lat)
  longitude: number;   // <--- NUME CORECTAT (era lng)
  imageUrl: string;
  type?: string;       // Opțional, în caz că lipsește
}

const FieldsPage: React.FC = () => {
  const [fields, setFields] = useState<FieldData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/locations');
        if (response.ok) {
          const data = await response.json();
          console.log("Date primite:", data); // Verifică în consolă structura
          setFields(data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  // Coordonate centru București
  const mapCenter: [number, number] = [44.4268, 26.1025];

  return (
    <div className="fields-container">
      <section className="fields-header">
        <h1>Find Sports Fields</h1>
        <p>Discover and book the best sports venues in your area</p>
      </section>

      <section className="map-section">
        {/* Folosim o condiție pentru a nu randat harta până nu avem date, opțional */}
        <MapContainer center={mapCenter} zoom={12} style={{ height: '400px', width: '100%', borderRadius: '12px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {fields.map(field => (
            // AICI ESTE FIX-UL: folosim latitude și longitude
            // Verificăm dacă există coordonatele înainte de a crea markerul
            field.latitude && field.longitude ? (
              <Marker key={field.id} position={[field.latitude, field.longitude]}>
                <Popup>
                  <strong>{field.name}</strong><br />{field.address}
                </Popup>
              </Marker>
            ) : null
          ))}
        </MapContainer>
      </section>

      <section className="fields-list">
        <h2>{loading ? 'Loading fields...' : `Showing ${fields.length} fields`}</h2>
        <div className="fields-grid">
          {fields.map(field => (
            <FieldCard key={field.id} {...field} type={field.type || 'General'} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default FieldsPage;