import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './page/LandingPage';
import FlightDetailsPage from './page/FlightDetailsPage';
import FlightResultsPage from './page/FlightResultsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/flight-results" element={<FlightResultsPage />} />
        <Route path="/flight-details/:id" element={<FlightDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;