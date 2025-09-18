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
// import MobileAppDesign from './pages/MobileAppDesign';
// import MobileAppPage from './pages/MobileAppPage';
import Login from './pages/Login';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/field-visits" element={<ProtectedRoute><FieldVisits /></ProtectedRoute>} />
        <Route path="/sales-orders" element={<ProtectedRoute><SalesOrders /></ProtectedRoute>} />
        <Route path="/liquidation" element={<ProtectedRoute><Liquidation /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
        <Route path="/planning" element={<ProtectedRoute><Planning /></ProtectedRoute>} />
        <Route path="/travel" element={<ProtectedRoute><TravelReimbursement /></ProtectedRoute>} />
        <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
        <Route path="/retailer-liquidation/:id" element={<ProtectedRoute><RetailerLiquidation /></ProtectedRoute>} />
        {/* <Route path="/mobile-design" element={<MobileAppDesign />} />
        <Route path="/mobile" element={<MobileAppPage />} /> */}
      </Routes>
    </Layout>
  );
}

export default App;