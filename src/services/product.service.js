import Product from '../models/Product.js';
import User from '../models/User.js';

// product creation: now with 100% more gatekeeping

const createProduct = async (productData) => {
    const seller = await User.findById(productData.sellerId);
    // make sure the seller exists
    if (!seller) {
        const error = new Error('Seller not found');
        error.statusCode = 404;
        throw error;
    }

    // quick check; only actual sellers can create products
    if (seller.role !== 'seller') {
        const error = new Error('User must have seller role to create products');
        error.statusCode = 400;
        throw error;
    }

    // create and save the product
    const product = new Product(productData);
    await product.save();
    return product;
    
};

// get all active products with optional filters
const getProducts = async (filters = {}) => {
    const query = { isActive: true };

    // add optional filters
    if (filters.category) {
        query.category = filters.category;
    }
    if (filters.sellerId) {
        query.sellerId = filters.sellerId;
    }

    const products = await Product.find(query).populate('sellerId', 'name email');
    return products;
};

// get a single product by ID
const getProductById = async (productId) => {
    const product = await Product.findById(productId).populate('sellerId', 'name email');

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    if (!product.isActive) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    return product;
};

// update a product by ID (partial update)
const updateProduct = async (productId, updateData) => {
    // look up the product
    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }
    
    // prevent updates on inactive products
    if (!product.isActive) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    // update only provided fields
    Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
            product[key] = updateData[key];
        }
    });

    await product.save();
    return product;
};

// soft delete a product (set isActive to false)
const deleteProduct = async (productId) => {
    const product = await Product.findById(productId);

    // if product doesn't exist
    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }
    
    // if product is already inactive, treat it as not found
    if (product.isActive) {
        const error = new Error('Product not found');
        error.StatusCode = 404;
        throw error;
    }

    // soft delete: mark product as inactive
    product.isActive = false;
    await product.save();
    
    return product;
};

export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};

