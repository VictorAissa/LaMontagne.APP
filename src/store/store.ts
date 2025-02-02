// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import journeyReducer from './features/journeySlice'
import filtersReducer from './features/filtersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    journey: journeyReducer,
    filters: filtersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch