import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Autocomplete,
	Alert,
	IconButton,
	Collapse,
	Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Cookies from "js-cookie";

const InitialForm = {
	amount: 0,
	description: "",
	date: new Date(),
	categoryId: ""
};

export default function TransactionForm({
	fetchTransactions,
	editTransaction,
	setEditTransaction
}) {
	const [form, setForm] = useState(InitialForm);
	const [showAlert, setShowAlert] = useState({
		warning: "",
		failed: "",
		success: ""
	});

	const token = Cookies.get("token");
	const { categories } = useSelector((state) => state.auth.user);

	const reload = (res) => {
		if (res.ok) {
			setForm(InitialForm);
			setEditTransaction(InitialForm);
			fetchTransactions();
		}
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleDate = (newValue) => {
		setForm({ ...form, date: newValue });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!form.amount) {
			setShowAlert({ ...showAlert, warning: "Amount can not be 0" });
			return;
		}
		form.amount = Number(form.amount).toFixed(2);
		editTransaction.amount ? update() : create();
	};

	const create = async () => {
		try {
			const res = await fetch(`${process.env.REACT_APP_API_BASE}/transaction`, {
				method: "POST",
				body: JSON.stringify(form),
				headers: {
					"content-type": "application/json",
					Authorization: `Bearer ${token}`
				}
			});

			const response = await res.json();
			const { message, error } = response;

			if (res.ok) {
				reload(res);
				setShowAlert({ warning: "", failed: "", success: message });
			} else {
				throw Error(error);
			}
		} catch (err) {
			setShowAlert({ ...showAlert, failed: "Something Went Wrong." });
		}
	};

	const update = async () => {
		try {
			const res = await fetch(
				`${process.env.REACT_APP_API_BASE}/transaction/${editTransaction._id}`,
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
			const { message, error } = response;

			if (res.ok) {
				reload(res);
				setShowAlert({ warning: "", failed: "", success: message });
			} else {
				throw Error(error);
			}
		} catch (err) {
			setShowAlert({ ...showAlert, failed: "Something Went Wrong." });
		}
	};

	const getCategoryNameById = () => {
		return (
			categories?.find((category) => category._id === form.categoryId) ?? ""
		);
	};

	useEffect(() => {
		if (editTransaction.amount) {
			setForm(editTransaction);
		}
	}, [editTransaction]);

	const { warning, failed, success } = showAlert;

	return (
		<Card sx={{ minWidth: 275, mt: 7 }}>
			<CardContent>
				<Typography variant="h6" align="center">
					Add New Transaction
				</Typography>
				<Box component="form" onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item xs={6} md={6} lg={3}>
							<TextField
								sx={{ m: 2, mb: 0 }}
								id="outlined-basic"
								label="Amount"
								type="number"
								size="small"
								name="amount"
								variant="outlined"
								value={form.amount}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={6} md={6} lg={3}>
							<TextField
								sx={{ m: 2, mb: 0 }}
								id="outlined-basic"
								label="Description"
								size="small"
								name="description"
								variant="outlined"
								value={form.description}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={6} md={6} lg={3}>
							{" "}
							<Autocomplete
								value={getCategoryNameById()}
								onChange={(event, newValue) => {
									setForm({ ...form, categoryId: newValue._id });
								}}
								options={categories}
								id="controllable-states-demo"
								sx={{ m: 2, mb: 0, maxWidth: 210 }}
								renderInput={(params) => (
									<TextField {...params} size="small" label="Category" />
								)}
							/>
						</Grid>
						<Grid item xs={6} md={6} lg={3}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DesktopDatePicker
									label="Transaction Date"
									inputFormat="DD/MM/YYYY"
									value={form.date}
									onChange={handleDate}
									renderInput={(params) => (
										<TextField
											sx={{ m: 2, mb: 0, maxWidth: 210 }}
											size="small"
											{...params}
										/>
									)}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item xs={6} md={6} lg={3} sx={{ m: 2, mb: 0 }}>
							{editTransaction.amount ? (
								<Button type="submit" variant="contained" color="warning">
									Update
								</Button>
							) : (
								<Button
									type="submit"
									color="success"
									variant="contained"
									sx={{ background: "#85bb65" }}
								>
									Submit
								</Button>
							)}
						</Grid>
					</Grid>
				</Box>
				<Collapse in={!!success}>
					<Alert
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setShowAlert({ ...showAlert, success: false });
								}}
							>
								<CloseIcon fontSize="inherit" />
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
	);
}
