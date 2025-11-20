import * as orderService from '../services/order.service.js';

/**
 * Order Controller
 * Handles HTTP requests and responses for order endpoints
 */

/**
 * Create a new order
 * POST /orders
 */
const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body);
        res.status(201).json(order);
    }   catch (error) {
        next(error);
    }
};

/**
 * Get all orders (with optional buyer filter)
 * GET /orders?buyerId=123
 */
const getOrders = async (req, res, next) => {
    try {
        const filters = {};

        // extract optional query parameters
        if (req.query.buyerId) {
            filters.buyerId = req.query.buyerId;
        }

        const orders = await orderService.getOrders(filters);
        res.status(200).json(orders);
    }   catch (error) {
        next(error);
    }
};

/**
 * Get a single order by ID
 * GET /orders/:id
 */
const getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        res.status(200).json(order);
    }   catch (error) {
        next(error);
    }
};

export {
    createOrder,
    getOrders,
    getOrderById,
};