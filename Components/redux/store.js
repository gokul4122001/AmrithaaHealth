import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slice/authSlice'
import locationReducer from './slice/LocationSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authSlice, 
    location: locationReducer,
  },
});

export default store;
