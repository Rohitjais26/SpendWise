import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBudgets, reset as resetBudgets } from '../features/budgets/budgetSlice';
import { getTransactions, reset as resetTransactions } from '../features/transactions/transactionSlice';
import BudgetProgress from '../components/BudgetProgress.jsx'; 
import BudgetForm from '../components/BudgetForm.jsx'; // <-- CORRECT IMPORT
import { toast } from 'react-toastify'; // For error handling

function Budgets() {
    const dispatch = useDispatch();
    const { budgets, isLoading: isBudgetsLoading, isError: isBudgetsError, message: budgetMessage } = useSelector((state) => state.budgets);
    const { transactions, isLoading: isTxsLoading, isError: isTxsError, message: txMessage } = useSelector((state) => state.transactions);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isBudgetsError) { toast.error(budgetMessage); }
        if (isTxsError) { toast.error(txMessage); }

        dispatch(getBudgets());
        dispatch(getTransactions());

        return () => { 
            dispatch(resetBudgets());
            dispatch(resetTransactions());
        };
    }, [dispatch, isBudgetsError, isTxsError, budgetMessage, txMessage]);

    // *** PLACEHOLDER FUNCTION REMOVED ***

    if (isBudgetsLoading || isTxsLoading) { 
        return <h1 className='text-center text-xl mt-10'>Loading Budget Data...</h1>; 
    }

    return (
        <>
            <section className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-gray-800'>{user?.name}'s Budget Goals 🎯</h1>
                <p className='text-gray-500 mt-1'>Real-time tracking of your spending limits.</p>
            </section>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {/* Column 1: Budget Form - Renders the functional form */}
                <div className='md:col-span-1'>
                    <BudgetForm /> 
                </div>

                {/* Column 2: List of Budget Progress */}
                <div className='md:col-span-2 p-6 bg-white rounded-lg shadow-xl'>
                    <h2 className='text-2xl font-semibold mb-4 border-b pb-2 text-gray-800'>Active Budget Progress ({budgets.length})</h2>
                    <div className='space-y-4'>
                        {budgets.length > 0 ? (
                            budgets.map((budget) => (
                                <BudgetProgress 
                                    key={budget._id} 
                                    budget={budget} 
                                    transactions={transactions} 
                                />
                            ))
                        ) : (
                            <p className='text-gray-500 p-4 text-center'>No active budget goals. Set your limits!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Budgets;