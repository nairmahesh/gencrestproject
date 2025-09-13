import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FieldVisits from './pages/FieldVisits';
import SalesOrders from './pages/SalesOrders';
import Liquidation from './pages/Liquidation';
import Contacts from './pages/Contacts';
import { Planning } from './pages/Planning';
import TravelReimbursement from './pages/TravelReimbursement';
import Performance from './pages/Performance';
import RetailerLiquidation from './pages/RetailerLiquidation';
import MobileAppDesign from './pages/MobileAppDesign';
import MobileAppPage from './pages/MobileAppPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/field-visits" element={<FieldVisits />} />
        <Route path="/sales-orders" element={<SalesOrders />} />
        <Route path="/liquidation" element={<Liquidation />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/travel" element={<TravelReimbursement />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/retailer-liquidation/:id" element={<RetailerLiquidation />} />
        <Route path="/mobile-design" element={<MobileAppDesign />} />
        <Route path="/mobile" element={<MobileAppPage />} />
      </Routes>
    </Layout>
  );
}

export default App;