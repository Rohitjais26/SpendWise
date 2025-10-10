// frontend-vite/src/features/data/dataSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    spendingByCategory: [],
    monthlyTrend: [],
    isLoading: false,
    isError: false,
    message: '',
};

const API_URL = '/api/data/';

// Helper function to get the authorization header (reused)
const getConfig = (thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Fetch spending broken down by category (for Pie Chart)
export const getSpendingByCategory = createAsyncThunk(
    'data/getCategorySpending',
    async (_, thunkAPI) => {
        try {
            const config = getConfig(thunkAPI);
            const response = await axios.get(API_URL + 'spending-by-category', config);
            return response.data.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Fetch monthly income vs. expense trend (for Bar/Line Chart)
export const getMonthlyTrend = createAsyncThunk(
    'data/getMonthlyTrend',
    async (_, thunkAPI) => {
        try {
            const config = getConfig(thunkAPI);
            const response = await axios.get(API_URL + 'monthly-trend', config);
            return response.data.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSpendingByCategory.fulfilled, (state, action) => {
                state.spendingByCategory = action.payload;
            })
            .addCase(getMonthlyTrend.fulfilled, (state, action) => {
                state.monthlyTrend = action.payload;
            })
            .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.isLoading = true; })
            .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => { state.isLoading = false; state.isSuccess = true; })
            .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = dataSlice.actions;
export default dataSlice.reducer;