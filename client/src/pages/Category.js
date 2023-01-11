// external imports
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Container,
	Collapse,
	Alert
} from "@mui/material";
import { ModeEditSharp, DeleteSharp } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import Cookies from "js-cookie";

// internal imports
import CategoryForm from "../components/CategoryForm.js";
import Copyright from "../components/Copyright";
import { setUser } from "../redux/auth.js";

export default function Category() {
	const [editCategory, setEditCategory] = useState({});
	const [showAlert, setShowAlert] = useState({ failed: "", success: "" });

	const dispatch = useDispatch();
	const token = Cookies.get("token");
	const { user } = useSelector((state) => state.auth);

	const remove = async (id) => {
		if (window.confirm('Press "OK" to remove this category')) {
			try {
				const res = await fetch(
					`${process.env.REACT_APP_API_BASE}/category/${id}`,
					{
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);
				const response = await res.json();
				const { message, error } = response;

				if (res.ok) {
					const _user = {
						...user,
						categories: user.categories.filter((cat) => cat._id !== id)
					};
					dispatch(setUser(_user));
					setShowAlert({ warning: "", failed: "", success: message });
				} else {
					throw Error(error);
				}
			} catch (err) {
				setShowAlert({ ...showAlert, failed: "Something Went Wrong." });
			}
		}
		return;
	};

	const formatDate = (date) => {
		return dayjs(date).format("DD MMM, YYYY hh:mm A");
	};

	const setEdit = (category) => {
		setEditCategory(category);
	};

	const { failed, success } = showAlert;

	return (
		<Container align="center">
			<CategoryForm
				editCategory={editCategory}
				setEditCategory={setEditCategory}
			/>
			<Typography variant="h6" align="center" sx={{ mt: 5, mb: 2 }}>
				Category List
			</Typography>
			<TableContainer component={Paper} sx={{ maxWidth: 800 }}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">Name</TableCell>
							<TableCell align="center">Added On</TableCell>
							<TableCell align="center">Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{user?.categories?.map((row, id) => (
							<TableRow
								key={id}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							>
								<TableCell align="center" component="th" scope="row">
									{row.label}
								</TableCell>
								<TableCell align="center">{formatDate(row.date)}</TableCell>
								<TableCell align="center">
									<IconButton
										color="primary"
										component="label"
										onClick={() => setEdit(row)}
									>
										<ModeEditSharp />
									</IconButton>

									<IconButton
										color="warning"
										component="label"
										onClick={() => remove(row._id)}
									>
										<DeleteSharp />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

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
			</TableContainer>

			<Copyright sx={{ mb: 2, mt: 5 }} />
		</Container>
	);
}
