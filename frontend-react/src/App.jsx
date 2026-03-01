import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Dashboard Components 
import Overview from './components/Overview';
import Eda from './components/Eda';
import Predict from './components/Predict';

// Data
import dashboardData from './data/dashboard_data.json';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Dashboard wrapper handles sidebar rendering and children */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview data={dashboardData} />} />
          <Route path="eda" element={<Eda data={dashboardData} />} />
          <Route path="predict" element={<Predict />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
