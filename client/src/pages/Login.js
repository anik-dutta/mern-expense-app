// external imports
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
	Container,
	Grid,
	Box,
	Checkbox,
	FormControlLabel,
	TextField,
	Typography,
	Button,
	Avatar,
	Alert,
	InputAdornment,
	IconButton
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import Cookies from "js-cookie";

// internal import
import { setUser } from "../redux/auth.js";

export default function Login() {
	const [showAlert, setShowAlert] = useState({ warning: "", failed: "" });
	const [showPassword, setShowPassword] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const data = new FormData(event.currentTarget);
			const form = {
				email: data.get("email").trim(),
				password: data.get("password").trim(),
				rememberMe: data.get("rememberMe")
			};

			const { email, password } = form;
			if (!(email && password)) {
				setShowAlert({ ...showAlert, warning: "All Fields Are Required." });
				return;
			}

			const res = await fetch(`${process.env.REACT_APP_API_BASE}/auth/login`, {
				method: "POST",
				body: JSON.stringify(form),
				headers: {
					"content-type": "application/json"
				}
			});
			const response = await res.json();
			const { token, user, error } = response;

			if (res.ok) {
				Cookies.set("token", token);
				dispatch(setUser(user));

				navigate("/", { replace: true });
			} else {
				throw Error(error);
			}
		} catch (err) {
			setShowAlert({ ...showAlert, failed: err.toString() });
		}
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const { warning, failed } = showAlert;

	return (
		<Container maxWidth="xs">
			<Box
				sx={{
					mt: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center"
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: "#85bb65" }}>
					<LockOutlined />
				</Avatar>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
					/>

					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type={showPassword ? "text" : "password"}
						id="password"
						autoComplete="current-password"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={handleClickShowPassword}>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
					<FormControlLabel
						control={
							<Checkbox value="remember" name="rememberMe" color="primary" />
						}
						label="Remember me"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="success"
						sx={{ mt: 3, mb: 2, background: "#85bb65" }}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item>
							<Typography variant="body2">
								Don't have an account?{" "}
								<RouterLink to="/register">Sign Up</RouterLink>
							</Typography>
						</Grid>
					</Grid>

					{failed && (
						<Alert severity="error" sx={{ mt: 3 }}>
							{failed}
						</Alert>
					)}
					{warning && (
						<Alert severity="warning" sx={{ mt: 3 }}>
							{warning}
						</Alert>
					)}
				</Box>
			</Box>
		</Container>
	);
}
