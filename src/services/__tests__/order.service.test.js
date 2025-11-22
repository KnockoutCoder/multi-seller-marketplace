import { describe, it, expect, beforeEach } from '@jest/globals';
import * as orderService from '../order.service.js';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';

describe('Order Service', () => {
  let buyer;
  let seller;
  let product1;
  let product2;

  beforeEach(async () => {
    // create test users
    buyer = await User.create({
      name: 'Test Buyer',
      role: 'buyer',
      email: 'buyer@example.com',
    });

    seller = await User.create({
      name: 'Test Seller',
      role: 'seller',
      email: 'seller@example.com',
    });

    // create test products
    product1 = await Product.create({
      title: 'Product 1',
      price: 10.00,
      stock: 100,
      category: 'Electronics',
      sellerId: seller._id,
      isActive: true,
    });

    product2 = await Product.create({
      title: 'Product 2',
      price: 20.00,
      stock: 50,
      category: 'Clothing',
      sellerId: seller._id,
      isActive: true,
    });
  });

  describe('createOrder', () => {
    it('should create a new order with valid data', async () => {
      const orderData = {
        buyerId: buyer._id.toString(),
        items: [
          {
            productId: product1._id.toString(),
            quantity: 2,
          },
          {
            productId: product2._id.toString(),
            quantity: 1,
          },
        ],
      };

      const order = await orderService.createOrder(orderData);

      expect(order).toBeDefined();
      expect(order.buyerId._id.toString()).toBe(buyer._id.toString());
      expect(order.items).toHaveLength(2);
      expect(order.status).toBe('pending');
      expect(order.totalAmount).toBe(40.00); // (10 * 2) + (20 * 1)
    });

    it('should calculate correct total amount for multiple items', async () => {
      const orderData = {
        buyerId: buyer._id.toString(),
        items: [
          {
            productId: product1._id.toString(),
            quantity: 3,
          },
          {
            productId: product2._id.toString(),
            quantity: 2,
          },
        ],
      };

      const order = await orderService.createOrder(orderData);

      // (10 * 3) + (20 * 2) = 30 + 40 = 70
      expect(order.totalAmount).toBe(70.00);
      expect(order.items[0].subtotal).toBe(30.00);
      expect(order.items[1].subtotal).toBe(40.00);
    });

    it('should store unitPrice and subtotal for each item', async () => {
      const orderData = {
        buyerId: buyer._id.toString(),
        items: [
          {
            productId: product1._id.toString(),
            quantity: 5,
          },
        ],
      };

      const order = await orderService.createOrder(orderData);

      expect(order.items[0].unitPrice).toBe(10.00);
      expect(order.items[0].quantity).toBe(5);
      expect(order.items[0].subtotal).toBe(50.00);
    });

    it('should throw error with 404 if buyer not found', async () => {
      const orderData = {
        buyerId: '507f1f77bcf86cd799439011', // Fake ID
        items: [
          {
            productId: product1._id.toString(),
            quantity: 1,
          },
        ],
      };

      await expect(
        orderService.createOrder(orderData)
      ).rejects.toThrow('Buyer not found');

      try {
        await orderService.createOrder(orderData);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });

    it('should throw error with 400 if user is not a buyer', async () => {
      const orderData = {
        buyerId: seller._id.toString(), // Seller, not buyer
        items: [
          {
            productId: product1._id.toString(),
            quantity: 1,
          },
        ],
      };

      await expect(
        orderService.createOrder(orderData)
      ).rejects.toThrow('User must have buyer role');

      try {
        await orderService.createOrder(orderData);
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    it('should throw error with 400 if items array is empty', async () => {
      const orderData = {
        buyerId: buyer._id.toString(),
        items: [],
      };

      await expect(
        orderService.createOrder(orderData)
      ).rejects.toThrow('Order must have at least one item');

      try {
        await orderService.createOrder(orderData);
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    it('should throw error with 400 if items is not an array', async () => {
      const orderData = {
        buyerId: buyer._id.toString(),
        items: null,
      };

      await expect(
        orderService.createOrder(orderData)
      ).rejects.toThrow('Order must have at least one item');
    });

    it('should throw error with 404 if product not found', async () => {
      const orderData = {
        buyerId: buyer._id.toString(),
        items: [
          {
            productId: '507f1f77bcf86cd799439011', // Fake ID
            quantity: 1,
          },
        ],
      };

      await expect(
        orderService.createOrder(orderData)
      ).rejects.toThrow('One or more products are invalid or inactive');
    });

    it('should throw error with 404 if product is inactive', async () => {
      const inactiveProduct = await Product.create({
        title: 'Inactive Product',
        price: 15.00,
        stock: 10,
        category: 'Electronics',
        sellerId: seller._id,
        isActive: false,
      });

      const orderData = {
        buyerId: buyer._id.toString(),
        items: [
          {
            productId: inactiveProduct._id.toString(),
            quantity: 1,
          },
        ],
      };

      await expect(
        orderService.createOrder(orderData)
      ).rejects.toThrow('One or more products are invalid or inactive');
    });

    it('should throw error with 400 if quantity is less than 1', async () => {
      const orderData = {
        buyerId: buyer._id.toString(),
        items: [
          {
            productId: product1._id.toString(),
            quantity: 0,
          },
        ],
      };

      await expect(
        orderService.createOrder(orderData)
      ).rejects.toThrow('Quantity must be at least 1');
    });

    it('should throw error with 400 if quantity is missing', async () => {
      const orderData = {
        buyerId: buyer._id.toString(),
        items: [
          {
            productId: product1._id.toString(),
            // missing quantity
          },
        ],
      };

      await expect(
        orderService.createOrder(orderData)
      ).rejects.toThrow('Quantity must be at least 1');
    });
  });

  describe('getOrders', () => {
    beforeEach(async () => {
      // create test orders
      const buyer2 = await User.create({
        name: 'Buyer 2',
        role: 'buyer',
      });

      await Order.create([
        {
          buyerId: buyer._id,
          items: [
            {
              productId: product1._id,
              quantity: 1,
              unitPrice: 10.00,
              subtotal: 10.00,
            },
          ],
          totalAmount: 10.00,
          status: 'pending',
        },
        {
          buyerId: buyer._id,
          items: [
            {
              productId: product2._id,
              quantity: 2,
              unitPrice: 20.00,
              subtotal: 40.00,
            },
          ],
          totalAmount: 40.00,
          status: 'paid',
        },
        {
          buyerId: buyer2._id,
          items: [
            {
              productId: product1._id,
              quantity: 3,
              unitPrice: 10.00,
              subtotal: 30.00,
            },
          ],
          totalAmount: 30.00,
          status: 'pending',
        },
      ]);
    });

    it('should return all orders', async () => {
      const orders = await orderService.getOrders();

      expect(orders).toHaveLength(3);
    });

    it('should filter orders by buyerId', async () => {
      const orders = await orderService.getOrders({
        buyerId: buyer._id.toString(),
      });

      expect(orders).toHaveLength(2);
      expect(
        orders.every((order) => order.buyerId._id.toString() === buyer._id.toString())
      ).toBe(true);
    });

    it('should return empty array when no orders match filter', async () => {
      const fakeBuyerId = '507f1f77bcf86cd799439011';
      const orders = await orderService.getOrders({ buyerId: fakeBuyerId });

      expect(orders).toHaveLength(0);
    });

    it('should return all orders when no filter is provided', async () => {
      const orders = await orderService.getOrders();

      expect(orders.length).toBeGreaterThan(0);
    });
  });

  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      const createdOrder = await Order.create({
        buyerId: buyer._id,
        items: [
          {
            productId: product1._id,
            quantity: 2,
            unitPrice: 10.00,
            subtotal: 20.00,
          },
        ],
        totalAmount: 20.00,
        status: 'pending',
      });

      const order = await orderService.getOrderById(createdOrder._id.toString());

      expect(order).toBeDefined();
      expect(order._id.toString()).toBe(createdOrder._id.toString());
      expect(order.totalAmount).toBe(20.00);
    });

    it('should throw error with 404 if order not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      await expect(
        orderService.getOrderById(fakeId)
      ).rejects.toThrow('Order not found');

      try {
        await orderService.getOrderById(fakeId);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });
});

