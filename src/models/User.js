import mongoose from 'mongoose';

// userSchema represents users in the marketplace (buyers, sellers, admin)

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
            sparse: true,
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
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;

