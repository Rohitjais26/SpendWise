// frontend-vite/src/components/TransactionItem.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransaction, updateTransaction } from '../features/transactions/transactionSlice'; // <-- Import updateTransaction

function TransactionItem({ transaction }) {
    const dispatch = useDispatch();
    
    // State to toggle between display mode and edit mode
    const [isEditing, setIsEditing] = useState(false);
    
    // State to hold the transaction data during editing
    const [formData, setFormData] = useState({
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        // Format the date string correctly for the input type='date'
        date: new Date(transaction.date).toISOString().substring(0, 10),
    });

    const isIncome = transaction.type === 'income';

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(transaction.amount);

    const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    });
    
    const onChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value, }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.description || !formData.amount) {
            alert('Description and amount are required.');
            return;
        }

        // Prepare data: convert amount to number and date string to Date object
        const updatedData = {
            ...formData,
            amount: Number(formData.amount),
            date: new Date(formData.date),
        };
        
        // Dispatch the update action
        dispatch(updateTransaction({ id: transaction._id, transactionData: updatedData }));
        
        // Exit edit mode
        setIsEditing(false);
    };

    // --- Render Edit Form if in Edit Mode ---
    if (isEditing) {
        return (
            <li className='p-4 bg-yellow-50 rounded-lg shadow-inner mb-2'>
                <form onSubmit={onSubmit}>
                    <div className='grid grid-cols-6 gap-2 items-center'>
                        {/* Type */}
                        <select name='type' value={formData.type} onChange={onChange} className='p-1 border rounded-md'>
                            <option value='expense'>Expense</option>
                            <option value='income'>Income</option>
                        </select>
                        
                        {/* Description */}
                        <input type='text' name='description' value={formData.description} onChange={onChange} className='p-1 border rounded-md col-span-2' />
                        
                        {/* Amount */}
                        <input type='number' name='amount' value={formData.amount} onChange={onChange} className='p-1 border rounded-md' />
                        
                        {/* Category */}
                        <select name='category' value={formData.category} onChange={onChange} className='p-1 border rounded-md'>
                            <option value='Salary'>Salary (Income)</option>
                            <option value='Food & Dining'>Food & Dining</option>
                            <option value='Housing'>Housing (Rent/Mortgage)</option>
                            <option value='Transportation'>Transportation</option>
                            <option value='Entertainment'>Entertainment</option>
                            <option value='Utilities'>Utilities</option>
                            <option value='Other'>Other</option>
                        </select>

                        {/* Date */}
                        <input type='date' name='date' value={formData.date} onChange={onChange} className='p-1 border rounded-md' />
                        
                        {/* Save Button */}
                        <button type='submit' className='p-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition'>
                            Save
                        </button>

                        {/* Cancel Button */}
                        <button type='button' onClick={() => setIsEditing(false)} className='p-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition'>
                            Cancel
                        </button>
                    </div>
                </form>
            </li>
        );
    }
    
    // --- Render Display Mode ---
    return (
        <li className={`flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition duration-150 group ${isIncome ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
            
            <div className='flex-grow'>
                <p className='font-semibold text-gray-800'>{transaction.description}</p>
                <p className='text-xs text-gray-500'>{transaction.category} • {formattedDate}</p>
            </div>
            
            <div className='flex items-center space-x-3'>
                <span className={`text-lg font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'} {formattedAmount}
                </span>
                
                {/* NEW: Edit Button */}
                <button 
                    onClick={() => setIsEditing(true)} 
                    className='opacity-0 group-hover:opacity-100 p-1 bg-blue-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center transition duration-200'
                    title='Edit Transaction'
                >
                    {/* SVG for edit icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 18.07a4.912 4.912 0 0 1-1.487.795.75.75 0 0 0-.671.97l-.8 2.399h12a.75.75 0 0 0 .75-.75V11.25a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v5.474l-6.236-6.236Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 13.5H3.75a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 0 0-1.5h-1.5a2.25 2.25 0 0 0-2.25 2.25v9.75a2.25 2.25 0 0 0 2.25 2.25h9.75a.75.75 0 0 0 0-1.5Z" />
                    </svg>
                </button>
                {/* END NEW */}

                <button 
                    onClick={() => dispatch(deleteTransaction(transaction._id))} 
                    className='opacity-0 group-hover:opacity-100 p-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center transition duration-200'
                    title='Delete Transaction'
                >
                    x
                </button>
            </div>
        </li>
    );
}

export default TransactionItem;