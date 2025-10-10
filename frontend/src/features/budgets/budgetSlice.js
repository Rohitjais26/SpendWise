// frontend-vite/src/features/budgets/budgetSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    budgets: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

const API_URL = '/api/budgets/'; 

// Helper function to get the authorization header (reused)
const getConfig = (thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Get user budgets
export const getBudgets = createAsyncThunk('budgets/getAll', async (_, thunkAPI) => {
    try {
        const config = getConfig(thunkAPI);
        const response = await axios.get(API_URL, config);
        return response.data.data; 
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create new budget
export const createBudget = createAsyncThunk('budgets/create', async (budgetData, thunkAPI) => {
    try {
        const config = getConfig(thunkAPI);
        const response = await axios.post(API_URL, budgetData, config);
        return response.data.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete budget
export const deleteBudget = createAsyncThunk('budgets/delete', async (id, thunkAPI) => {
    try {
        const config = getConfig(thunkAPI);
        await axios.delete(API_URL + id, config);
        return id;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- Slice Definition ---

export const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBudgets.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.budgets = action.payload; })
            .addCase(createBudget.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.budgets.unshift(action.payload); })
            .addCase(deleteBudget.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.budgets = state.budgets.filter((budget) => budget._id !== action.payload); })
            .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.isLoading = true; })
            .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
    },
});

export const { reset } = budgetSlice.actions;
export default budgetSlice.reducer;