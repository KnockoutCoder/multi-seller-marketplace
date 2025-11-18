import User from '../models/User.js';

// user service - contains business logic for user operations

// create a new user
const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

// get all users
const getUsers = async () => {
    const users = await User.find({});
    return users;
}

// get a single user by ID
const getUserById = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

// update a user by ID (partial update)

const updateUser = async (userId, updateData) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    //update only provided fields
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
