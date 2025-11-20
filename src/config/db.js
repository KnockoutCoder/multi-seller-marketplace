import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose
 * Reads connection string from environment variable MONGODB_URI
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;

