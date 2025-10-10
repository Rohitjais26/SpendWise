// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check for the token in the headers
    // Format: Authorization: 'Bearer TOKEN'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Get user from the token payload (excluding password hash)
            // The decoded object contains the user ID ({ id: '...' })
            req.user = await User.findById(decoded.id).select('-password');

            // Move to the next middleware or route handler
            next();

        } catch (error) {
            console.error(error);
            res.status(401); // 401 Unauthorized
            throw new Error('Not authorized, token failed.');
        }
    }

    // 4. Handle case where no token is provided
    if (!token) {
        res.status(401); // 401 Unauthorized
        throw new Error('Not authorized, no token.');
    }
});

module.exports = { protect };