import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KC Mart Marketplace API',
      version: '1.0.0',
      description: 'A RESTful API for a multi-seller marketplace built with Node.js, Express, and MongoDB',
      contact: {
        name: 'API Support',
        email: 'support@kcmart.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server (local only)',
      },
      {
        url: 'https://your-api-url.onrender.com',
        description: 'Production server (update this with your deployed URL)',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'role'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'User name',
              example: 'John Seller',
            },
            email: {
              type: 'string',
              description: 'User email (optional)',
              example: 'john@example.com',
            },
            role: {
              type: 'string',
              enum: ['buyer', 'seller', 'admin'],
              description: 'User role',
              example: 'seller',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Product: {
          type: 'object',
          required: ['title', 'price', 'stock', 'category', 'sellerId'],
          properties: {
            _id: {
              type: 'string',
              description: 'Product ID',
              example: '507f1f77bcf86cd799439012',
            },
            title: {
              type: 'string',
              description: 'Product title',
              example: 'Laptop',
            },
            description: {
              type: 'string',
              description: 'Product description',
              example: 'High-performance laptop',
            },
            price: {
              type: 'number',
              description: 'Product price',
              example: 999.99,
            },
            stock: {
              type: 'number',
              description: 'Available stock',
              example: 10,
            },
            category: {
              type: 'string',
              description: 'Product category',
              example: 'Electronics',
            },
            image: {
              type: 'string',
              description: 'Product image URL or base64',
              example: '',
            },
            sellerId: {
              type: 'string',
              description: 'Seller user ID',
              example: '507f1f77bcf86cd799439011',
            },
            isActive: {
              type: 'boolean',
              description: 'Product active status (soft deletion)',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        OrderItem: {
          type: 'object',
          required: ['productId', 'quantity', 'unitPrice', 'subtotal'],
          properties: {
            productId: {
              type: 'string',
              description: 'Product ID',
              example: '507f1f77bcf86cd799439012',
            },
            quantity: {
              type: 'number',
              description: 'Item quantity',
              example: 2,
            },
            unitPrice: {
              type: 'number',
              description: 'Price per unit at time of order',
              example: 999.99,
            },
            subtotal: {
              type: 'number',
              description: 'Total for this item (quantity × unitPrice)',
              example: 1999.98,
            },
          },
        },
        Order: {
          type: 'object',
          required: ['buyerId', 'items', 'totalAmount'],
          properties: {
            _id: {
              type: 'string',
              description: 'Order ID',
              example: '507f1f77bcf86cd799439013',
            },
            buyerId: {
              type: 'string',
              description: 'Buyer user ID',
              example: '507f1f77bcf86cd799439011',
            },
            status: {
              type: 'string',
              enum: ['pending', 'paid', 'cancelled'],
              description: 'Order status',
              example: 'pending',
            },
            totalAmount: {
              type: 'number',
              description: 'Total order amount',
              example: 1999.98,
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem',
              },
              description: 'Order items',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Resource not found',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/app.js'], // Path to files containing Swagger annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;