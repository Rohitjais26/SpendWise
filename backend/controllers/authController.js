const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Function to generate JWT
const generateToken = (id) => {
    // Uses the JWT_SECRET from the .env file
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', 
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please enter all fields: name, email, and password.');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists.');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data.');
    }
});

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // CRITICAL: We must explicitly SELECT the password hash here
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists AND if the password matches the stored hash
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        // This is the generic error for security
        res.status(401); 
        throw new Error('Invalid email or password.'); 
    }
});

module.exports = { registerUser, loginUser };
