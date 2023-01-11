const mongoose = require("mongoose");

// creating schema
const transactionSchema = new mongoose.Schema({
	amount: { type: Number, required: true },
	description: { type: String, default: "Miscellaneous" },
	userId: mongoose.Types.ObjectId,
	categoryId: mongoose.Types.ObjectId,
	date: Date,
	createdAt: { type: Date, default: new Date() }
});

// creating model;
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
