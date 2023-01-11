// external imports
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	IconButton,
	Collapse,
	Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";

// internal import
import { setUser } from "../redux/auth.js";

const InitialForm = { label: "" };

export default function CategoryForm({ editCategory, setEditCategory }) {
	const [form, setForm] = useState(InitialForm);
	const [showAlert, setShowAlert] = useState({
		warning: "",
		failed: "",
		success: ""
	});

	const dispatch = useDispatch();
	const token = Cookies.get("token");
	const { user } = useSelector((state) => state.auth);

	const reload = (res, _user) => {
		if (res.ok) {
			dispatch(setUser(_user));
			setEditCategory(InitialForm);
			setForm(InitialForm);
		}
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!form.label) {
			setShowAlert({
				...showAlert,
				warning: "Category Name Cannot Be Empty.",
				failed: "",
				success: ""
			});
			return;
		}
		let cat = user.categories.find((category) => category.label === form.label);
		if (cat) {
			setShowAlert({
				...showAlert,
				warning: "Category Already Exists.",
				failed: "",
				success: ""
			});
			setForm(InitialForm);
			return;
		}
		editCategory._id ? update() : create();
	};

	const create = async () => {
		try {
			const res = await fetch(`${process.env.REACT_APP_API_BASE}/category`, {
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
				const _user = {
					...user,
					categories: [...user.categories, { ...form }]
				};
				reload(res, _user);
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
				`${process.env.REACT_APP_API_BASE}/category/${editCategory._id}`,
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
				const _user = {
					...user,
					categories: user.categories.map((cat) =>
						cat._id === editCategory._id ? form : cat
					)
				};
				reload(res, _user);
				setShowAlert({ warning: "", failed: "", success: message });
			} else {
				throw Error(error);
			}
		} catch (err) {
			setShowAlert({ ...showAlert, failed: "Something Went Wrong." });
		}
	};

	useEffect(() => {
		if (editCategory._id) {
			setForm(editCategory);
		}
	}, [editCategory]);

	const { warning, failed, success } = showAlert;

	return (
		<Card sx={{ maxWidth: 400, mt: 5 }}>
			<CardContent>
				<Typography variant="h6" align="center" sx={{ mb: 2 }}>
					Add New Category
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ display: "flex" }}>
					<TextField
						id="outlined-basic"
						label="Category Name"
						type="text"
						size="small"
						name="label"
						variant="outlined"
						fullWidth
						value={form.label}
						onChange={handleChange}
					/>

					{editCategory._id ? (
						<>
							<Button
								type="submit"
								variant="contained"
								color="warning"
								sx={{ ml: 3 }}
							>
								Update
							</Button>
							<Button
								onClick={() => {
									setEditCategory(InitialForm);
									setForm(InitialForm);
								}}
								variant="contained"
								color="error"
								sx={{ ml: 2 }}
							>
								Cancel
							</Button>
						</>
					) : (
						<Button
							type="submit"
							color="success"
							variant="contained"
							sx={{ ml: 8, background: "#85bb65" }}
						>
							Submit
						</Button>
					)}
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
				<Collapse in={!!warning}>
					<Alert
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setShowAlert({ ...showAlert, warning: false });
								}}
							>
								<CloseIcon fontSize="inherit" />
							</IconButton>
						}
						severity="warning"
						sx={{ mt: 3 }}
					>
						{warning}
					</Alert>
				</Collapse>
				{failed && (
					<Alert severity="error" sx={{ mt: 3 }}>
						{failed}
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
