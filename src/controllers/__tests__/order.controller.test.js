import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as orderController from '../order.controller.js';
import * as orderService from '../../services/order.service.js';

// mock the order service
jest.mock('../../services/order.service.js');

describe('Order Controller', () => {
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

  describe('createOrder', () => {
    it('should create an order and return 201 status', async () => {
      const mockOrder = {
        _id: '507f1f77bcf86cd799439011',
        buyerId: '507f1f77bcf86cd799439012',
        items: [
          {
            productId: '507f1f77bcf86cd799439013',
            quantity: 2,
            unitPrice: 10.00,
            subtotal: 20.00,
          },
        ],
        totalAmount: 20.00,
        status: 'pending',
      };

      orderService.createOrder.mockResolvedValue(mockOrder);
      req.body = {
        buyerId: '507f1f77bcf86cd799439012',
        items: [
          {
            productId: '507f1f77bcf86cd799439013',
            quantity: 2,
          },
        ],
      };

      await orderController.createOrder(req, res, next);

      expect(orderService.createOrder).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockOrder);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service throws', async () => {
      const mockError = new Error('Buyer not found');
      mockError.statusCode = 404;
      orderService.createOrder.mockRejectedValue(mockError);

      await orderController.createOrder(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getOrders', () => {
    it('should return all orders with 200 status and no filters', async () => {
      const mockOrders = [
        {
          _id: '1',
          buyerId: '507f1f77bcf86cd799439012',
          totalAmount: 20.00,
          status: 'pending',
        },
        {
          _id: '2',
          buyerId: '507f1f77bcf86cd799439012',
          totalAmount: 40.00,
          status: 'paid',
        },
      ];

      orderService.getOrders.mockResolvedValue(mockOrders);

      await orderController.getOrders(req, res, next);

      expect(orderService.getOrders).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrders);
    });

    it('should filter orders by buyerId query parameter', async () => {
      const mockOrders = [
        {
          _id: '1',
          buyerId: '507f1f77bcf86cd799439012',
          totalAmount: 20.00,
        },
      ];

      orderService.getOrders.mockResolvedValue(mockOrders);
      req.query.buyerId = '507f1f77bcf86cd799439012';

      await orderController.getOrders(req, res, next);

      expect(orderService.getOrders).toHaveBeenCalledWith({
        buyerId: '507f1f77bcf86cd799439012',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error if service throws', async () => {
      const mockError = new Error('Database error');
      orderService.getOrders.mockRejectedValue(mockError);

      await orderController.getOrders(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getOrderById', () => {
    it('should return an order by ID with 200 status', async () => {
      const mockOrder = {
        _id: '507f1f77bcf86cd799439011',
        buyerId: '507f1f77bcf86cd799439012',
        totalAmount: 20.00,
        status: 'pending',
      };

      orderService.getOrderById.mockResolvedValue(mockOrder);
      req.params.id = '507f1f77bcf86cd799439011';

      await orderController.getOrderById(req, res, next);

      expect(orderService.getOrderById).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrder);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if order not found', async () => {
      const mockError = new Error('Order not found');
      mockError.statusCode = 404;
      orderService.getOrderById.mockRejectedValue(mockError);
      req.params.id = '507f1f77bcf86cd799439011';

      await orderController.getOrderById(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});

