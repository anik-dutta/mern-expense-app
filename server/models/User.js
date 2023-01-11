const mongoose = require("mongoose");

// creating schema
const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: ["First name field is required"] },
		lastName: { type: String, required: ["Last name field is required"] },
		email: { type: String, required: ["Email field is required"] },
		password: { type: String, required: ["Password field is required"] },
		categories: [
			{
				label: { type: String, unique: true },
				date: { type: Date, default: new Date() }
			}
		]
	},
	{ timestamps: true }
);

// creating model;
const User = mongoose.model("User", userSchema);
module.exports = User;
