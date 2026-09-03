import { configureStore } from '@reduxjs/toolkit';
import alertSlice from './alertSlice';
import discoverySlice from './discoverySlice';

export const store = configureStore({
  reducer: {
    alert: alertSlice,
    discovery: discoverySlice,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;