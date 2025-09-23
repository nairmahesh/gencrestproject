import { Route, Routes } from "react-router"
import AuthPage from "./pages/AuthPage"

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<AuthPage />} />
    </Routes>
  )
}

export default App