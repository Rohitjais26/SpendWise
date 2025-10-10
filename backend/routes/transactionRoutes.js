// server/routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// /api/transactions routes
router.route('/')
    .get(protect, getTransactions) // Read all
    .post(protect, addTransaction); // Create

// /api/transactions/:id routes
router.route('/:id')
    .put(protect, updateTransaction) // Update
    .delete(protect, deleteTransaction); // Delete

module.exports = router;