// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authSlice';
import { liquidationReducer } from './liquidationSlice'; // <-- Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    liquidation: liquidationReducer, // <-- Add reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;