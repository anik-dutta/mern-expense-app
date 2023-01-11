// external imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

// internal imports
const passportConfig = require("./configs/passport.js");
const connectDB = require("./configs/db.js");
const apiRoutes = require("./routes/apiRoutes.js");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

passportConfig(passport);

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use("/", apiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`);
});
