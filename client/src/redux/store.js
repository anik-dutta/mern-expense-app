// external import
import { configureStore } from "@reduxjs/toolkit";

// internal import
import authReducer from "./auth.js";

export default configureStore({
	reducer: {
		auth: authReducer
	}
});
