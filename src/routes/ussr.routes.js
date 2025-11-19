import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';

// user routes - all routes are prefixed with /users

// POST /users - creating a new user
router.post('/', userController.createUser);

// GET /users - get all users
router.get('/', userController.getUsers);

// GET /users/:id - get a single user by ID
router.get('/:id', userController.getUserById);

// PATCH /users/:id - update a user (partial update)
router.patch('/:id', userController.updateUser);

export default router;

