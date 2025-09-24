import { Route, Routes } from "react-router"
import AuthPage from "./pages/AuthPage"
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardPage from "./pages/DashboardPage"

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<AuthPage />} />
      <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    </Routes>
  )
}

export default App