// frontend-vite/src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
// Import all reducers (must be created next)
import authReducer from '../features/auth/authSlice'; 
import transactionReducer from '../features/transactions/transactionSlice'; 
import budgetReducer from '../features/budgets/budgetSlice'; 
import dataReducer from '../features/data/dataSlice'; 

export const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
        budgets: budgetReducer,
        data: dataReducer,
    },
});