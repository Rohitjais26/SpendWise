// server/routes/dataRoutes.js

const express = require('express');
const router = express.Router();
const {
    getSpendingByCategory,
    getMonthlyTrend
} = require('../controllers/dataController');
const { protect } = require('../middleware/authMiddleware');

// All data visualization endpoints are private
router.get('/spending-by-category', protect, getSpendingByCategory);
router.get('/monthly-trend', protect, getMonthlyTrend);

module.exports = router;