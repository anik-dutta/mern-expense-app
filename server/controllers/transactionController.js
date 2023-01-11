const Transaction = require("../models/Transaction.js");

const index = async (req, res) => {
	try {
		const transactions = await Transaction.find({
			userId: req.user._id
		}).sort({ createdAt: -1 });

		res.status(200).send({ data: transactions });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const create = async (req, res) => {
	try {
		const { amount, description, date, categoryId } = req.body;

		const transaction = new Transaction({
			amount,
			description: description ? description : undefined,
			date,
			userId: req.user._id,
			categoryId
		});
		await transaction.save();

		res.json({ message: "Transaction Added Successfully." });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const destroy = async (req, res) => {
	try {
		await Transaction.findByIdAndDelete(req.params.id);
		res.json({ message: "Transaction Deleted Successfully." });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const update = async (req, res) => {
	try {
		if (!req.body.description) {
			req.body.description = "Miscellaneous";
		}

		await Transaction.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);
		res.json({ message: "Updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { index, create, destroy, update };
