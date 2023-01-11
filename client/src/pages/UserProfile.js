// external imports
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Container,
	Grid,
	Box,
	TextField,
	Typography,
	Button,
	Card,
	CardContent,
	Alert,
	InputAdornment,
	IconButton,
	Collapse
} from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import Cookies from "js-cookie";

// internal import
import { setUser } from "../redux/auth.js";

export default function UserProfile() {
	const { user } = useSelector((state) => state.auth);

	const [passwordMatchState, setPasswordMatchState] = useState(true);
	const [shortPasswordWarning, setShortPasswordWarning] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showAlert, setShowAlert] = useState({
		warning: "",
		failed: "",
		success: ""
	});
	const [showPassword, setShowPassword] = useState({
		pswd: false,
		cPswd: false
	});

	const token = Cookies.get("token");
	const dispatch = useDispatch();

	const handleChange = () => {
		const passwordField = document.querySelector("input[name=password]");
		const confirmPasswordField = document.querySelector(
			"input[name=confirmPassword]"
		);
		let passwordWithoutSpaces = passwordField.value.replace(/\s/g, "");
		passwordWithoutSpaces.length < 8
			? setShortPasswordWarning(true)
			: setShortPasswordWarning(false);

		setPassword(passwordWithoutSpaces);
		let confirmPasswordWithoutSpaces = confirmPasswordField.value.replace(
			/\s/g,
			""
		);
		setConfirmPassword(confirmPasswordWithoutSpaces);

		if (passwordWithoutSpaces === confirmPasswordWithoutSpaces) {
			setPasswordMatchState(true);
		} else {
			setPasswordMatchState(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = new FormData(e.currentTarget);
			const form = {
				firstName: data.get("firstName").trim(),
				lastName: data.get("lastName").trim(),
				password: data.get("password").trim()
			};

			const { firstName, lastName, password } = form;
			if (!(firstName && lastName && password)) {
				setShowAlert({
					...showAlert,
					warning: "All Fields Are Required."
				});
				return;
			}

			const res = await fetch(
				`${process.env.REACT_APP_API_BASE}/user/${user._id}`,
				{
					method: "PATCH",
					body: JSON.stringify(form),
					headers: {
						"content-type": "application/json",
						Authorization: `Bearer ${token}`
					}
				}
			);
			const response = await res.json();
			const { _user, message, error } = response;

			if (res.ok) {
				dispatch(setUser(_user));
				setShowAlert({ warning: "", failed: "", success: message });
				setShowPassword({ pswd: false, cPswd: false });
			} else {
				throw Error(error);
			}
		} catch (err) {
			setShowAlert({ ...showAlert, failed: "Something Went Wrong." });
		}
	};

	const handleClickShowPassword = (e) => {
		e.currentTarget.name === "pswd"
			? setShowPassword({ ...showPassword, pswd: !showPassword.pswd })
			: setShowPassword({ ...showPassword, cPswd: !showPassword.cPswd });
	};

	const { warning, failed, success } = showAlert;

	return (
		<Container maxWidth="sm">
			<Card sx={{ minWidth: 275, mt: 5, mb: 5 }}>
				<CardContent>
					<Typography variant="h6" align="center">
						Profile
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									defaultValue={user.firstName}
									autoComplete="given-name"
									name="firstName"
									required
									fullWidth
									id="firstName"
									label="First Name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									defaultValue={user.lastName}
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="family-name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									disabled
									fullWidth
									defaultValue={user.email}
									id="email"
									label="Email Address"
									name="email"
									helperText="Email can not be changed once an account is created with it."
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type={
										showPassword.pswd ? "text" : "password"
									}
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
												<IconButton
													name="pswd"
													onClick={(e) =>
														handleClickShowPassword(
															e
														)
													}
												>
													{showPassword.pswd ? (
														<Visibility />
													) : (
														<VisibilityOff />
													)}
												</IconButton>
											</InputAdornment>
										)
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="confirmPassword"
									label="Confirm Password"
									type={
										showPassword.cPswd ? "text" : "password"
									}
									id="confirmPassword"
									value={confirmPassword}
									onChange={handleChange}
									autoComplete="new-password"
									inputProps={{ maxLength: 20, minLength: 8 }}
									helperText={
										!passwordMatchState &&
										"Both passwords must be same"
									}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													name="cPswd"
													onClick={(e) =>
														handleClickShowPassword(
															e
														)
													}
												>
													{showPassword.cPswd ? (
														<Visibility />
													) : (
														<VisibilityOff />
													)}
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
							color="warning"
							sx={{ mt: 3 }}
						>
							Update
						</Button>
					</Box>
					<Collapse in={!!success}>
						<Alert
							action={
								<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={() => {
										setShowAlert({
											...showAlert,
											success: false
										});
									}}
								>
									<Close fontSize="inherit" />
								</IconButton>
							}
							severity="success"
							sx={{ mt: 3 }}
						>
							{success}
						</Alert>
					</Collapse>
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
				</CardContent>
			</Card>
		</Container>
	);
}
