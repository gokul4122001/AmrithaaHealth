import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slice/authSlice'

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authSlice, 
  },
});

export default store;
