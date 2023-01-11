import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		isAuthenticated: false,
		user: {}
	},
	reducers: {
		setUser: (state, action) => {
			state.isAuthenticated = true;
			state.user = action.payload;
		},
		logout: (state) => {
			state.user = {};
			state.isAuthenticated = false;
		}
	}
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
