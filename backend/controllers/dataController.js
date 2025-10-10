/// server/controllers/dataController.js

const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get spending summary by category
// @route   GET /api/data/spending-by-category
// @access  Private
const getSpendingByCategory = asyncHandler(async (req, res) => {
    // 1. Get the current user's ID from the middleware
    const userId = req.user.id;

    const spending = await Transaction.aggregate([
        // 1. Match: Filter for the logged-in user and only 'expense' type
        {
            $match: {
                userId: userId,
                type: 'expense'
            }
        },
        // 2. Group: Group the filtered documents by category
        {
            $group: {
                _id: '$category', // Group by the 'category' field
                total: { $sum: '$amount' } // Calculate the sum of 'amount' for each group
            }
        },
        // 3. Sort: Sort the results by the total amount (optional, for better visualization order)
        {
            $sort: { total: -1 }
        }
    ]);

    res.status(200).json({
        success: true,
        data: spending
    });
});

// @desc    Get monthly income vs. expense trend
// @route   GET /api/data/monthly-trend
// @access  Private
const getMonthlyTrend = asyncHandler(async (req, res) => {
   
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const trend = await Transaction.aggregate([
        // 1. Match: Filter by user ID
        {
            $match: {
                userId: userId,
            }
        },
        // 2. Project: Extract year and month from the date field
        {
            $project: {
                yearMonth: { $dateToString: { format: '%Y-%m', date: '$date' } },
                amount: '$amount',
                type: '$type'
            }
        },
        // 3. Group: Group by the combined year/month string and transaction type
        {
            $group: {
                _id: {
                    yearMonth: '$yearMonth',
                    type: '$type'
                },
                total: { $sum: '$amount' }
            }
        },
        // 4. Group (Final): Restructure the data to have income and expense on the same document
        {
            $group: {
                _id: '$_id.yearMonth',
                income: {
                    $sum: {
                        $cond: [ { $eq: ['$_id.type', 'income'] }, '$total', 0 ]
                    }
                },
                expense: {
                    $sum: {
                        $cond: [ { $eq: ['$_id.type', 'expense'] }, '$total', 0 ]
                    }
                }
            }
        },
        // 5. Sort: Ensure the data is in chronological order (optional, but essential for time-series charts)
        {
            $sort: { _id: 1 }
        }
    ]);

    res.status(200).json({
        success: true,
        data: trend
    });
});

module.exports = {
    getSpendingByCategory,
    getMonthlyTrend
};