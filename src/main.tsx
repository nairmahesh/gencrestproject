import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { login } from './store/authSlice.ts';
import { apiService } from './services/apiService.ts';
import App from './App.tsx';
import './index.css';

// --- STATE REHYDRATION LOGIC ---
const userString = localStorage.getItem('user');
const accessToken = localStorage.getItem('accessToken');

if (userString && accessToken) {
  try {
    const user = JSON.parse(userString);
    // Restore user session in Redux
    store.dispatch(login(user));
    // Set the auth token for future API calls
    apiService.setAuthToken(accessToken);
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    // Clear potentially corrupt data
    localStorage.clear();
  }
}
// --- END OF REHYDRATION LOGIC ---

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);