import { describe, it, expect, beforeEach } from '@jest/globals';
import * as userService from '../user.service.js';
import User from '../../models/User.js';

describe('User Service', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'buyer',
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user._id).toBeDefined();
    });

    it('should create a user without email', async () => {
      const userData = {
        name: 'Jane Seller',
        role: 'seller',
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe(userData.role);
      expect(user.email).toBeUndefined();
    });

    it('should throw error if required fields are missing', async () => {
      const userData = {
        name: 'Test User',
        // missing role
      };

      await expect(userService.createUser(userData)).rejects.toThrow();
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      // create test users
      await User.create([
        { name: 'User 1', role: 'buyer' },
        { name: 'User 2', role: 'seller' },
        { name: 'User 3', role: 'admin' },
      ]);

      const users = await userService.getUsers();

      expect(users).toHaveLength(3);
      // Check that all users are present (order may vary)
      const userNames = users.map((u) => u.name).sort();
      expect(userNames).toEqual(['User 1', 'User 2', 'User 3']);
    });

    it('should return empty array when no users exist', async () => {
      const users = await userService.getUsers();
      expect(users).toHaveLength(0);
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const createdUser = await User.create({
        name: 'Test User',
        role: 'buyer',
      });

      const user = await userService.getUserById(createdUser._id.toString());

      expect(user).toBeDefined();
      expect(user._id.toString()).toBe(createdUser._id.toString());
      expect(user.name).toBe('Test User');
    });

    it('should throw error with 404 status if user not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      await expect(userService.getUserById(fakeId)).rejects.toThrow('User not found');
      
      try {
        await userService.getUserById(fakeId);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe('updateUser', () => {
    it('should update user with valid data', async () => {
      const createdUser = await User.create({
        name: 'Original Name',
        email: 'original@example.com',
        role: 'buyer',
      });

      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const updatedUser = await userService.updateUser(
        createdUser._id.toString(),
        updateData
      );

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe('updated@example.com');
      expect(updatedUser.role).toBe('buyer'); // Should remain unchanged
    });

    it('should update only provided fields', async () => {
      const createdUser = await User.create({
        name: 'Test User',
        role: 'seller',
      });

      const updateData = {
        name: 'New Name',
      };

      const updatedUser = await userService.updateUser(
        createdUser._id.toString(),
        updateData
      );

      expect(updatedUser.name).toBe('New Name');
      expect(updatedUser.role).toBe('seller');
    });

    it('should throw error with 404 status if user not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = { name: 'New Name' };

      await expect(
        userService.updateUser(fakeId, updateData)
      ).rejects.toThrow('User not found');

      try {
        await userService.updateUser(fakeId, updateData);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });

    it('should ignore undefined values in update data', async () => {
      const createdUser = await User.create({
        name: 'Test User',
        role: 'buyer',
      });

      const updateData = {
        name: 'Updated Name',
        email: undefined,
      };

      const updatedUser = await userService.updateUser(
        createdUser._id.toString(),
        updateData
      );

      expect(updatedUser.name).toBe('Updated Name');
      // email should remain unchanged (or undefined if it was undefined)
    });
  });
});

