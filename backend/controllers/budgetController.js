// server/controllers/budgetController.js

const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');

// @desc    Get all budgets for the logged-in user
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
    // Only fetch budgets where userId matches the logged-in user's ID
    const budgets = await Budget.find({ userId: req.user.id }).sort({ startDate: -1 });

    res.status(200).json({
        success: true,
        data: budgets
    });
});

// @desc    Add a new budget
// @route   POST /api/budgets
// @access  Private
const addBudget = asyncHandler(async (req, res) => {
    const { category, limitAmount, timePeriod, startDate, endDate } = req.body;

    if (!category || !limitAmount || !timePeriod || !startDate || !endDate) {
        res.status(400);
        throw new Error('Please include all required fields for the budget.');
    }

    // Include the userId from the authenticated request
    const budget = await Budget.create({
        userId: req.user.id,
        category,
        limitAmount,
        timePeriod,
        startDate,
        endDate
    });

    res.status(201).json({
        success: true,
        data: budget
    });
});

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
        res.status(404);
        throw new Error('Budget not found');
    }

    // Security check: Ensure the budget belongs to the user
    if (budget.userId.toString() !== req.user.id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this budget.');
    }

    await Budget.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = asyncHandler(async (req, res) => {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
        res.status(404);
        throw new Error('Budget not found');
    }

    // Security check: Ensure the budget belongs to the user
    if (budget.userId.toString() !== req.user.id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this budget.');
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: budget
    });
});

module.exports = {
    getBudgets,
    addBudget,
    deleteBudget,
    updateBudget,
};