import { describe, it, expect, beforeEach } from '@jest/globals';
import * as productService from '../product.service.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';

describe('Product Service', () => {
  let seller;
  let buyer;

  beforeEach(async () => {
    // create a seller and buyer for each test
    seller = await User.create({
      name: 'Test Seller',
      role: 'seller',
      email: 'seller@example.com',
    });

    buyer = await User.create({
      name: 'Test Buyer',
      role: 'buyer',
      email: 'buyer@example.com',
    });
  });

  describe('createProduct', () => {
    it('should create a new product with valid data', async () => {
      const productData = {
        title: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        sellerId: seller._id.toString(),
      };

      const product = await productService.createProduct(productData);

      expect(product).toBeDefined();
      expect(product.title).toBe(productData.title);
      expect(product.price).toBe(productData.price);
      expect(product.stock).toBe(productData.stock);
      expect(product.category).toBe(productData.category);
      expect(product.isActive).toBe(true);
    });

    it('should throw error with 404 if seller not found', async () => {
      const productData = {
        title: 'Test Product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        sellerId: '507f1f77bcf86cd799439011', // Fake ID
      };

      await expect(
        productService.createProduct(productData)
      ).rejects.toThrow('Seller not found');

      try {
        await productService.createProduct(productData);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });

    it('should throw error with 400 if user is not a seller', async () => {
      const productData = {
        title: 'Test Product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        sellerId: buyer._id.toString(), // buyer, not seller
      };

      await expect(
        productService.createProduct(productData)
      ).rejects.toThrow('User must have seller role');

      try {
        await productService.createProduct(productData);
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe('getProducts', () => {
    beforeEach(async () => {
      // create test products
      await Product.create([
        {
          title: 'Product 1',
          price: 10,
          stock: 5,
          category: 'Electronics',
          sellerId: seller._id,
          isActive: true,
        },
        {
          title: 'Product 2',
          price: 20,
          stock: 10,
          category: 'Clothing',
          sellerId: seller._id,
          isActive: true,
        },
        {
          title: 'Product 3',
          price: 30,
          stock: 15,
          category: 'Electronics',
          sellerId: seller._id,
          isActive: false, // Inactive
        },
      ]);
    });

    it('should return all active products', async () => {
      const products = await productService.getProducts();

      expect(products).toHaveLength(2); // Only active products
      expect(products.every((p) => p.isActive === true)).toBe(true);
    });

    it('should filter products by category', async () => {
      const products = await productService.getProducts({ category: 'Electronics' });

      expect(products).toHaveLength(1);
      expect(products[0].category).toBe('Electronics');
      expect(products[0].isActive).toBe(true);
    });

    it('should filter products by sellerId', async () => {
      const products = await productService.getProducts({
        sellerId: seller._id.toString(),
      });

      expect(products).toHaveLength(2);
      expect(products.every((p) => p.sellerId._id.toString() === seller._id.toString())).toBe(true);
    });

    it('should filter by both category and sellerId', async () => {
      const products = await productService.getProducts({
        category: 'Electronics',
        sellerId: seller._id.toString(),
      });

      expect(products).toHaveLength(1);
      expect(products[0].category).toBe('Electronics');
    });

    it('should return empty array when no active products match filters', async () => {
      const products = await productService.getProducts({ category: 'NonExistent' });

      expect(products).toHaveLength(0);
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const createdProduct = await Product.create({
        title: 'Test Product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        sellerId: seller._id,
        isActive: true,
      });

      const product = await productService.getProductById(createdProduct._id.toString());

      expect(product).toBeDefined();
      expect(product._id.toString()).toBe(createdProduct._id.toString());
      expect(product.title).toBe('Test Product');
    });

    it('should throw error with 404 if product not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      await expect(
        productService.getProductById(fakeId)
      ).rejects.toThrow('Product not found');

      try {
        await productService.getProductById(fakeId);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });

    it('should throw error with 404 if product is inactive', async () => {
      const createdProduct = await Product.create({
        title: 'Inactive Product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        sellerId: seller._id,
        isActive: false,
      });

      await expect(
        productService.getProductById(createdProduct._id.toString())
      ).rejects.toThrow('Product not found');

      try {
        await productService.getProductById(createdProduct._id.toString());
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe('updateProduct', () => {
    let product;

    beforeEach(async () => {
      product = await Product.create({
        title: 'Original Product',
        price: 50,
        stock: 20,
        category: 'Electronics',
        sellerId: seller._id,
        isActive: true,
      });
    });

    it('should update product with valid data', async () => {
      const updateData = {
        title: 'Updated Product',
        price: 75,
      };

      const updatedProduct = await productService.updateProduct(
        product._id.toString(),
        updateData
      );

      expect(updatedProduct.title).toBe('Updated Product');
      expect(updatedProduct.price).toBe(75);
      expect(updatedProduct.stock).toBe(20); // Should remain unchanged
    });

    it('should update only provided fields', async () => {
      const updateData = {
        stock: 30,
      };

      const updatedProduct = await productService.updateProduct(
        product._id.toString(),
        updateData
      );

      expect(updatedProduct.stock).toBe(30);
      expect(updatedProduct.title).toBe('Original Product');
    });

    it('should throw error with 404 if product not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = { title: 'New Title' };

      await expect(
        productService.updateProduct(fakeId, updateData)
      ).rejects.toThrow('Product not found');
    });

    it('should throw error with 404 if product is inactive', async () => {
      product.isActive = false;
      await product.save();

      const updateData = { title: 'New Title' };

      await expect(
        productService.updateProduct(product._id.toString(), updateData)
      ).rejects.toThrow('Product not found');
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete a product (set isActive to false)', async () => {
      const product = await Product.create({
        title: 'Product to Delete',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        sellerId: seller._id,
        isActive: true,
      });

      const deletedProduct = await productService.deleteProduct(product._id.toString());

      expect(deletedProduct.isActive).toBe(false);
      
      // Verify it's still in database but inactive
      const foundProduct = await Product.findById(product._id);
      expect(foundProduct.isActive).toBe(false);
    });

    it('should throw error with 404 if product not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      await expect(
        productService.deleteProduct(fakeId)
      ).rejects.toThrow('Product not found');
    });

    it('should throw error with 404 if product is already inactive', async () => {
      const product = await Product.create({
        title: 'Inactive Product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        sellerId: seller._id,
        isActive: false,
      });

      await expect(
        productService.deleteProduct(product._id.toString())
      ).rejects.toThrow('Product not found');
    });
  });
});