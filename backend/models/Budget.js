// server/models/Budget.js

const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    // Reference to the User
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    // Budget Details
    category: {
        type: String,
        required: [true, 'Please specify a budget category']
    },
    limitAmount: {
        type: Number,
        required: [true, 'Please set a budget limit']
    },
    timePeriod: {
        type: String,
        enum: ['monthly', 'weekly', 'yearly'], // Defines how the budget recurs
        default: 'monthly'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Budget', BudgetSchema);