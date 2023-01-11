const jwt = require('jsonwebtoken');

const generateAuthToken = (payload, remember) => {
    let cookieParams = { expiresIn: '7d' };
    if (remember) {
        cookieParams.expiresIn = '30d';
    }

    return jwt.sign(payload, process.env.JWT_SECRET, cookieParams);
};

module.exports = { generateAuthToken };