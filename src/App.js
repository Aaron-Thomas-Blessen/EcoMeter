// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EnergyDashboard from './components/EnergyDashboard';
import EnergyPrediction from './components/EnergyPrediction';
import EnergyConsumptionDashboard from './components/EnergyConsumptionDashboard'; // Import the new component

function App() {
  return (
    <Router>
      <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        <nav className="flex space-x-4 mb-6">
          <Link to="/" className="text-blue-600 font-bold">Dashboard</Link>
          <Link to="/prediction" className="text-purple-600 font-bold">Prediction</Link>
          <Link to="/consumption" className="text-green-600 font-bold">Consumption</Link> {/* Add new link */}
        </nav>

        <Routes>
          <Route path="/" element={<EnergyDashboard />} />
          <Route path="/prediction" element={<EnergyPrediction />} />
          <Route path="/consumption" element={<EnergyConsumptionDashboard />} /> {/* Add new route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
