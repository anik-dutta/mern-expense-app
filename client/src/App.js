// external imports
import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

// internal imports
import AppBar from "./components/AppBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import Category from "./pages/Category";
import Guest from "./components/utils/Guest";
import CheckAuth from "./components/utils/CheckAuth";
import { setUser } from "./redux/auth.js";

function App() {
	const token = Cookies.get("token");
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();

	const fetchUser = useCallback(async () => {
		setIsLoading(true);
		const res = await fetch(`${process.env.REACT_APP_API_BASE}/user`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (res.ok) {
			const { user } = await res.json();
			dispatch(setUser(user));
		}
		setIsLoading(false);
	}, [dispatch, token]);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	if (isLoading) {
		return <p>Loading ...</p>;
	}

	return (
		<>
			<AppBar />
			<Routes>
				<Route
					path="/"
					element={
						<CheckAuth>
							<Home />
						</CheckAuth>
					}
				/>
				<Route
					path="/category"
					element={
						<CheckAuth>
							<Category />
						</CheckAuth>
					}
				/>
				<Route
					path="/profile"
					element={
						<CheckAuth>
							<UserProfile />
						</CheckAuth>
					}
				/>
				<Route
					path="/login"
					element={
						<Guest>
							<Login />
						</Guest>
					}
				/>
				<Route
					path="/register"
					element={
						<Guest>
							<Register />
						</Guest>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
