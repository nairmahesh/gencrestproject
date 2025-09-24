import type { RootState } from '../store/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface ProtectedRouteProps {
 children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
 const navigate = useNavigate();
 const { loggedIn } = useSelector((state: RootState) => state.auth);
 if (!loggedIn) navigate('/');
 return (
  <>{children}</>
 )
}

export default ProtectedRoute