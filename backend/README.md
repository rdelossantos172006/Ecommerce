# Ruby's eShop Backend

This is the backend service for Ruby's eShop, a Christmas-themed e-commerce platform. The backend is built with Python using Flask and SQLite.

## Features

- RESTful API
- Authentication with JWT
- Database with SQLite
- OOP design pattern
- Endpoints for products, orders, wishlist, and reviews

## Setup

### Prerequisites

- Python 3.8+

### Installation

1. Create a virtual environment (recommended):

```bash
python -m venv venv
```

2. Activate the virtual environment:

- Windows:
```bash
venv\Scripts\activate
```

- macOS/Linux:
```bash
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Seed the database with initial data:

```bash
python database/seed.py
```

### Running the Server

To start the development server:

```bash
python run.py
```

The server will start at http://localhost:5000 by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/sale` - Get products on sale
- `GET /api/products/search` - Search products

### Orders

- `GET /api/orders` - Get all orders for the current user
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create a new order

### Wishlist

- `GET /api/wishlist` - Get the current user's wishlist
- `POST /api/wishlist` - Add a product to the wishlist
- `DELETE /api/wishlist/:productId` - Remove a product from the wishlist

### Reviews

- `GET /api/reviews/product/:productId` - Get reviews for a product
- `POST /api/reviews/product/:productId` - Create a new review

## Demo Account

You can use the following test account to login:

- Email: test@example.com
- Password: test123 