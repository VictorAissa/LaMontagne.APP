import { decodeToken } from '@/utils/jwt'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  userId: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  userId: decodeToken(localStorage.getItem('token') || '')?.sub || null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      const decoded = decodeToken(token);
      
      state.token = token;
      state.userId = decoded?.sub || null;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.token = null;
      state.userId = null; 
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer