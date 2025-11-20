import mongoose from 'mongoose';

/**
 * User Schema
 * Represents users in the marketplace (buyers, sellers, admins)
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            sparse: true, // allows multuple null values
            trim: true,
            lowercase: true,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['buyer', 'seller', 'admin'],
                message: 'Role must be either buyer, seller, or admin',
            },
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt fields
    }
);

const User = mongoose.model('User', userSchema);

export default User;

