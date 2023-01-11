// extenal import
const { Router } = require("express");

// internal imports
const {
	create,
	destroy,
	update
} = require("../controllers/categoryController");

const router = Router();

router.post("/", create);
router.patch("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
