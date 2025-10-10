require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');

// Import the new external database connection function
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dataRoutes = require('./routes/dataRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

// Execute the database connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing of JSON request body

// Root Route (Sanity Check)
app.get('/', (req, res) => {
  res.send('FinTech Server Running!');
});

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/budgets', budgetRoutes);

// Custom Error Handler Middleware (at the end)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
