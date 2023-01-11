// external imports
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import Cookies from "js-cookie";

// internal import
import { logout } from "../redux/auth.js";

export default function ButtonAppBar() {
	const { isAuthenticated, user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const signout = () => {
		Cookies.remove("token");
		dispatch(logout());
		navigate("/login", { replace: true });
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				position="static"
				sx={{ color: "#880808", background: "#85bb65" }}
			>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						<Link className="text-white" to="/">
							Xpense Assistant
						</Link>
					</Typography>

					{isAuthenticated ? (
						<>
							<Link to="/profile" className="text-white">
								<Button color="inherit">
									{user.firstName} {user.lastName}
								</Button>
							</Link>
							<Link to="/category" className="text-white">
								<Button color="inherit">Category</Button>
							</Link>
							<Button color="inherit" onClick={signout}>
								Logout
							</Button>
						</>
					) : (
						<>
							<Link to="/login" className="text-white">
								<Button color="inherit">Sign In</Button>
							</Link>
							<Link to="/register" className="text-white">
								<Button color="inherit">Sign Up</Button>
							</Link>
						</>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
