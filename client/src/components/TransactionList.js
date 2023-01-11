import { useState } from "react";
import { useSelector } from "react-redux";
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
	Collapse,
	Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ModeEditSharp, DeleteSharp } from "@mui/icons-material";
import dayjs from "dayjs";
import Cookies from "js-cookie";

export default function TransactionsList({
	data,
	fetchTransactions,
	setEditTransaction
}) {
	const [showAlert, setShowAlert] = useState({ failed: "", success: "" });

	const token = Cookies.get("token");
	const { user } = useSelector((state) => state.auth);

	const remove = async (id) => {
		if (window.confirm('Press "OK" to remove this transaction')) {
			try {
				const res = await fetch(
					`${process.env.REACT_APP_API_BASE}/transaction/${id}`,
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
					fetchTransactions();
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

	const categoryName = (id) => {
		const category = user.categories.find((category) => category._id === id);

		return category ? category.label : "NA";
	};

	const formatDate = (date) => {
		return dayjs(date).format("DD MMM, YYYY hh:mm A");
	};

	const { warning, failed, success } = showAlert;

	return (
		<>
			<Typography variant="h6" align="center" sx={{ mt: 5, mb: 2 }}>
				Transaction List
			</Typography>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">No.</TableCell>
							<TableCell align="center">Amount</TableCell>
							<TableCell align="center">Description</TableCell>
							<TableCell align="center">Category</TableCell>
							<TableCell align="center">Date</TableCell>
							<TableCell align="center">Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.map((row, id) => (
							<TableRow
								key={row._id}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							>
								<TableCell align="center">{id + 1}</TableCell>
								<TableCell align="center" component="th" scope="row">
									{Number(row.amount).toFixed(2)}
								</TableCell>
								<TableCell align="center">{row.description}</TableCell>
								<TableCell align="center">
									{categoryName(row.categoryId)}
								</TableCell>
								<TableCell align="center">{formatDate(row.date)}</TableCell>
								<TableCell align="center">
									<IconButton
										color="primary"
										component="label"
										onClick={() => setEditTransaction(row)}
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
				{warning && (
					<Alert severity="warning" sx={{ mt: 3 }}>
						{warning}
					</Alert>
				)}
			</TableContainer>
		</>
	);
}
