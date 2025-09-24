// src/App.tsx
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import MdoJourneyPage from "./pages/MdoJourneyPage";
import TsmJourneyPage from "./pages/TsmJourneyPage";
import LiquidationPage from "./pages/LiquidationPage";
import UserManagementPage from "./pages/UserManagementPage";
import DistributorLiquidationPage from "./pages/DistributorLiquidationPage";

const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path='/' element={<AuthPage />} />

      {/* Protected Routes */}
      <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path='/mdo-journey' element={<ProtectedRoute><MdoJourneyPage /></ProtectedRoute>} />
      <Route path='/tsm-journey' element={<ProtectedRoute><TsmJourneyPage /></ProtectedRoute>} />
      <Route path='/liquidation' element={<ProtectedRoute><LiquidationPage /></ProtectedRoute>} />
      <Route path='/liquidation/distributor/:distributorId' element={<ProtectedRoute><DistributorLiquidationPage /></ProtectedRoute>} />
      <Route path='/admin/users' element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;