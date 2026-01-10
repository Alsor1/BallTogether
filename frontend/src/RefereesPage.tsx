/** RefereesPage.tsx - Încărcare dinamică bazată pe DB real
 * @version Ianuarie 2026
 */
import React, { useEffect, useState } from 'react';
import './RefereesPage.css';

interface Referee {
  id: number;
  name: string;
  sports: string[]; // Array de string-uri din DTO
  bio: string;
  imageUrl: string;
  price: number;
}

const RefereesPage: React.FC = () => {
  const [referees, setReferees] = useState<Referee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferees = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/referees');
        if (response.ok) {
          const data = await response.json();
          setReferees(data);
        } else {
          console.error("Failed to fetch referees");
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferees();
  }, []);

  return (
    <>
      <div className="referees-page">
        <header className="referees-header">
          <h1>Meet our Referees</h1>
          <p>Qualified officials ready for your match.</p>
        </header>

        {loading ? (
          <div className="loading-container">Loading Referees...</div>
        ) : referees.length === 0 ? (
          <div className="empty-state">No referees found in the database.</div>
        ) : (
          <div className="referees-grid">
            {referees.map((ref) => (
              <div key={ref.id} className="referee-card">
                <div 
                  className="referee-image" 
                  style={{ backgroundImage: `url(${ref.imageUrl})` }}
                ></div>
                <div className="referee-details">
                  <div className="sport-tags">
                    {ref.sports && ref.sports.map((sport, index) => (
                        <span key={index} className="sport-tag">{sport}</span>
                    ))}
                    {(!ref.sports || ref.sports.length === 0) && <span className="sport-tag">General</span>}
                  </div>
                  
                  <h3>{ref.name}</h3>
                  <p className="description">{ref.bio || "No description available."}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RefereesPage;