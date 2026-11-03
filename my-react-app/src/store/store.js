import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import leadsReducer from './leadsSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
  },
})
