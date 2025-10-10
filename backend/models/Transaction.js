// server/models/Transaction.js

const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    // Reference to the User (Foreign Key equivalent)
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Links this transaction to a User document
        required: true
    },
    // Transaction Details
    type: {
        type: String,
        enum: ['income', 'expense'], // Ensures only valid types are used
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please add some text']
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive or negative number']
    },
    category: {
        type: String,
        default: 'Other',
        required: [true, 'Please select a category']
    },
    date: {
        type: Date,
        default: Date.now // Use a date input for more accurate tracking
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);