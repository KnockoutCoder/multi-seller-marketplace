import * as productService from '../services/product.service.js';

// product controller - handles HTTP requests and responses for product endpoints

// create a new product - POST /products
const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    }   catch (error) {
        next(error);
    }
};

// get all active products (with optional filters) - GET /products?category=electronic&sellerId=123
const getProducts = async (req, res, next) => {
    try {
        const filters = {};

        // extract optional query parameters
        if (req.query.category) {
            filters.category = req.query.category;
        }
        if (req.query.sellerId) {
            filters.sellerId = req.query.sellerId;
        }

        const products = await productService.getProducts(filters);
        res.status(200).json(products);
    }   catch (error) {
        next(error);
    }
};

// get a single product by ID - GET /products/:id
const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    }   catch (error) {
        next(error);
    }
};

// update a product (partial update) - PATCH /products/:id
const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json(product);
    }   catch (error) {
        next(error);
    }
};

// soft delete a product - DELETE /products/:id
const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(200).json({ message: 'Product archived successfully' });
    }   catch (error) {
        next(error);
    }
};

export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};