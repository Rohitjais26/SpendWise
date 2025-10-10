const mongoose = require('mongoose');

// The connectDB function handles the asynchronous connection process
const connectDB = async () => {
    try {
        // Mongoose 6+ automatically handles options like useNewUrlParser, etc.
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
