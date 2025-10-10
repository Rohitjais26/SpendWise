// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// The 'protect' middleware runs first, verifying the token before 'getMe' executes
router.get('/me', protect, getMe); 

module.exports = router;