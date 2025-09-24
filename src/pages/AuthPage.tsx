import LoginCard from "../components/LoginCard"
import AuthLayout from "../layouts/AuthLayout"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { useNavigate } from "react-router-dom"

const AuthPage = () => {
 const navigate=useNavigate();
 const {loggedIn}=useSelector((state:RootState)=>state.auth);
 if(loggedIn) navigate('/dashboard');
 return (
  <AuthLayout>
   <LoginCard />
  </AuthLayout>
 )
}

export default AuthPage