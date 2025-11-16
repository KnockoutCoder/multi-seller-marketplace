import mongoose from 'mongoose';

// orderItemSchema represents a single item within an order

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
        min: [0, 'Unit price must be a positive number'];
    },
    subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal must be a positive number'],
    },
});

const orderSchema = new mongoose.Schema(
    {
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Buyer ID is required'],
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'paid', 'cancelled'],
                message: 'Status must be pending, paid, or cancelled',
            },
            default: 'pending',
        },
        totalAmount: {
            type: Number,
            required: true,
            min: [0, 'Total amount must be a positive number'],
        },
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
    timestamps: true,
}
);

const Order = mongoose.model('Order', orderSchema);

export default Order;


