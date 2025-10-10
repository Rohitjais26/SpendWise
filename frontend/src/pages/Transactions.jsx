// frontend-vite/src/pages/Transactions.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactions, reset } from '../features/transactions/transactionSlice';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionItem from '../components/TransactionItem.jsx';
import { toast } from 'react-toastify'; // <-- ADD THIS IMPORT

function Transactions() {
    const dispatch = useDispatch();
    const { transactions, isLoading, isError, message } = useSelector((state) => state.transactions);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) { 
            toast.error(message); // <-- REPLACED alert()
        }
        // Fetch transactions when the component mounts
        dispatch(getTransactions());

        return () => { dispatch(reset()); };
    }, [dispatch, isError, message]);


    if (isLoading) { return <h1 className='text-center text-xl mt-10'>Loading Transactions...</h1>; }

    return (
        <>
            <section className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-gray-800'>{user?.name}'s Transactions</h1>
                <p className='text-gray-500 mt-1'>Manage all your income and expenses here.</p>
            </section>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {/* Column 1: Form to Add Transaction */}
                <div className='md:col-span-1'>
                    <TransactionForm />
                </div>

                {/* Column 2: List of Transactions */}
                <div className='md:col-span-2 p-6 bg-white rounded-lg shadow-xl'>
                    <h2 className='text-2xl font-semibold mb-4 border-b pb-2 text-gray-800'>Transaction History ({transactions.length})</h2>
                    {transactions.length > 0 ? (
                        <ul className='divide-y divide-gray-200'>
                            {transactions.map((transaction) => (
                                <TransactionItem key={transaction._id} transaction={transaction} />
                            ))}
                        </ul>
                    ) : (
                        <p className='text-gray-500 p-4 text-center'>You have no recorded transactions yet. Start tracking!</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Transactions;