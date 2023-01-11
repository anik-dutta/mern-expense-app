// extenal import
const { Router } = require("express");

// internal imports
const { login, register } = require("../controllers/authController.js");

const router = Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
