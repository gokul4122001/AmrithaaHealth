import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: '',
    user_id: '',
    user_type: '',
    userName: '',
  },
  reducers: {
    setAuthDetails: (state, action) => {
      state.token = action.payload.access_token;
      state.user_type = action.payload.user_type;
      state.user_id = action.payload.user_id;
    },
    setUserName: (state, action) => {
      state.userName = action.payload.userName;
    },
    setClear: (state) => {
      state.token = "";
      state.user_type = "";
      state.user_id =""  ;
      state.userName = ""
    },
  },
});

export const { setAuthDetails, setUserName,setClear } = authSlice.actions;

export default authSlice.reducer;
