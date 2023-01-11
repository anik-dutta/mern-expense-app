const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

const matchPasswords = async (inputPassword, hashedPassword) => {
	const passwordMatched = await bcrypt.compare(inputPassword, hashedPassword);
	return passwordMatched;
};

module.exports = { hashPassword, matchPasswords };
