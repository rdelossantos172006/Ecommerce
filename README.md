# Ruby's eShop - Christmas-Themed E-commerce Platform

Ruby's eShop is a complete e-commerce solution with a Next.js frontend and Python Flask backend.

## Project Structure

This project consists of two main parts:

- **Frontend**: A Next.js application with React components, Tailwind CSS, and a Christmas-themed UI
- **Backend**: A Python Flask RESTful API with SQLite database

## Technologies and Languages Used

- **Frontend**:
  - TypeScript/JavaScript - Core programming language
  - React.js - UI component library
  - Next.js - React framework for server-side rendering and routing
  - Tailwind CSS - Utility-first CSS framework for styling
  - Shadcn UI - Component library for consistent design
  - Lucide Icons - SVG icon set

- **Backend**:
  - Python - Backend programming language
  - Flask - Lightweight web framework
  - SQLite - Database for development
  - SQLAlchemy - ORM for database interactions
  - JWT - For authentication and authorization

## Use Cases and Applications

- **Primary Uses**:
  - Online retail store with multiple product categories
  - Seasonal promotions and sales campaigns
  - User account management and order history
  - Product reviews and ratings system

- **Target Users**:
  - Budget-conscious shoppers looking for affordable items
  - Gift shoppers during holiday seasons
  - Return customers with user accounts
  - Mobile and desktop shoppers (responsive design)

## Payment Processing

Payment processing is implemented using a secure multi-step approach:

1. **Payment Methods**:
   - Credit/debit cards (processed through a payment gateway)
   - Cash on delivery option

2. **Payment Flow**:
   - User enters payment details at checkout
   - System validates information with basic checks
   - Payment gateway handles transaction processing
   - Order confirmation is generated after successful payment
   - Receipt is emailed to the customer

3. **Refund Process**:
   - Refund requests can be initiated through the user account
   - Admin approval required for processing
   - Funds returned to original payment method

## Features

- User authentication (login, register, profile management)
- Product browsing and search
- Shopping cart
- Wishlist
- Order processing
- Product reviews
- Christmas-themed UI with snow animations and decorations

## Demo Accounts

For testing, you can use these accounts:

- **Test User**: test@example.com / test123
