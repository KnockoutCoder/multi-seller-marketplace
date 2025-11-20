import mongoose from 'mongoose';

/**
 * Order Item Schema (embedded in Order)
 * Represents a single item within an order
 */
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
        type: Number,
        required: true,
        min: [0, 'Unit price must be a positive number'],
    },
    subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal must be a positive number'],
    },
});

/**
 * Order Schema
 * Represents orders placed by buyers
 */
const orderSchema = new mongoose.Schema(
    {
        // the user who placed the order
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Buyer ID is required'],
        },

        // simple order workflow for now
        status: {
            type: String,
            enum: {
                values: ['pending', 'paid', 'cancelled'],
                message: 'Status must be pending, paid, or cancelled',
            },
            default: 'pending',
        },

        // total cost of all order itesm
        totalAmount: {
            type: Number,
            required: true,
            min: [0, 'Total amount must be a positive number'],
        },

        // array of order items, must have at least one
        items: {
            type: [orderItemSchema],
            required: [true, 'Order must have at least one item'],
            validate: {
                validator: function (items) {
                return items && items.length > 0;
            },
            message: 'Order must have at least one item',
        },
    },
},
{
    timestamps: true, // auto-manages createdAt and updatedAt fields
}
);

// Mongoose model for the Orders collection
const Order = mongoose.model('Order', orderSchema);

export default Order;


