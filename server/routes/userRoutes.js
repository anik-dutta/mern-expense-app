// extenal import
const { Router } = require("express");

// internal imports
const { user, profile } = require("../controllers/userController.js");

const router = Router();

router.get("/", user);
router.patch("/:id", profile);

module.exports = router;
