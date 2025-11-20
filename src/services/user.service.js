import User from '../models/User.js';

/**
 * User Service
 * Contains business logic for user operations
 */

/**
 * Create a new user
 * @param {Object} userData - User data (name, email?, role)
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

/**
 * Get all users
 * @returns {Promise<Array>} Array of users
 */
const getUsers = async () => {
    const users = await User.find({});
    return users;
}

/**
 * Get a single user by ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} User object
 */
const getUserById = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

/**
 * Update a user by ID (partial update)
 * @param {String} userId - User ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated user
 */
const updateUser = async (userId, updateData) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    // update only provided fields
    Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
            user[key] = updateData[key];
        }
    });

    await user.save();
    return user;
};

export {
    createUser,
    getUsers,
    getUserById,
    updateUser,
};
