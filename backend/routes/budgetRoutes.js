// server/routes/budgetRoutes.js

const express = require('express');
const router = express.Router();
const {
    getBudgets,
    addBudget,
    deleteBudget,
    updateBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

// /api/budgets routes
router.route('/')
    .get(protect, getBudgets) // Read all
    .post(protect, addBudget); // Create

// /api/budgets/:id routes
router.route('/:id')
    .put(protect, updateBudget) // Update
    .delete(protect, deleteBudget); // Delete

module.exports = router;