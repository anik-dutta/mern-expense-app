const { Router } = require("express");
const passport = require("passport");

// internal imports
const AuthApi = require("./authRoutes.js");
const UserApi = require("./userRoutes.js");
const TransactionsApi = require("./transactionsRoutes.js");
const CategoryApi = require("./categoryRoutes");

const api = Router();

const auth = passport.authenticate("jwt", { session: false });

api.use("/auth", AuthApi);
api.use("/user", auth, UserApi);
api.use("/category", auth, CategoryApi);
api.use("/transaction", auth, TransactionsApi);

module.exports = api;
