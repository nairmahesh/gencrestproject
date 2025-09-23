import { createSlice } from "@reduxjs/toolkit"
import type { UserResponse } from "../interfaces"

interface AuthState {
 user: UserResponse | null
 loggedIn: boolean
}
const initialState: AuthState = {
 user: null,
 loggedIn: false,
}
const authSlice = createSlice({
 initialState: initialState,
 name: "auth",
 reducers: {
  login(state, action) {
   state.user = action.payload
   state.loggedIn = true
  },
  logout(state) {
   state.user = null
   state.loggedIn = false
  }
 }
})

export const { login, logout } = authSlice.actions
export const authReducer = authSlice.reducer