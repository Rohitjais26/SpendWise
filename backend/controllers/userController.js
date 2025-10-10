// server/controllers/userController.js

const asyncHandler = require('express-async-handler');

// @desc    Get user profile data
// @route   GET /api/users/me
// @access  Private (requires token)
const getMe = asyncHandler(async (req, res) => {
    // req.user is available here because of the 'protect' middleware!
    res.status(200).json(req.user);
});

module.exports = { getMe };