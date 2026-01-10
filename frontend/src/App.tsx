/** Clasa pentru App
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
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
import RefereesPage from './RefereesPage';
import AdminPage from './AdminPage';
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
            
            {/* --- MODIFICARE AICI --- */}
            {/* Am schimbat :fieldId în :id pentru a se potrivi cu useParams din BookingPage */}
            <Route path="/book/:id" element={<BookingPage />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/referees" element={<RefereesPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        {/* Global footer present on all pages  */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;