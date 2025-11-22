import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as userController from '../user.controller.js';
import * as userService from '../../services/user.service.js';

// mock the user service
jest.mock('../../services/user.service.js');

describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return 201 status', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test User',
        role: 'buyer',
      };

      userService.createUser.mockResolvedValue(mockUser);
      req.body = { name: 'Test User', role: 'buyer' };

      await userController.createUser(req, res, next);

      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service throws', async () => {
      const mockError = new Error('Validation error');
      userService.createUser.mockRejectedValue(mockError);
      req.body = { name: 'Test' };

      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('should return all users with 200 status', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', role: 'buyer' },
        { _id: '2', name: 'User 2', role: 'seller' },
      ];

      userService.getUsers.mockResolvedValue(mockUsers);

      await userController.getUsers(req, res, next);

      expect(userService.getUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service throws', async () => {
      const mockError = new Error('Database error');
      userService.getUsers.mockRejectedValue(mockError);

      await userController.getUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID with 200 status', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test User',
        role: 'buyer',
      };

      userService.getUserById.mockResolvedValue(mockUser);
      req.params.id = '507f1f77bcf86cd799439011';

      await userController.getUserById(req, res, next);

      expect(userService.getUserById).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if user not found', async () => {
      const mockError = new Error('User not found');
      mockError.statusCode = 404;
      userService.getUserById.mockRejectedValue(mockError);
      req.params.id = '507f1f77bcf86cd799439011';

      await userController.getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateUser', () => {
    it('should update a user and return 200 status', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Updated User',
        role: 'buyer',
      };

      userService.updateUser.mockResolvedValue(mockUser);
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { name: 'Updated User' };

      await userController.updateUser(req, res, next);

      expect(userService.updateUser).toHaveBeenCalledWith(req.params.id, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service throws', async () => {
      const mockError = new Error('User not found');
      mockError.statusCode = 404;
      userService.updateUser.mockRejectedValue(mockError);
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { name: 'Updated' };

      await userController.updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});

