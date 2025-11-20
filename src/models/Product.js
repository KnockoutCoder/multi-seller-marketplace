import mongoose from 'mongoose';

/**
 * Product Schema
 * Represents products sold by sellers in the marketplace
 */
const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Product title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price must be a positive number'],
        },
        stock: {
            type: Number,
            required: [true, 'Product stock is required'],
            min: [0, 'Stock must be a non-negative number'],
        },
        category: {
            type: String,
            required: [true, 'Product category is required'],
            trim: true,
        },
        image: {
            type: String,
            trim: true,
            default: '', // optional image URL or base64 data URL
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Seller ID is required'],
        },
        isActive: {
            type: Boolean,
            default: true, // used for soft deletion
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
