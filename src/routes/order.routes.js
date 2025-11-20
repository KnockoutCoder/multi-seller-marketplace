import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/order.controller.js';

// order routes - all routes are prefixed with /orders

// POST /orders - create a new order
router.post('/', orderController.createOrder);

// GET /orders - get all orders (with optional buyerId query param)
router.get('/', orderController.getOrders);

// GET /orders/:id - get a single order by ID
router.get('/:id', orderController.getOrderById);

export default router;