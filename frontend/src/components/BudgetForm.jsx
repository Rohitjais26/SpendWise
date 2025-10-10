// frontend-vite/src/components/BudgetForm.jsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createBudget, reset } from '../features/budgets/budgetSlice';
import { toast } from 'react-toastify'; 

// Helper function to calculate the end of the current month (for default endDate)
const getMonthEnd = (dateStr) => {
    const start = new Date(dateStr);
    const nextMonth = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const end = new Date(nextMonth.getTime() - 1);
    return end.toISOString().substring(0, 10);
};

function BudgetForm() {
    const today = new Date().toISOString().substring(0, 10);
    const dispatch = useDispatch();
    
    // Get state from Redux for feedback
    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.budgets);

    const [formData, setFormData] = useState({
        category: 'Food & Dining',
        limitAmount: '', // <-- CRITICAL FIX: Changed from 'limit'
        timePeriod: 'monthly', // <-- CRITICAL FIX: Changed from 'duration'
        startDate: today, // <-- ADDED REQUIRED FIELD
        endDate: getMonthEnd(today), // <-- ADDED REQUIRED FIELD
    });

    const { category, limitAmount, timePeriod, startDate, endDate } = formData; 

    // Handle success/error feedback
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        
        if (isSuccess && !isLoading) {
            toast.success('Budget goal created successfully!'); 
            // Reset form state after success
            setFormData({ 
                category: 'Food & Dining', 
                limitAmount: '', 
                timePeriod: 'monthly',
                startDate: today,
                endDate: getMonthEnd(today),
            });
        }
        
        dispatch(reset()); 
    }, [isError, isSuccess, message, isLoading, dispatch]);

    const onChange = (e) => {
        const { name, value } = e.target;
        
        setFormData((prevState) => {
            let newState = { ...prevState, [name]: value };

            if ((name === 'startDate' || name === 'timePeriod') && newState.timePeriod === 'monthly') {
                newState.endDate = getMonthEnd(newState.startDate);
            }
            return newState;
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        if (!limitAmount || limitAmount <= 0) { 
             toast.error('Please set a valid budget limit amount.'); 
             return; 
        }

        // Dispatch payload uses the correct backend keys
        dispatch(createBudget({ 
            category, 
            limitAmount: Number(limitAmount),
            timePeriod,
            startDate,
            endDate
        }));
    };

    if (isLoading) {
        return <h3 className='text-center text-lg text-gray-600'>Creating Budget...</h3>;
    }

    return (
        <div className='p-6 bg-white rounded-lg shadow-xl'>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Set New Budget Goal</h2>
            <form onSubmit={onSubmit}>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Category</label>
                    <select name='category' value={category} onChange={onChange} className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'>
                        <option value='Food & Dining'>Food & Dining</option>
                        <option value='Housing'>Housing (Rent/Mortgage)</option>
                        <option value='Transportation'>Transportation</option>
                        <option value='Entertainment'>Entertainment</option>
                        <option value='Utilities'>Utilities</option>
                        <option value='Other'>Other Expenses</option>
                    </select>
                </div>

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Budget Limit ($)</label>
                    <input type='number' name='limitAmount' value={limitAmount} onChange={onChange} placeholder='e.g., 500' className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500' />
                </div>
                
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Start Date</label>
                    <input type='date' name='startDate' value={startDate} onChange={onChange} className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500' />
                </div>

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>End Date</label>
                    <input type='date' name='endDate' value={endDate} readOnly onChange={onChange} className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 cursor-not-allowed' />
                </div>

                <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700'>Duration</label>
                    <select name='timePeriod' value={timePeriod} onChange={onChange} className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'>
                        <option value='monthly'>Monthly</option>
                        <option value='weekly'>Weekly</option>
                    </select>
                </div>

                <button type='submit' className='w-full p-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition' disabled={isLoading}>
                    Create Budget Goal
                </button>
            </form>
        </div>
    );
}

export default BudgetForm;