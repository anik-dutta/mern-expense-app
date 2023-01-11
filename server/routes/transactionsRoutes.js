// extenal import
const { Router } = require("express");

// internal imports
const {
	index,
	create,
	destroy,
	update
} = require("../controllers/transactionController.js");

const router = Router();

router.get("/", index);
router.post("/", create);
router.delete("/:id", destroy);
router.patch("/:id", update);

module.exports = router;
