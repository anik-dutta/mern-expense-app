const User = require("../models/User.js");
const { hashPassword, matchPasswords } = require("../utils/encryptPassword");
const { generateAuthToken } = require("../utils/generateToken");

const categories = [
	{ label: "Travel", date: new Date() },
	{ label: "Shopping", date: new Date() },
	{ label: "Investment", date: new Date() },
	{ label: "Bills", date: new Date() }
];

const register = async (req, res) => {
	try {
		const { email, password, firstName, lastName } = req.body;

		const userExists = await User.findOne({ email });
		if (userExists) {
			res.status(406).json({ error: "User Already Exists." });
			return;
		}

		const hashedPassword = await hashPassword(password);

		const user = new User({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			categories
		});
		await user.save();

		res.status(201).json({ message: "Account Created Successfully." });
	} catch (error) {
		res.json({ error: error });
	}
};

const login = async (req, res) => {
	try {
		const { email, password, rememberMe } = req.body;

		const user = await User.findOne({ email }).select({
			__v: 0,
			updatedAt: 0,
			createdAt: 0
		});
		if (!user) {
			res.status(406).json({ error: "Wrong Credentials." });
			return;
		}

		const matched = await matchPasswords(password, user.password);
		if (!matched) {
			res.status(406).json({ error: "Wrong Credentials." });
			return;
		}

		user.password = "";
		const payload = {
			username: email,
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName
		};

		const token = generateAuthToken(payload, rememberMe);

		res.json({ message: "Succesfully Logged In.", token, user });
	} catch (error) {
		res.json({ error });
	}
};

module.exports = { login, register };
