import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * Order Service
 * Contains business logic for order operations
 */

/**
 * Create a new order with multiple items
 * @param {Object} orderData - Order data (buyerId, items: [{productId, quantity}])
 * @returns {Promise<Object>} Created order
 */
const createOrder = async (orderData) => {
    const { buyerId, items } = orderData;

    // validate buyer exists and has role "buyer"
    const buyer = await User.findById(buyerId);
    if (!buyer) {
        const error = new Error('Buyer not found');
        error.statusCode = 404;
        throw error;
    }
    if (buyer.role !== 'buyer') {
        const error = new Error('User must have buyer role to create orders');
        error.statusCode = 400;
        throw error;
    }

    // validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
        const error = new Error('Order must have at least one item');
        error.statusCode = 400;
        throw error;
    }

    // process each item: validate product, get price, calculate subtotal
    const processedItems = [];
    let totalAmount = 0;

    for (const item of items) {
        const { productId, quantity } = item;
    
        // validate product  exists and is active
        const product = await Product.findById(productId);
        if (!product) {
            const error = new Error('One or more products are invalid or inactive.');
            error.statusCode = 404;
            throw error;
        }
        if (!product.isActive) {
            const error = new Error('One or more products are invalid or inactive.');
            error.statusCode = 404;
            throw error;
        }

        // validate quantity
        if (!quantity || quantity < 1) {
            const error = new Error('Quantity must be at least 1 for all items');
            error.statusCode = 400;
            throw error;
        }

        // use current product price as unitPrice (price snapshot)
        const unitPrice = product.price;
        const subtotal = unitPrice * quantity;

        processedItems.push({
            productId,
            quantity,
            unitPrice,
            subtotal,
        });

        totalAmount += subtotal;
    }

    // create order with processed items
    const order = new Order({
        buyerId,
        items: processedItems,
        totalAmount,
        status: 'pending'
    });

    await order.save();

    // populate references for better response
    await order.populate('buyerId', 'name email');
    await order.populate({
        path: 'items.productId',
        select: 'title price sellerId',
        populate: {
            path: 'sellerId',
            select: 'name email _id'
        }
    });

    return order;
};

/**
 * Get all orders with optional buyer filter
 * @param {Object} filters - Optional filters (buyerId)
 * @returns {Promise<Array>} Array of orders
 */
const getOrders = async (filters = {}) => {
    const query = {};

    // add optional buyer filter
    if (filters.buyerId) {
        query.buyerId = filters.buyerId;
    }

    const orders = await Order.find(query)
        .populate('buyerId', 'name email')
        .populate({
            path: 'items.productId',
            select: 'title price category sellerId',
            populate: {
                path: 'sellerId',
                select: 'name email _id'
            }
        });
    
    return orders;
};

/**
 * Get a single order by ID
 * @param {String} orderId - Order ID
 * @returns {Promise<Object>} Order object
 */
const getOrderbyId = async (orderId) => {
    const order = await Order.findById(orderId)
        .populate('buyerId', 'name email')
        .populate({
            path: 'items.productId',
            select: 'title price category sellerId',
            populate: { 
                path: 'sellerId',
                select: 'name email _id'
            }
        });

    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
    }

    return order;
};

export {
    createOrder,
    getOrders,
    getOrderbyId,
};
