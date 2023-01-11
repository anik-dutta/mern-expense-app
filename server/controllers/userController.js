const User = require("../models/User.js");
const { hashPassword } = require("../utils/encryptPassword");

const user = (req, res) => {
	res.json({ user: req.user });
};

const profile = async (req, res) => {
	try {
		const { firstName, lastName, password } = req.body;

		const hashedPassword = await hashPassword(password);

		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ firstName, lastName, password: hashedPassword },
			{ new: true }
		).select({ __v: 0, updatedAt: 0, createdAt: 0, password: 0 });

		res.json({ message: "Profile Updated Successfully.", _user: user });
	} catch (error) {
		res.json({ error: error });
	}
};

module.exports = { user, profile };
