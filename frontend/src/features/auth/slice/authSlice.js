import { createSlice } from '@reduxjs/toolkit';

const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState = {
  token: storedToken || null,
  user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {

      const { token, user, remember } = action.payload || {};

      if (token !== undefined) {
        state.token = token;
        localStorage.setItem('token', token);
      }
      if (user !== undefined) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
