// frontend-vite/src/components/TransactionForm.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTransaction } from '../features/transactions/transactionSlice';

function TransactionForm() {
    const [formData, setFormData] = useState({
        type: 'expense',
        description: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().substring(0, 10),
    });

    const dispatch = useDispatch();
    const { type, description, amount, category, date } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value, }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount) { alert('Please add a description and amount.'); return; }
        
        // --- CRITICAL CORRECTION HERE ---
        // 1. Create a new Date object from the YYYY-MM-DD string
        const dateObject = new Date(date);
        
        dispatch(createTransaction({ 
            type,
            description,
            amount: Number(amount),
            category,
            date: dateObject, // <-- Send the full Date object
        }));
        // ---------------------------------
        
        // Reset form state...
        setFormData({ type: 'expense', description: '', amount: '', category: 'Other', date: new Date().toISOString().substring(0, 10) });
    };

    return (
        <div className='p-6 bg-white rounded-lg shadow-xl'>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Add New Transaction</h2>
            <form onSubmit={onSubmit}>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='col-span-1 mb-4'>
                        <label className='block text-sm font-medium text-gray-700'>Type</label>
                        <select name='type' value={type} onChange={onChange} className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'>
                            <option value='expense'>Expense</option>
                            <option value='income'>Income</option>
                        </select>
                    </div>

                    <div className='col-span-1 mb-4'>
                        <label className='block text-sm font-medium text-gray-700'>Amount ($)</label>
                        <input type='number' name='amount' value={amount} onChange={onChange} placeholder='e.g., 5.50 or 2000' className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500' />
                    </div>
                </div>
                
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Description</label>
                    <input type='text' name='description' value={description} onChange={onChange} placeholder='Enter description' className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500' />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div className='col-span-1 mb-4'>
                        <label className='block text-sm font-medium text-gray-700'>Category</label>
                        <select name='category' value={category} onChange={onChange} className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'>
                            <option value='Salary'>Salary (Income)</option>
                            <option value='Food & Dining'>Food & Dining</option>
                            <option value='Housing'>Housing (Rent/Mortgage)</option>
                            <option value='Transportation'>Transportation</option>
                            <option value='Entertainment'>Entertainment</option>
                            <option value='Utilities'>Utilities</option>
                            <option value='Other'>Other</option>
                        </select>
                    </div>
                    <div className='col-span-1 mb-4'>
                        <label className='block text-sm font-medium text-gray-700'>Date</label>
                        <input type='date' name='date' value={date} onChange={onChange} className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500' />
                    </div>
                </div>

                <button type='submit' className='w-full p-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition'>
                    Add Transaction
                </button>
            </form>
        </div>
    );
}

export default TransactionForm;