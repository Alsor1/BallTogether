/** Clasa pentru gestionarea rutei principale a aplicatiei
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Footer from './Footer';
import FieldsPage from './FieldPage';
import BookingPage from './BookingPage';
import RefereesPage from './RefereesPage'
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navigation bar present on all pages  */}
        <Navbar />

        {/* Main content area that expands to push footer down */}
        <main style={{ flex: 1 }}>
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/fields" element={<FieldsPage />} />
  {/* Add this new route */}
  <Route path="/book/:fieldId" element={<BookingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/referees" element={<RefereesPage />} />
</Routes>
        </main>

        {/* Global footer present on all pages  */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;