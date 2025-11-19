import express from 'express';
const router = express.Router();
import * as productController from '../controllers/product.controller.js';

// product routes - all routes are prefixed with /products

// POST /products - create a new product
router.post('/', productController.createProduct);

// GET /products - get all active products (with optimal query params)
router.get('/', productController.getProducts);

// GET /products/:id - get a single product by ID
router.get('/:id', productController.getProductById);

// PATCH /products/:id - update a product (partial update)
router.patch('/:id', productController.updateProduct);

// DELETE /products/:id - soft delete a product
router.delete('/:id', productController.deleteProduct);

export default router;



