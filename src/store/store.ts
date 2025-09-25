import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authSlice';
import { liquidationReducer } from './liquidationSlice';
import { mdoReducer } from './mdoSlice'; // <-- Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    liquidation: liquidationReducer,
    mdo: mdoReducer, // <-- Add reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;