// external imports
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// internal import
const User = require('../models/User.js');

let opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

const passportConfig = (passport) => {
	passport.use(
		new JwtStrategy(opts, function (jwt_payload, done) {
			User.findById(jwt_payload._id, function (err, user) {
				if (err) {
					return done(err, false);
				}
				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		})
	);
};

module.exports = passportConfig;