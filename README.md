# KC Mart Multi-Seller Marketplace API

A RESTful API for a multi-seller marketplace built with Node.js, Express, and MongoDB. This API enables multiple sellers to list products and allows buyers to place orders in a centralized marketplace system.

**Repository**: [https://github.com/KnockoutCoder/multi-seller-marketplace.git](https://github.com/KnockoutCoder/multi-seller-marketplace.git)

## 🌟 Features

- **User Management**: Create and manage users with roles (buyer, seller, admin)
- **Product Management**: Sellers can create, update, and manage their product listings
- **Order Management**: Buyers can place orders with multiple products
- **Soft Deletion**: Products use soft deletion for data integrity
- **Swagger Documentation**: Interactive API documentation
- **Comprehensive Testing**: Unit tests with Jest and coverage reporting
- **Security**: Helmet.js for security headers, CORS configuration
- **Error Handling**: Centralized error handling middleware

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest with MongoDB Memory Server
- **Security**: Helmet, CORS
- **Development**: Nodemon for hot reloading

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (local instance or MongoDB Atlas account)

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KnockoutCoder/multi-seller-marketplace.git
   cd multi-seller-marketplace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install all dependencies and development dependencies listed in `package.json`.

   **Key dependencies included:**
   - `express` - Web framework for Node.js
   - `mongoose` - ODM (Object Document Mapper) for MongoDB
   - `dotenv` - Loads environment variables from .env file
   - `cors` - Enables Cross-Origin Resource Sharing
   - `helmet` - Security middleware for Express
   - `swagger-jsdoc` & `swagger-ui-express` - API documentation

   **Development dependencies included:**
   - `nodemon` - Automatically restarts the server when files change (development only)
   - `jest` - Testing framework
   - `mongodb-memory-server` - In-memory MongoDB for testing
   - `babel-jest` & `@babel/core` - JavaScript transpilation for testing

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```
   
   For local MongoDB:
   ```env
   MONGODB_URI=mongodb://localhost:27017/kc-mart
   PORT=3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   Or start the production server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 📝 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon (auto-reload)
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## 🧪 Testing

The project uses Jest for testing with MongoDB Memory Server for isolated test databases.

Run all tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

View coverage reports in the `coverage/` directory. The project maintains a 60% coverage threshold for branches, functions, lines, and statements.

## 🔗 Links

- **GitHub Repository**: [https://github.com/KnockoutCoder/multi-seller-marketplace.git](https://github.com/KnockoutCoder/multi-seller-marketplace.git)
- **Live API Documentation (Swagger)**: [https://kc-mart-api.onrender.com/api-docs/](https://kc-mart-api.onrender.com/api-docs/)
- **Frontend Demo (Storefront & Seller Dashboard)**: [https://kc-mart.vercel.app/](https://kc-mart.vercel.app/)
- **Production API**: [https://kc-mart-api.onrender.com](https://kc-mart-api.onrender.com)

## 📚 API Documentation

### Interactive Swagger Documentation

The Swagger UI provides an interactive interface to explore and test all API endpoints. Visit the [live API documentation](https://kc-mart-api.onrender.com/api-docs/) to try out the API endpoints directly from your browser.

### Frontend Demos

You can test the API using the provided frontend demo which includes a storefront for buyers and a seller/admin dashboard at [https://kc-mart.vercel.app/](https://kc-mart.vercel.app/).

## 🔌 API Endpoints

### Base URL

- **Production**: `https://kc-mart-api.onrender.com`
- **Local Development**: `http://localhost:3000`

### Users (`/users`)

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get a user by ID
- `PATCH /users/:id` - Update a user (partial update)

**User Roles**: `buyer`, `seller`, `admin`

### Products (`/products`)

- `POST /products` - Create a new product (requires seller role)
- `GET /products` - Get all active products (supports `category` and `sellerId` query params)
- `GET /products/:id` - Get a product by ID
- `PATCH /products/:id` - Update a product (partial update)
- `DELETE /products/:id` - Soft delete a product (sets `isActive` to false)

### Orders (`/orders`)

- `POST /orders` - Create a new order
- `GET /orders` - Get all orders (supports `buyerId` query param)
- `GET /orders/:id` - Get an order by ID

**Order Status**: `pending`, `paid`, `cancelled`

## 📁 Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── config/
│   ├── db.js             # MongoDB connection
│   └── swagger.js        # Swagger configuration
├── controllers/          # Request handlers
│   ├── user.controller.js
│   ├── product.controller.js
│   └── order.controller.js
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/              # API routes
│   ├── user.routes.js
│   ├── product.routes.js
│   └── order.routes.js
├── services/            # Business logic layer
│   ├── user.service.js
│   ├── product.service.js
│   └── order.service.js
└── middleware/          # Custom middleware
    ├── errorHandler.js
    └── notFound.js
```

## 📦 Data Models

### User
- `name` (required)
- `email` (optional, unique)
- `role` (required: `buyer`, `seller`, `admin`)
- `createdAt`, `updatedAt` (auto-managed)

### Product
- `title` (required)
- `description` (optional)
- `price` (required, min: 0)
- `stock` (required, min: 0)
- `category` (required)
- `image` (optional: URL or base64)
- `sellerId` (required, references User)
- `isActive` (default: true, for soft deletion)
- `createdAt`, `updatedAt` (auto-managed)

### Order
- `buyerId` (required, references User)
- `status` (default: `pending`, enum: `pending`, `paid`, `cancelled`)
- `totalAmount` (required, min: 0)
- `items` (required array of order items)
  - `productId` (references Product)
  - `quantity` (min: 1)
  - `unitPrice`
  - `subtotal`
- `createdAt`, `updatedAt` (auto-managed)

## 🔒 Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Centralized error handling to prevent information leakage

## 📝 Notes

- The API supports base64 image uploads (50MB limit for JSON payloads)
- Products use soft deletion (setting `isActive: false`) rather than hard deletion
- Order items store the price at the time of order (`unitPrice`) to preserve order history
- Email field in User model is optional and allows multiple null values (sparse unique index)

## 👤 Author

**KC Ninal**
- Email: homebasedkc@gmail.com

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

This is a decoupled backend API. Feel free to use it as a reference or integrate it with your own frontend application.

---

**Happy Coding! 🚀**
