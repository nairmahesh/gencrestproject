import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { apiService } from '../services/apiService';

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Failed to logout from server:", error);
    } finally {
      dispatch(logout());
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      apiService.setAuthToken(null);
      navigate('/');
    }
  };

  return { handleLogout };
};