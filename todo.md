# StockMaster - Inventory Management System Implementation Plan

## Project Structure (Max 8 Core Files)

### 1. Frontend Core Files
- **src/App.tsx** - Main app with routing, authentication flow, and layout
- **src/components/Dashboard.tsx** - Dashboard with KPIs, filters, and real-time data
- **src/components/Products.tsx** - Product management (CRUD, categories, reorder rules)
- **src/components/Operations.tsx** - Unified component for Receipts, Deliveries, Transfers, Adjustments

### 2. Backend Core Files
- **server/index.js** - Express server setup, middleware, routes
- **server/database.js** - PostgreSQL connection, schema initialization, queries
- **server/auth.js** - Authentication logic, OTP system, JWT tokens

### 3. Supporting Files
- **src/components/MoveHistory.tsx** - Stock ledger and movement logs

## Database Schema

### Tables:
1. **users** - id, email, password_hash, name, created_at
2. **products** - id, name, sku, category_id, unit_of_measure, reorder_point, created_at
3. **categories** - id, name, description
4. **warehouses** - id, name, location, is_active
5. **locations** - id, warehouse_id, name, type (rack/floor/storage)
6. **stock_levels** - id, product_id, location_id, quantity, last_updated
7. **receipts** - id, supplier_name, status, created_at, validated_at
8. **receipt_lines** - id, receipt_id, product_id, quantity, location_id
9. **deliveries** - id, customer_name, status, created_at, validated_at
10. **delivery_lines** - id, delivery_id, product_id, quantity, location_id
11. **transfers** - id, from_location_id, to_location_id, status, created_at
12. **transfer_lines** - id, transfer_id, product_id, quantity
13. **adjustments** - id, product_id, location_id, old_qty, new_qty, reason, created_at
14. **move_history** - id, product_id, type, from_location, to_location, quantity, timestamp, reference

## Features Implementation

### Authentication (Task 1)
- Signup/Login forms with validation
- JWT token-based authentication
- OTP password reset (email simulation)
- Protected routes

### Dashboard (Task 2)
- KPI cards: Total Products, Low Stock, Pending Operations
- Dynamic filters: document type, status, warehouse, category
- Real-time data fetching
- Charts for visual representation

### Products (Task 3)
- Product list with search and filters
- Create/Edit product form
- Category management
- Stock levels per location display
- Reorder rules configuration

### Receipts (Task 4)
- Create receipt form
- Add products with quantities
- Supplier information
- Validate → increase stock automatically

### Deliveries (Task 5)
- Create delivery order
- Pick/Pack workflow
- Validate → decrease stock automatically

### Internal Transfers (Task 6)
- Select source and destination locations
- Add products and quantities
- Validate → update location in stock_levels

### Adjustments (Task 7)
- Select product and location
- Enter physical count
- Auto-calculate difference
- Update stock and log

### Move History (Task 8)
- Complete ledger of all movements
- Filters by product, date, type
- Export functionality

### Settings (Task 9)
- Warehouse CRUD
- User profile management
- System preferences

## Tech Stack
- Frontend: React + TypeScript + Shadcn-ui + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL (using node-postgres)
- Authentication: JWT + bcrypt
- State Management: React Context API
- API: RESTful endpoints

## API Endpoints

### Auth
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/request-otp
- POST /api/auth/reset-password

### Products
- GET /api/products
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- GET /api/categories

### Operations
- GET /api/receipts
- POST /api/receipts
- POST /api/receipts/:id/validate
- GET /api/deliveries
- POST /api/deliveries
- POST /api/deliveries/:id/validate
- GET /api/transfers
- POST /api/transfers
- POST /api/transfers/:id/validate
- POST /api/adjustments

### Dashboard
- GET /api/dashboard/kpis
- GET /api/dashboard/operations

### History
- GET /api/move-history

### Settings
- GET /api/warehouses
- POST /api/warehouses
- GET /api/profile
- PUT /api/profile

## Implementation Priority
1. Database schema setup
2. Authentication system
3. Product management
4. Dashboard with KPIs
5. Receipts module
6. Deliveries module
7. Internal transfers
8. Adjustments
9. Move history
10. Settings

## Status
- [ ] Database schema
- [ ] Backend API
- [ ] Authentication
- [ ] Dashboard
- [ ] Products
- [ ] Receipts
- [ ] Deliveries
- [ ] Transfers
- [ ] Adjustments
- [ ] Move History
- [ ] Settings