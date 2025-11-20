import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

/**
 * Express Application
 * Configures middleware and routes
 */
const app = express();

// security middleware
app.use(helmet());

// CORS middleware (allows cross-origin requests)
app.use(cors());

// health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'KC Mart API is running' });
});

// API routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// 404 handler (must be after all routes)
app.use(notFound);

// error handler (must be last)
app.use(errorHandler);

export default app;