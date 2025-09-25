import LoginCard from "../components/LoginCard"
import AuthLayout from "../layouts/AuthLayout"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { Navigate } from "react-router-dom"

const AuthPage = () => {
 const {loggedIn} = useSelector((state:RootState) => state.auth);
 if(loggedIn) return <Navigate to="/dashboard" replace />;
 
 return (
  <AuthLayout>
   <LoginCard />
  </AuthLayout>
 )
}

export default AuthPage;