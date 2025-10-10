// frontend-vite/src/features/transactions/transactionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    transactions: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

const API_URL = '/api/transactions/';

// Helper function to get the authorization header
const getConfig = (thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Get user transactions
export const getTransactions = createAsyncThunk('transactions/getAll', async (_, thunkAPI) => {
    try {
        const config = getConfig(thunkAPI);
        const response = await axios.get(API_URL, config);
        return response.data.data; 
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create new transaction
export const createTransaction = createAsyncThunk('transactions/create', async (transactionData, thunkAPI) => {
    try {
        const config = getConfig(thunkAPI);
        const response = await axios.post(API_URL, transactionData, config);
        return response.data.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete transaction
export const deleteTransaction = createAsyncThunk('transactions/delete', async (id, thunkAPI) => {
    try {
        const config = getConfig(thunkAPI);
        await axios.delete(API_URL + id, config);
        return id;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// ------------------------------------------------------------------
// NEW: Update transaction (The missing export)
export const updateTransaction = createAsyncThunk('transactions/update', async ({ id, transactionData }, thunkAPI) => {
    try {
        const config = getConfig(thunkAPI);
        const response = await axios.put(API_URL + id, transactionData, config); 
        return response.data.data; // Return the updated transaction object
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
// ------------------------------------------------------------------


// --- Slice Definition ---

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.transactions = action.payload; })
            .addCase(createTransaction.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.transactions.unshift(action.payload); })
            .addCase(deleteTransaction.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.transactions = state.transactions.filter((transaction) => transaction._id !== action.payload); })
            
            // NEW: Handle update transaction fulfillment
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Find the transaction by ID and replace it with the updated payload
                state.transactions = state.transactions.map((transaction) =>
                    transaction._id === action.payload._id ? action.payload : transaction
                );
            })
            // END NEW LOGIC
            
            .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.isLoading = true; })
            .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
    },
});

// Note: updateTransaction is exported automatically by createAsyncThunk above.
export const { reset } = transactionSlice.actions;
export default transactionSlice.reducer;