import React from 'react';

function BudgetProgress({ budget, transactions }) {
    // 1. Determine the relevant date range from the budget
    const budgetStartDate = new Date(budget.startDate);
    const budgetEndDate = new Date(budget.endDate);

    // 2. Filter transactions to match the category, type, and date range
    const spentAmount = transactions
        .filter(tx => tx.type === 'expense') // Only count expenses
        .filter(tx => tx.category === budget.category) // Match budget category
        .filter(tx => {
            const txDate = new Date(tx.date);
            // Ensure transaction date is within the budget period (inclusive)
            return txDate >= budgetStartDate && txDate <= budgetEndDate;
        })
        .reduce((sum, tx) => sum + tx.amount, 0); // Sum the amounts

    // CRITICAL FIX: Use 'limitAmount' from the Mongoose model
    const limitAmount = budget.limitAmount; 
    const percentage = Math.min(100, (spentAmount / limitAmount) * 100);
    const remaining = limitAmount - spentAmount;

    // Determine color based on progress
    let barColor = 'bg-blue-500'; // Safe
    if (percentage >= 75 && percentage < 100) {
        barColor = 'bg-yellow-500'; // Warning
    } else if (percentage >= 100) {
        barColor = 'bg-red-500'; // Over budget
    }
    
    const formattedSpent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(spentAmount);
    const formattedLimit = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(limitAmount);
    const formattedRemaining = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(remaining);

    return (
        <div className='p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-200'>
            <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-semibold text-gray-800'>{budget.category} Budget</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${percentage >= 100 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {percentage >= 100 ? 'OVER' : 'ACTIVE'}
                </span>
            </div>

            <div className='text-sm text-gray-600 mb-1'>
                <span className='font-medium'>Spent:</span> {formattedSpent} / {formattedLimit}
            </div>

            {/* Progress Bar */}
            <div className='w-full bg-gray-200 rounded-full h-2.5 mb-2'>
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <div className='flex justify-between text-xs text-gray-500'>
                <span>{percentage.toFixed(1)}% Used</span>
                <span className={remaining < 0 ? 'text-red-500 font-bold' : ''}>
                    {remaining >= 0 ? `Remaining: ${formattedRemaining}` : `Overspent: ${formattedRemaining.replace('-', '')}`}
                </span>
            </div>
        </div>
    );
}

export default BudgetProgress;
