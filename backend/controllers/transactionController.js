// server/controllers/transactionController.js

const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
    // Only fetch transactions where userId matches the logged-in user's ID
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });

    res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions
    });
});

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = asyncHandler(async (req, res) => {
    const { type, description, amount, category, date } = req.body;

    if (!description || !amount || !category || !type) {
        res.status(400);
        throw new Error('Please include all required fields.');
    }

    // Include the userId from the authenticated request
    const transaction = await Transaction.create({
        userId: req.user.id,
        type,
        description,
        amount,
        category,
        date: date || Date.now() // Use provided date or current date
    });

    res.status(201).json({
        success: true,
        data: transaction
    });
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Security check: Ensure the transaction belongs to the user
    if (transaction.userId.toString() !== req.user.id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this transaction.');
    }

    await Transaction.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        data: {} // Return empty object for successful deletion
    });
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Security check: Ensure the transaction belongs to the user
    if (transaction.userId.toString() !== req.user.id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this transaction.');
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
    });

    res.status(200).json({
        success: true,
        data: transaction
    });
});

module.exports = {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
};