import { createSlice } from '@reduxjs/toolkit'

// The logged-in phone number is kept here so a page refresh doesn't log the user out
const STORAGE_KEY = 'loggedInPhone'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    phone: localStorage.getItem(STORAGE_KEY),
  },
  reducers: {
    setPhone(state, action) {
      state.phone = action.payload
    },
  },
})

const { setPhone } = authSlice.actions

// Dummy login: there is no server check, any phone number is accepted
export function logIn(phone) {
  return (dispatch) => {
    localStorage.setItem(STORAGE_KEY, phone)
    dispatch(setPhone(phone))
  }
}

export function logOut() {
  return (dispatch) => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch(setPhone(null))
  }
}

export default authSlice.reducer
