// frontend-vite/src/components/BudgetItem.jsx

import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteBudget } from '../features/budgets/budgetSlice';

function BudgetItem({ budget }) {
    const dispatch = useDispatch();

    const formattedLimit = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    // CRITICAL FIX: Use 'limitAmount'
    }).format(budget.limitAmount); 
    
    // Note: Spent logic would go here in a final version, but we only display limit for now.
    
    return (
        <li className='flex justify-between items-center p-3 border-b  last:border-b-0 hover:bg-gray-50 transition duration-150 group border-l-4 border-blue-500'>
            
            <div className='flex-grow'>
                <p className='font-semibold text-gray-800'>{budget.category} Budget</p>
                {/* CRITICAL FIX: Use 'timePeriod' */}
                <p className='text-xs text-gray-500'>Goal: {budget.timePeriod} limit</p> 
            </div>
            
            <div className='flex items-center space-x-3'>
                <span className='text-lg font-bold text-blue-600'>
                    {formattedLimit}
                </span>

                <button 
                    onClick={() => dispatch(deleteBudget(budget._id))} 
                    className='opacity-0 group-hover:opacity-100 p-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center transition duration-200'
                >
                    x
                </button>
            </div>
        </li>
    );
}

export default BudgetItem;