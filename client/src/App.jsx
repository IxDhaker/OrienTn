import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import CalculatorPage from './pages/CalculatorPage';
import RecommendationsPage from './pages/RecommendationsPage';
import MapPage from './pages/MapPage';
import FacultiesPage from './pages/FacultiesPage';
import SummerPrepPage from './pages/SummerPrepPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/faculties" element={<FacultiesPage />} />
            <Route path="/summer-prep" element={<SummerPrepPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
