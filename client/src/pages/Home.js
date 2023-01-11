// external imports
import { useCallback, useEffect, useState } from "react";
import { Container } from "@mui/material";
import Cookies from "js-cookie";

// internal imports
import TransactionForm from "../components/TransactionForm";
import TransactionsList from "../components/TransactionList";
import Copyright from "../components/Copyright";

export default function Home() {
	const [transactions, setTransactions] = useState([]);
	const [editTransaction, setEditTransaction] = useState({});

	const fetchTransactions = useCallback(async () => {
		const token = Cookies.get("token");
		const res = await fetch(`${process.env.REACT_APP_API_BASE}/transaction`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (res.ok) {
			const { data } = await res.json();
			setTransactions(data);
		}
	}, []);

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	return (
		<Container>
			<TransactionForm
				fetchTransactions={fetchTransactions}
				editTransaction={editTransaction}
				setEditTransaction={setEditTransaction}
			/>

			<TransactionsList
				data={transactions}
				fetchTransactions={fetchTransactions}
				setEditTransaction={setEditTransaction}
			/>

			<Copyright sx={{ mb: 2, mt: 5 }} />
		</Container>
	);
}
