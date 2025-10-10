// frontend-vite/src/pages/Dashboard.jsx

import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getSpendingByCategory, getMonthlyTrend, reset } from '../features/data/dataSlice';
import SpendingChart from '../components/SpendingChart.jsx';
import { toast } from 'react-toastify'; // <-- ADD THIS IMPORT

function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { spendingByCategory, monthlyTrend, isLoading, isError, message } = useSelector(
        (state) => state.data
    );

    useEffect(() => {
    if (!user) { navigate('/login'); } 
    
    if (isError) { 
        toast.error(message); // <-- REPLACED alert()
    }
        // -------------------------
        
        // Dispatch data fetching actions
        dispatch(getSpendingByCategory());
        dispatch(getMonthlyTrend());

        return () => { 
            // This resets the data slice state when the component unmounts
            dispatch(reset()); 
        };

    // isError and message are correctly included in the dependency array
    }, [user, navigate, dispatch, isError, message]);

    // Calculate Summary Stats using useMemo for efficiency
    const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
        let income = 0;
        let expense = 0;
        
        if (monthlyTrend && monthlyTrend.length > 0) {
            // Note: monthlyTrend data structure is [{ _id: 'YYYY-MM', income: X, expense: Y }, ...]
            income = monthlyTrend.reduce((sum, item) => sum + item.income, 0);
            expense = monthlyTrend.reduce((sum, item) => sum + item.expense, 0);
        }
        
        return {
            totalIncome: income,
            totalExpense: expense,
            totalBalance: income - expense,
        };
    }, [monthlyTrend]);


    if (isLoading) { return <h1 className='text-center text-xl mt-10'>Loading Financial Data...</h1>; }

    // --- ADDED: RENDER A VISIBLE ERROR MESSAGE ---
    if (isError) {
        return <h1 className='text-center text-xl mt-10 text-red-600'>ERROR: Could not fetch dashboard data. Please log out and log back in.</h1>;
    }
    // ---------------------------------------------

    // Helper for formatting currency
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <>
            <section className='text-center mb-10'>
                <h1 className='text-4xl font-extrabold text-gray-900'>Welcome, {user?.name} 👋</h1>
                <p className='text-xl text-gray-500 mt-2'>Your Financial Dashboard Overview</p>
            </section>

            {/* Financial Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
                <div className='bg-white p-6 rounded-xl shadow-lg text-center'>
                    <h2 className='text-lg font-medium text-gray-500 mb-2'>Net Balance</h2>
                    <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(totalBalance)}
                    </p>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-lg text-center'>
                    <h2 className='text-lg font-medium text-gray-500 mb-2'>Total Income</h2>
                    <p className='text-3xl font-bold text-blue-600'>
                        {formatCurrency(totalIncome)}
                    </p>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-lg text-center'>
                    <h2 className='text-lg font-medium text-gray-500 mb-2'>Total Expense</h2>
                    <p className='text-3xl font-bold text-red-600'>
                        {formatCurrency(totalExpense)}
                    </p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='md:col-span-2 bg-white p-6 rounded-xl shadow-lg'>
                    <h2 className='text-xl font-semibold mb-4 text-gray-800 border-b pb-2'>Monthly Cash Flow Trend</h2>
                    <div className='h-96'>
                        <SpendingChart data={monthlyTrend} type="monthly" />
                    </div>
                </div>
                
                <div className='md:col-span-1 bg-white p-6 rounded-xl shadow-lg'>
                    <h2 className='text-xl font-semibold mb-4 text-gray-800 border-b pb-2'>Spending by Category</h2>
                    <div className='h-96 flex items-center justify-center'>
                        <SpendingChart data={spendingByCategory} type="category" />
                    </div>
                </div>
            </div>
            
            <div className="text-center mt-8">
                <Link to="/transactions" className="inline-block px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                    View Full Transaction History
                </Link>
            </div>
        </>
    );
}

export default Dashboard;