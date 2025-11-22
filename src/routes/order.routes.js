import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/order.controller.js';

/**
 * Order Routes
 * All routes are prefixed with /orders
 */

// POST /orders - create a new order
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyerId
 *               - items
 *             properties:
 *               buyerId:
 *                 type: string
 *                 description: Buyer user ID
 *                 example: 507f1f77bcf86cd799439011
 *               items:
 *                 type: array
 *                 description: Array of order items
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error or invalid items
 *       404:
 *         description: Buyer or products not found
 */
router.post('/', orderController.createOrder);

// GET /orders - get all orders (with optional buyerId query param)
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: buyerId
 *         schema:
 *           type: string
 *         description: Filter orders by buyer ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', orderController.getOrders);

// GET /orders/:id - get a single order by ID
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get('/:id', orderController.getOrderById);

export default router;