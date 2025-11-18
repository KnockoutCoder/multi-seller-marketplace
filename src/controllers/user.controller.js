import * as userService from '../services/user.service.js';

// user controller - hadnles HTTP requests and responses for user endpoints

// create a new user - POST /users
const createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    }   catch (error) {
        next(error);
    }
};

// get all users - GET /users
const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    }   catch (error) {
        next(error);
    }
};

// get a single user by ID - GET /users/:id
const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    }   catch (error) {
        next(error);
    }
};

// update a user (partial update) - PATCH /users/:id
const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(user);
    }   catch (error) {
        next(error);
    }
};

export {
    createUser,
    getUsers,
    getUserById,
    updateUser,
};
