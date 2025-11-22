# StockMaster - Modular Inventory Management System

<div align="center">

![StockMaster Logo](https://img.shields.io/badge/StockMaster-Inventory%20Management-purple?style=for-the-badge)

A complete, production-ready inventory management system built with modern web technologies.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#features) • [Installation](#installation) • [Usage](#usage-guide) • [API Documentation](#api-endpoints) • [Architecture](#technical-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Stock Movement Logic](#stock-movement-logic)
- [Development Guidelines](#development-guidelines)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**StockMaster** is a comprehensive, modular inventory management system designed to digitize and streamline all stock-related operations within a business. It replaces manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use application.

### Target Users

- **Inventory Managers** - Manage incoming & outgoing stock operations
- **Warehouse Staff** - Perform transfers, picking, shelving, and counting
- **Business Owners** - Monitor stock levels and operational efficiency

---

## 🚀 Problem Statement

Traditional inventory management faces several challenges:

- ❌ Manual record-keeping prone to errors
- ❌ Scattered data across multiple Excel sheets
- ❌ No real-time visibility of stock levels
- ❌ Difficulty tracking stock movements
- ❌ Time-consuming physical counts and reconciliation

**StockMaster solves these problems by providing:**

- ✅ Centralized digital inventory system
- ✅ Real-time stock level updates
- ✅ Automated stock movement tracking
- ✅ Multi-warehouse support
- ✅ Complete audit trail of all operations

---

## ✨ Features

### 1. 🔐 Authentication System

- **User Signup & Login** - Secure account creation and authentication
- **OTP-based Password Reset** - Forgot password recovery via OTP
- **JWT Token Authentication** - Secure session management
- **Protected Routes** - Role-based access control

### 2. 📊 Dashboard

Real-time overview of inventory operations with:

- **KPI Cards:**
  - Total Products in Stock
  - Low Stock / Out of Stock Items
  - Pending Receipts
  - Pending Deliveries
  - Internal Transfers Scheduled

- **Dynamic Filters:**
  - By document type (Receipts / Delivery / Internal / Adjustments)
  - By status (Draft, Waiting, Ready, Done, Cancelled)
  - By warehouse or location
  - By product category

- **Quick Actions:**
  - Direct access to all major operations
  - One-click navigation to key modules

### 3. 📦 Product Management

Complete product catalog management:

- **Create/Update Products** with:
  - Product Name
  - SKU / Code (unique identifier)
  - Category assignment
  - Unit of Measure (Units, Kg, Liters, etc.)
  - Reorder Point (low stock threshold)
  - Initial Stock (optional)

- **Stock Visibility:**
  - Stock availability per location
  - Total stock across all locations
  - Low stock alerts

- **Category Management:**
  - Organize products by categories
  - Filter and search by category

- **Reorder Rules:**
  - Set minimum stock levels
  - Automatic low stock notifications

### 4. 🚚 Operations Management

#### A. Receipts (Incoming Stock)

Process incoming goods from suppliers:

1. Create new receipt document
2. Add supplier information
3. Add products with quantities and destination locations
4. Save as draft for review
5. Validate to automatically increase stock
6. System logs movement in history

**Example Flow:**
```
Receive 100 units of Steel Rods from Supplier A
→ Select Location: Main Warehouse - Rack A
→ Validate Receipt
→ Stock increases by 100 units
→ Movement logged in history
```

#### B. Deliveries (Outgoing Stock)

Manage outgoing stock for customer orders:

1. Create delivery order
2. Add customer information
3. Add products with quantities from specific locations
4. Pick items (draft status)
5. Pack items (ready status)
6. Validate to automatically decrease stock
7. System checks availability and logs movement

**Example Flow:**
```
Customer orders 20 Steel Chairs
→ Select Location: Main Warehouse - Rack B
→ System checks: 50 chairs available ✓
→ Validate Delivery
→ Stock decreases by 20 units
→ Movement logged in history
```

#### C. Internal Transfers

Move stock between locations:

- **Transfer Types:**
  - Warehouse to Warehouse
  - Rack to Rack
  - Storage to Production Floor

- **Process:**
  1. Select source location
  2. Select destination location
  3. Add products and quantities
  4. System checks source availability
  5. Validate to move stock
  6. Stock levels updated at both locations
  7. Movement logged

**Example Flow:**
```
Transfer 30 units from Main Warehouse → Production Floor
→ Source: Main Warehouse - Rack A (50 available) ✓
→ Destination: Production Floor - Area 1
→ Validate Transfer
→ Source: -30 units, Destination: +30 units
→ Movement logged
```

#### D. Inventory Adjustments

Reconcile physical counts with system records:

1. Select product and location
2. Enter actual physical count
3. System calculates difference
4. Add reason for adjustment
5. Stock automatically adjusted
6. Adjustment logged with reason

**Example Flow:**
```
Physical Count: 47 units (System shows: 50 units)
→ Difference: -3 units
→ Reason: "3 units damaged during inspection"
→ Stock adjusted to 47 units
→ Adjustment logged in history
```

### 5. 📜 Move History (Stock Ledger)

Complete audit trail of all stock movements:

- **Comprehensive Logging:**
  - Product details (name, SKU)
  - Movement type (receipt, delivery, transfer, adjustment)
  - Source and destination locations
  - Quantity moved
  - Timestamp
  - Reference document

- **Filtering Options:**
  - By movement type
  - By product
  - By date range
  - By location

- **Export Functionality:**
  - Download movement history
  - Generate reports

### 6. ⚙️ Settings

System configuration and management:

- **Warehouse Management:**
  - Create/edit warehouses
  - Add locations within warehouses
  - Activate/deactivate warehouses

- **User Profile:**
  - Update personal information
  - Change password
  - View account details

- **System Information:**
  - Version details
  - Database status
  - Backup information

---

## 🏗️ Technical Architecture

### Tech Stack

#### Frontend
- **Framework:** React 18.3 with TypeScript
- **UI Library:** Shadcn-ui components
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Routing:** React Router v6
- **State Management:** React Context API
- **Build Tool:** Vite 5.4

#### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 5.1
- **Language:** JavaScript (ES Modules)
- **Authentication:** JWT + bcrypt
- **API Style:** RESTful

#### Database
- **RDBMS:** PostgreSQL 14+
- **Driver:** node-postgres (pg)
- **Schema:** Relational with foreign keys
- **Transactions:** ACID compliant

### Project Structure

```
stockmaster/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── Auth.tsx            # Authentication component
│   │   ├── Dashboard.tsx       # Dashboard with KPIs
│   │   ├── Products.tsx        # Product management
│   │   ├── Operations.tsx      # Unified operations component
│   │   ├── MoveHistory.tsx     # Movement history
│   │   ├── Settings.tsx        # Settings page
│   │   └── Sidebar.tsx         # Navigation sidebar
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── server/                      # Backend source code
│   ├── index.js                # Express server
│   ├── database.js             # Database connection & schema
│   └── auth.js                 # Authentication logic
├── public/                      # Static assets
├── dist/                        # Production build
├── index.html                   # HTML entry point
├── package.json                 # Dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                    # This file
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │ Products │  │Operations│  │  History │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                         │                                    │
│                    REST API Calls                           │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express + Node.js)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication Middleware (JWT)                      │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │  API Routes                                           │  │
│  │  • /api/auth/*        • /api/receipts/*              │  │
│  │  • /api/products/*    • /api/deliveries/*            │  │
│  │  • /api/dashboard/*   • /api/transfers/*             │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │  Business Logic Layer                                 │  │
│  │  • Stock Movement Logic                               │  │
│  │  • Validation Rules                                   │  │
│  │  • Transaction Management                             │  │
│  └──────────────────┬───────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ products │  │warehouses│  │locations │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ receipts │  │deliveries│  │ transfers│  │stock_lvls│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐                                │
│  │move_hist │  │categories│                                │
│  └──────────┘  └──────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📥 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14.0 or higher ([Download](https://www.postgresql.org/download/))
- **pnpm** (recommended) or npm package manager

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/HarshTambade/StockMaster.git
cd StockMaster
```

#### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

#### 3. Setup PostgreSQL Database

**Option A: Using createdb command**
```bash
createdb stockmaster
```

**Option B: Using psql**
```bash
psql -U postgres
CREATE DATABASE stockmaster;
\q
```

**Option C: Using pgAdmin**
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Name: `stockmaster`
5. Click "Save"

#### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=stockmaster
DB_PASSWORD=your_password_here
DB_PORT=5432

# JWT Secret (Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server Port
PORT=3001
```

⚠️ **Important:** Change `JWT_SECRET` to a strong random string in production!

#### 5. Start the Backend Server

Open a terminal and run:

```bash
node server/index.js
```

You should see:
```
Server running on port 3001
Database initialized successfully
```

The backend will automatically:
- Create all database tables
- Insert default categories
- Setup default warehouses and locations

#### 6. Start the Frontend (Development)

The frontend is already running if you're using the MGX platform preview.

For local development:
```bash
pnpm run dev
```

Access the application at: `http://localhost:5173`

#### 7. Build for Production

```bash
pnpm run build
```

The production build will be in the `dist/` directory.

---

## 📖 Usage Guide

### Getting Started

#### 1. Create Your Account

1. Open the application
2. Click "Don't have an account? Sign up"
3. Enter:
   - Email address
   - Password (minimum 8 characters)
   - Full name
4. Click "Sign Up"
5. You'll be automatically logged in

#### 2. Login

1. Enter your email and password
2. Click "Login"
3. You'll be redirected to the Dashboard

#### 3. Forgot Password?

1. Click "Forgot password?" on login page
2. Enter your email
3. Click "Send OTP"
4. Check console for OTP (in development mode)
5. Enter OTP and new password
6. Click "Reset Password"

### Core Workflows

#### Workflow 1: Adding Products

```
Dashboard → Products → Add Product
↓
Fill Product Details:
- Name: "Steel Rods"
- SKU: "SR-001"
- Category: "Raw Materials"
- Unit: "Kg"
- Reorder Point: 50
- Initial Stock: 100 (optional)
- Location: "Main Warehouse - Rack A" (if initial stock)
↓
Click "Create Product"
↓
Product added successfully!
```

#### Workflow 2: Receiving Stock

```
Dashboard → Receipts → New Receipt
↓
Enter Supplier: "ABC Suppliers Ltd"
↓
Add Products:
- Product: "Steel Rods (SR-001)"
- Quantity: 200
- Location: "Main Warehouse - Rack A"
↓
Click "Create" (saves as draft)
↓
Review and click "Validate"
↓
Stock increased by 200 units
Movement logged in history
```

#### Workflow 3: Delivering Stock

```
Dashboard → Deliveries → New Delivery
↓
Enter Customer: "XYZ Manufacturing"
↓
Add Products:
- Product: "Steel Rods (SR-001)"
- Quantity: 50
- Location: "Main Warehouse - Rack A"
↓
Click "Create" (saves as draft)
↓
Review and click "Validate"
↓
System checks availability (250 available) ✓
Stock decreased by 50 units
Movement logged in history
```

#### Workflow 4: Internal Transfer

```
Dashboard → Internal Transfers → New Transfer
↓
From Location: "Main Warehouse - Rack A"
To Location: "Production Floor - Area 1"
↓
Add Products:
- Product: "Steel Rods (SR-001)"
- Quantity: 100
↓
Click "Create" (saves as draft)
↓
Review and click "Validate"
↓
System checks source availability (200 available) ✓
Stock moved: Rack A (-100), Area 1 (+100)
Movement logged in history
```

#### Workflow 5: Stock Adjustment

```
Dashboard → Adjustments → New Adjustment
↓
Select Product: "Steel Rods (SR-001)"
Select Location: "Main Warehouse - Rack A"
↓
Current System Count: 100
Enter Physical Count: 97
↓
Difference: -3 units
Reason: "3 units damaged during inspection"
↓
Click "Create"
↓
Stock adjusted to 97 units
Adjustment logged in history
```

### Best Practices

1. **Always validate receipts immediately** after physical verification
2. **Use draft status** for operations that need review
3. **Add detailed reasons** for adjustments
4. **Regularly check Move History** for audit trails
5. **Set appropriate reorder points** to avoid stockouts
6. **Use categories** to organize products effectively
7. **Perform regular physical counts** and adjustments

---

## 🔌 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/request-otp`
Request OTP for password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

#### POST `/api/auth/reset-password`
Reset password using OTP.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

### Product Endpoints

#### GET `/api/products`
Get all products with stock information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Steel Rods",
    "sku": "SR-001",
    "category_name": "Raw Materials",
    "unit_of_measure": "Kg",
    "reorder_point": 50,
    "total_stock": 200
  }
]
```

#### POST `/api/products`
Create a new product.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Steel Rods",
  "sku": "SR-001",
  "category_id": 3,
  "unit_of_measure": "Kg",
  "reorder_point": 50,
  "initial_stock": 100,
  "location_id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Steel Rods",
  "sku": "SR-001",
  "category_id": 3,
  "unit_of_measure": "Kg",
  "reorder_point": 50,
  "created_at": "2025-01-15T10:30:00.000Z"
}
```

### Receipt Endpoints

#### GET `/api/receipts`
Get all receipts.

**Response:**
```json
[
  {
    "id": 1,
    "supplier_name": "ABC Suppliers",
    "status": "draft",
    "line_count": 2,
    "total_quantity": 150,
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

#### POST `/api/receipts`
Create a new receipt.

**Request Body:**
```json
{
  "supplier_name": "ABC Suppliers",
  "lines": [
    {
      "product_id": 1,
      "quantity": 100,
      "location_id": 1
    }
  ]
}
```

#### POST `/api/receipts/:id/validate`
Validate a receipt and increase stock.

**Response:**
```json
{
  "message": "Receipt validated successfully"
}
```

### Delivery Endpoints

#### GET `/api/deliveries`
Get all deliveries.

#### POST `/api/deliveries`
Create a new delivery.

**Request Body:**
```json
{
  "customer_name": "XYZ Manufacturing",
  "lines": [
    {
      "product_id": 1,
      "quantity": 50,
      "location_id": 1
    }
  ]
}
```

#### POST `/api/deliveries/:id/validate`
Validate a delivery and decrease stock.

### Transfer Endpoints

#### GET `/api/transfers`
Get all transfers.

#### POST `/api/transfers`
Create a new transfer.

**Request Body:**
```json
{
  "from_location_id": 1,
  "to_location_id": 3,
  "lines": [
    {
      "product_id": 1,
      "quantity": 100
    }
  ]
}
```

#### POST `/api/transfers/:id/validate`
Validate a transfer and move stock.

### Adjustment Endpoints

#### POST `/api/adjustments`
Create a stock adjustment.

**Request Body:**
```json
{
  "product_id": 1,
  "location_id": 1,
  "new_quantity": 97,
  "reason": "3 units damaged"
}
```

### Dashboard Endpoints

#### GET `/api/dashboard/kpis`
Get dashboard KPIs.

**Response:**
```json
{
  "totalProducts": 25,
  "totalStock": 5000,
  "lowStock": 3,
  "pendingReceipts": 5,
  "pendingDeliveries": 8,
  "pendingTransfers": 2
}
```

### History Endpoints

#### GET `/api/move-history`
Get movement history (last 100 records).

**Response:**
```json
[
  {
    "id": 1,
    "product_name": "Steel Rods",
    "sku": "SR-001",
    "type": "receipt",
    "from_location": null,
    "to_location": "Location 1",
    "quantity": 100,
    "reference": "Receipt 1",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

### Settings Endpoints

#### GET `/api/warehouses`
Get all active warehouses.

#### GET `/api/locations`
Get all locations with warehouse information.

#### GET `/api/categories`
Get all product categories.

#### GET `/api/profile`
Get current user profile.

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   users     │         │  categories  │         │ warehouses  │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)      │         │ id (PK)     │
│ email       │         │ name         │         │ name        │
│ password    │         │ description  │         │ location    │
│ name        │         └──────────────┘         │ is_active   │
│ created_at  │                │                 └─────────────┘
└─────────────┘                │                        │
                               │                        │
                               ▼                        ▼
                        ┌──────────────┐         ┌─────────────┐
                        │   products   │         │  locations  │
                        ├──────────────┤         ├─────────────┤
                        │ id (PK)      │         │ id (PK)     │
                        │ name         │         │ warehouse_id│
                        │ sku          │         │ name        │
                        │ category_id  │◄────┐   │ type        │
                        │ unit_measure │     │   └─────────────┘
                        │ reorder_point│     │          │
                        │ created_at   │     │          │
                        └──────────────┘     │          │
                               │             │          │
                               ▼             │          ▼
                        ┌──────────────┐    │   ┌─────────────┐
                        │ stock_levels │    │   │  receipts   │
                        ├──────────────┤    │   ├─────────────┤
                        │ id (PK)      │    │   │ id (PK)     │
                        │ product_id   │────┘   │ supplier    │
                        │ location_id  │────┐   │ status      │
                        │ quantity     │    │   │ created_at  │
                        │ last_updated │    │   │ validated_at│
                        └──────────────┘    │   └─────────────┘
                                           │          │
                                           │          ▼
                                           │   ┌──────────────┐
                                           │   │receipt_lines │
                                           │   ├──────────────┤
                                           │   │ id (PK)      │
                                           │   │ receipt_id   │
                                           └───│ product_id   │
                                               │ quantity     │
                                               │ location_id  │
                                               └──────────────┘
```

### Table Definitions

#### Core Tables

**users**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**categories**
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT
);
```

**products**
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  unit_of_measure VARCHAR(50) NOT NULL,
  reorder_point INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**warehouses**
```sql
CREATE TABLE warehouses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  is_active BOOLEAN DEFAULT true
);
```

**locations**
```sql
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  warehouse_id INTEGER REFERENCES warehouses(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'storage'
);
```

**stock_levels**
```sql
CREATE TABLE stock_levels (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  location_id INTEGER REFERENCES locations(id),
  quantity INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, location_id)
);
```

#### Operation Tables

**receipts & receipt_lines**
```sql
CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  supplier_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  validated_at TIMESTAMP
);

CREATE TABLE receipt_lines (
  id SERIAL PRIMARY KEY,
  receipt_id INTEGER REFERENCES receipts(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  location_id INTEGER REFERENCES locations(id)
);
```

**deliveries & delivery_lines**
```sql
CREATE TABLE deliveries (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  validated_at TIMESTAMP
);

CREATE TABLE delivery_lines (
  id SERIAL PRIMARY KEY,
  delivery_id INTEGER REFERENCES deliveries(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  location_id INTEGER REFERENCES locations(id)
);
```

**transfers & transfer_lines**
```sql
CREATE TABLE transfers (
  id SERIAL PRIMARY KEY,
  from_location_id INTEGER REFERENCES locations(id),
  to_location_id INTEGER REFERENCES locations(id),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  validated_at TIMESTAMP
);

CREATE TABLE transfer_lines (
  id SERIAL PRIMARY KEY,
  transfer_id INTEGER REFERENCES transfers(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL
);
```

**adjustments**
```sql
CREATE TABLE adjustments (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  location_id INTEGER REFERENCES locations(id),
  old_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**move_history**
```sql
CREATE TABLE move_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  type VARCHAR(50) NOT NULL,
  from_location VARCHAR(255),
  to_location VARCHAR(255),
  quantity INTEGER NOT NULL,
  reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Default Data

The system automatically creates:

**Categories:**
- Electronics
- Furniture
- Raw Materials

**Warehouses:**
- Main Warehouse (Building A)
- Production Floor (Building B)

**Locations:**
- Main Warehouse - Rack A
- Main Warehouse - Rack B
- Production Floor - Production Area

---

## 🔄 Stock Movement Logic

### Receipt Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    RECEIPT WORKFLOW                          │
└─────────────────────────────────────────────────────────────┘

1. CREATE RECEIPT
   ├─ User enters supplier name
   ├─ Adds products with quantities
   └─ Selects destination locations
   
2. SAVE AS DRAFT
   ├─ Receipt saved with status: 'draft'
   └─ No stock changes yet
   
3. VALIDATE RECEIPT
   ├─ System checks all lines
   ├─ For each product line:
   │  ├─ Check if stock_level exists for (product_id, location_id)
   │  ├─ If exists: UPDATE quantity = quantity + received_qty
   │  └─ If not: INSERT new stock_level record
   ├─ Log movement in move_history
   │  ├─ type: 'receipt'
   │  ├─ to_location: destination location
   │  ├─ quantity: received quantity
   │  └─ reference: 'Receipt #{id}'
   └─ Update receipt status: 'done'

4. RESULT
   └─ Stock increased at destination location
```

### Delivery Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   DELIVERY WORKFLOW                          │
└─────────────────────────────────────────────────────────────┘

1. CREATE DELIVERY
   ├─ User enters customer name
   ├─ Adds products with quantities
   └─ Selects source locations
   
2. SAVE AS DRAFT
   ├─ Delivery saved with status: 'draft'
   └─ No stock changes yet
   
3. VALIDATE DELIVERY
   ├─ System checks all lines
   ├─ For each product line:
   │  ├─ CHECK: stock_level.quantity >= delivery_qty
   │  ├─ If insufficient: ABORT with error
   │  ├─ If sufficient: UPDATE quantity = quantity - delivery_qty
   │  └─ Log movement in move_history
   │     ├─ type: 'delivery'
   │     ├─ from_location: source location
   │     ├─ quantity: delivered quantity
   │     └─ reference: 'Delivery #{id}'
   └─ Update delivery status: 'done'

4. RESULT
   └─ Stock decreased at source location
```

### Transfer Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   TRANSFER WORKFLOW                          │
└─────────────────────────────────────────────────────────────┘

1. CREATE TRANSFER
   ├─ User selects source location
   ├─ Selects destination location
   └─ Adds products with quantities
   
2. SAVE AS DRAFT
   ├─ Transfer saved with status: 'draft'
   └─ No stock changes yet
   
3. VALIDATE TRANSFER
   ├─ System checks all lines
   ├─ For each product line:
   │  ├─ CHECK: source stock_level.quantity >= transfer_qty
   │  ├─ If insufficient: ABORT with error
   │  ├─ If sufficient:
   │  │  ├─ DECREASE source: quantity = quantity - transfer_qty
   │  │  ├─ Check if destination stock_level exists
   │  │  ├─ If exists: INCREASE quantity = quantity + transfer_qty
   │  │  └─ If not: INSERT new stock_level with transfer_qty
   │  └─ Log movement in move_history
   │     ├─ type: 'transfer'
   │     ├─ from_location: source location
   │     ├─ to_location: destination location
   │     ├─ quantity: transferred quantity
   │     └─ reference: 'Transfer #{id}'
   └─ Update transfer status: 'done'

4. RESULT
   ├─ Stock decreased at source location
   └─ Stock increased at destination location
```

### Adjustment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  ADJUSTMENT WORKFLOW                         │
└─────────────────────────────────────────────────────────────┘

1. INITIATE ADJUSTMENT
   ├─ User selects product
   ├─ Selects location
   └─ Enters physical count
   
2. CALCULATE DIFFERENCE
   ├─ Get current system quantity
   ├─ Calculate: difference = new_qty - old_qty
   └─ Display difference to user
   
3. CONFIRM ADJUSTMENT
   ├─ User enters reason
   └─ Submits adjustment
   
4. PROCESS ADJUSTMENT
   ├─ Check if stock_level exists
   ├─ If exists: UPDATE quantity = new_qty
   ├─ If not: INSERT new stock_level with new_qty
   ├─ INSERT adjustment record
   │  ├─ old_quantity: system quantity
   │  ├─ new_quantity: physical count
   │  └─ reason: user-provided reason
   └─ Log movement in move_history
      ├─ type: 'adjustment'
      ├─ to_location: adjusted location
      ├─ quantity: difference (can be negative)
      └─ reference: 'Adjustment: {reason}'

5. RESULT
   └─ Stock updated to match physical count
```

### Transaction Management

All stock operations use database transactions to ensure data integrity:

```javascript
// Example: Receipt Validation with Transaction
const client = await pool.connect();
try {
  await client.query('BEGIN');
  
  // 1. Update stock levels
  // 2. Log movements
  // 3. Update operation status
  
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

This ensures:
- **Atomicity:** All changes succeed or all fail
- **Consistency:** Database remains in valid state
- **Isolation:** Concurrent operations don't interfere
- **Durability:** Committed changes are permanent

---

## 💻 Development Guidelines

### Code Style

- **TypeScript:** Strict mode enabled
- **ESLint:** Configured for React and TypeScript
- **Formatting:** Consistent indentation (2 spaces)
- **Naming:**
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files: kebab-case or PascalCase for components

### Component Structure

```typescript
// Good component structure
interface ComponentProps {
  prop1: string;
  prop2: number;
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // 1. State declarations
  const [state, setState] = useState();
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 3. Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### API Best Practices

1. **Always use try-catch** for async operations
2. **Validate input** on both frontend and backend
3. **Return appropriate HTTP status codes**
4. **Include error messages** in responses
5. **Use transactions** for multi-step operations

### Testing Checklist

Before committing code:

- [ ] Run `pnpm run lint` - No errors
- [ ] Run `pnpm run build` - Builds successfully
- [ ] Test all CRUD operations
- [ ] Test validation logic
- [ ] Test error handling
- [ ] Check responsive design
- [ ] Verify database transactions

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
```

### Commit Message Convention

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 🔒 Security

### Implemented Security Measures

1. **Authentication:**
   - JWT token-based authentication
   - Password hashing with bcrypt (10 rounds)
   - Secure session management

2. **Authorization:**
   - Protected API routes
   - Token verification middleware
   - User-specific data access

3. **Input Validation:**
   - Frontend form validation
   - Backend data validation
   - SQL injection prevention (parameterized queries)

4. **Password Security:**
   - Minimum password requirements
   - Secure password reset with OTP
   - Password hashing before storage

### Security Best Practices

⚠️ **Production Checklist:**

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL
- [ ] Implement rate limiting on API endpoints
- [ ] Add CORS whitelist for production domains
- [ ] Use secure session cookies
- [ ] Implement SQL injection prevention
- [ ] Add XSS protection headers
- [ ] Enable CSRF protection
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Implement proper logging
- [ ] Setup database backups
- [ ] Use prepared statements

### Environment Variables Security

Never commit `.env` file to version control:

```bash
# Add to .gitignore
.env
.env.local
.env.production
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Backend Won't Start

**Error:** `ECONNREFUSED` or `Database connection failed`

**Solutions:**
- Ensure PostgreSQL is running: `sudo service postgresql status`
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`
- Check port 5432 is not in use

#### 2. Frontend Can't Connect to Backend

**Error:** `Network Error` or `Failed to fetch`

**Solutions:**
- Ensure backend is running on port 3001
- Check CORS configuration in `server/index.js`
- Verify `API_URL` in frontend components
- Check browser console for detailed errors

#### 3. Authentication Fails

**Error:** `Invalid token` or `No token provided`

**Solutions:**
- Clear browser localStorage
- Check JWT_SECRET matches between sessions
- Verify token is being sent in Authorization header
- Check token expiration (7 days default)

#### 4. Stock Not Updating

**Error:** Operations validate but stock doesn't change

**Solutions:**
- Check database transactions are committing
- Verify stock_levels table has records
- Check for database constraint violations
- Review move_history for logged operations

#### 5. Build Fails

**Error:** TypeScript or ESLint errors

**Solutions:**
- Run `pnpm run lint` to see specific errors
- Check for missing type definitions
- Verify all imports are correct
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`

#### 6. Database Schema Issues

**Error:** Table doesn't exist or column missing

**Solutions:**
- Drop and recreate database:
  ```bash
  dropdb stockmaster
  createdb stockmaster
  node server/index.js  # Reinitialize schema
  ```
- Check server logs for schema creation errors
- Verify PostgreSQL version compatibility

### Debug Mode

Enable detailed logging:

```javascript
// In server/index.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

### Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review server logs for errors
3. Check browser console for frontend errors
4. Search existing GitHub issues
5. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, PostgreSQL version)
   - Relevant logs

---

## 🚀 Future Enhancements

### Planned Features

#### Phase 1: Core Improvements
- [ ] **Barcode Scanning** - Mobile app with barcode scanner
- [ ] **Advanced Reporting** - Custom reports and analytics
- [ ] **Email Notifications** - Alerts for low stock, pending operations
- [ ] **Multi-currency Support** - International pricing
- [ ] **Batch Operations** - Bulk import/export of products

#### Phase 2: Advanced Features
- [ ] **Role-based Access Control** - Admin, Manager, Staff roles
- [ ] **API Documentation** - Swagger/OpenAPI documentation
- [ ] **Automated Backup System** - Scheduled database backups
- [ ] **Mobile App** - Native iOS/Android applications
- [ ] **Real-time Notifications** - WebSocket-based updates

#### Phase 3: Enterprise Features
- [ ] **Multi-tenant Support** - Multiple companies in one instance
- [ ] **Advanced Analytics** - AI-powered insights
- [ ] **Integration APIs** - Connect with ERP systems
- [ ] **Blockchain Tracking** - Immutable audit trail
- [ ] **IoT Integration** - Smart warehouse sensors

### Contributing to Development

We welcome contributions! See [Contributing](#contributing) section below.

---

## 🤝 Contributing

We love contributions! Here's how you can help:

### Ways to Contribute

1. **Report Bugs** - Open an issue with details
2. **Suggest Features** - Share your ideas
3. **Improve Documentation** - Fix typos, add examples
4. **Submit Code** - Fix bugs or add features
5. **Write Tests** - Improve code coverage
6. **Review Pull Requests** - Help review others' code

### Contribution Process

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR_USERNAME/StockMaster.git
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Describe your changes
   - Wait for review

### Code Review Process

- All PRs require at least one review
- CI/CD checks must pass
- Code must follow style guidelines
- Tests must pass
- Documentation must be updated

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 StockMaster

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support & Contact

### Documentation

- **Full Documentation:** [GitHub Wiki](https://github.com/HarshTambade/StockMaster/wiki)
- **API Reference:** [API Docs](https://github.com/HarshTambade/StockMaster/wiki/API)
- **Video Tutorials:** Coming soon

### Community

- **GitHub Issues:** [Report bugs or request features](https://github.com/HarshTambade/StockMaster/issues)
- **Discussions:** [Join the conversation](https://github.com/HarshTambade/StockMaster/discussions)

### Professional Support

For enterprise support, custom development, or consulting:
- Email: support@stockmaster.example.com
- Website: https://stockmaster.example.com

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:

- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn-ui](https://ui.shadcn.com/) - UI components
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - Web framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Vite](https://vitejs.dev/) - Build tool

Special thanks to all contributors and the open-source community!

---

<div align="center">

**Made with ❤️ by the StockMaster Team**

[⬆ Back to Top](#stockmaster---modular-inventory-management-system)

</div>