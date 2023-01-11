import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
	Container,
	Grid,
	Box,
	TextField,
	Typography,
	Button,
	Avatar,
	Alert,
	InputAdornment,
	IconButton
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";

export default function Register() {
	const [shortPasswordWarning, setShortPasswordWarning] = useState(false);
	const [password, setPassword] = useState("");
	const [showAlert, setShowAlert] = useState({ warning: "", failed: "" });
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const handleChange = () => {
		const passwordField = document.querySelector("input[name=password]");
		let passwordWithoutSpaces = passwordField.value.replace(/\s/g, "");
		passwordWithoutSpaces.length < 8
			? setShortPasswordWarning(true)
			: setShortPasswordWarning(false);
		setPassword(passwordWithoutSpaces);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = new FormData(e.currentTarget);
			const form = {
				firstName: data.get("firstName").trim(),
				lastName: data.get("lastName").trim(),
				email: data.get("email").trim(),
				password: data.get("password").trim()
			};

			const { firstName, lastName, email, password } = form;
			if (!(firstName && lastName && email && password)) {
				setShowAlert({ ...showAlert, warning: "All Fields Are Required." });
				return;
			}

			const res = await fetch(
				`${process.env.REACT_APP_API_BASE}/auth/register`,
				{
					method: "POST",
					body: JSON.stringify(form),
					headers: {
						"content-type": "application/json"
					}
				}
			);
			const response = await res.json();
			const { message, error } = response;

			if (res.ok) {
				setShowAlert({ ...showAlert, success: message });
				navigate("/login", { replace: true });
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
		<Container maxWidth="sm">
			<Box
				sx={{
					mt: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center"
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: "#85bb65" }}>
					<LockOutlined />
				</Avatar>
				<Typography component="h1" variant="h5">
					Create Account
				</Typography>
				<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								autoComplete="given-name"
								name="firstName"
								required
								fullWidth
								id="firstName"
								label="First Name"
								autoFocus
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="family-name"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="password"
								label="Password"
								type={showPassword ? "text" : "password"}
								id="password"
								value={password}
								autoComplete="new-password"
								onChange={handleChange}
								inputProps={{ maxLength: 20, minLength: 8 }}
								helperText={
									shortPasswordWarning &&
									"Password length must be at between 8 to 20 characters"
								}
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
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2, background: "#85bb65", onHover: "red" }}
						color="success"
					>
						Sign Up
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Typography variant="body2">
								Already have an account?{" "}
								<RouterLink to="/login">Log in</RouterLink>
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
