import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as productController from '../product.controller.js';
import * as productService from '../../services/product.service.js';

// mock the product service
jest.mock('../../services/product.service.js');

describe('Product Controller', () => {
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

  describe('createProduct', () => {
    it('should create a product and return 201 status', async () => {
      const mockProduct = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Test Product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
      };

      productService.createProduct.mockResolvedValue(mockProduct);
      req.body = {
        title: 'Test Product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        sellerId: '507f1f77bcf86cd799439012',
      };

      await productController.createProduct(req, res, next);

      expect(productService.createProduct).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service throws', async () => {
      const mockError = new Error('Seller not found');
      mockError.statusCode = 404;
      productService.createProduct.mockRejectedValue(mockError);

      await productController.createProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getProducts', () => {
    it('should return products with 200 status and no filters', async () => {
      const mockProducts = [
        { _id: '1', title: 'Product 1', price: 10 },
        { _id: '2', title: 'Product 2', price: 20 },
      ];

      productService.getProducts.mockResolvedValue(mockProducts);

      await productController.getProducts(req, res, next);

      expect(productService.getProducts).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should filter products by category query parameter', async () => {
      const mockProducts = [{ _id: '1', title: 'Product 1', category: 'Electronics' }];

      productService.getProducts.mockResolvedValue(mockProducts);
      req.query.category = 'Electronics';

      await productController.getProducts(req, res, next);

      expect(productService.getProducts).toHaveBeenCalledWith({ category: 'Electronics' });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should filter products by sellerId query parameter', async () => {
      const mockProducts = [{ _id: '1', title: 'Product 1' }];

      productService.getProducts.mockResolvedValue(mockProducts);
      req.query.sellerId = '507f1f77bcf86cd799439011';

      await productController.getProducts(req, res, next);

      expect(productService.getProducts).toHaveBeenCalledWith({
        sellerId: '507f1f77bcf86cd799439011',
      });
    });

    it('should filter by both category and sellerId', async () => {
      productService.getProducts.mockResolvedValue([]);
      req.query.category = 'Electronics';
      req.query.sellerId = '507f1f77bcf86cd799439011';

      await productController.getProducts(req, res, next);

      expect(productService.getProducts).toHaveBeenCalledWith({
        category: 'Electronics',
        sellerId: '507f1f77bcf86cd799439011',
      });
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID with 200 status', async () => {
      const mockProduct = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Test Product',
        price: 99.99,
      };

      productService.getProductById.mockResolvedValue(mockProduct);
      req.params.id = '507f1f77bcf86cd799439011';

      await productController.getProductById(req, res, next);

      expect(productService.getProductById).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should call next with error if product not found', async () => {
      const mockError = new Error('Product not found');
      mockError.statusCode = 404;
      productService.getProductById.mockRejectedValue(mockError);
      req.params.id = '507f1f77bcf86cd799439011';

      await productController.getProductById(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateProduct', () => {
    it('should update a product and return 200 status', async () => {
      const mockProduct = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Updated Product',
        price: 149.99,
      };

      productService.updateProduct.mockResolvedValue(mockProduct);
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { title: 'Updated Product', price: 149.99 };

      await productController.updateProduct(req, res, next);

      expect(productService.updateProduct).toHaveBeenCalledWith(req.params.id, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return 200 status with message', async () => {
      productService.deleteProduct.mockResolvedValue({ isActive: false });
      req.params.id = '507f1f77bcf86cd799439011';

      await productController.deleteProduct(req, res, next);

      expect(productService.deleteProduct).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product archived successfully' });
    });

    it('should call next with error if product not found', async () => {
      const mockError = new Error('Product not found');
      mockError.statusCode = 404;
      productService.deleteProduct.mockRejectedValue(mockError);
      req.params.id = '507f1f77bcf86cd799439011';

      await productController.deleteProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});

