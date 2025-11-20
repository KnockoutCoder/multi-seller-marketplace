import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

/**
 * Server Entry Point
 * Connects to database and starts the Expresss server
 */

const PORT = process.env.PORT || 3000;

// connect to MongoDB, then start server
const startServer = async () => {
    try {
        await connectDB();
        // start server after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
