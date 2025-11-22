import express from 'express';
import cors from 'cors';
import { pool, initializeDatabase } from './database.js';
import { signup, login, requestOTP, resetPassword, verifyToken } from './auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database on startup
initializeDatabase().catch(console.error);

// Auth routes
app.post('/api/auth/signup', signup);
app.post('/api/auth/login', login);
app.post('/api/auth/request-otp', requestOTP);
app.post('/api/auth/reset-password', resetPassword);

// Protected routes middleware - applies to all routes except auth
const protectedRoute = (req, res, next) => {
  if (req.path.startsWith('/api/auth')) {
    return next();
  }
  return verifyToken(req, res, next);
};

app.use('/api/', protectedRoute);

// Dashboard KPIs
app.get('/api/dashboard/kpis', async (req, res) => {
  try {
    const totalProducts = await pool.query('SELECT COUNT(*) FROM products');
    const totalStock = await pool.query('SELECT SUM(quantity) FROM stock_levels');
    
    const lowStock = await pool.query(`
      SELECT COUNT(DISTINCT p.id) 
      FROM products p
      JOIN stock_levels sl ON p.id = sl.product_id
      WHERE sl.quantity <= p.reorder_point
    `);

    const pendingReceipts = await pool.query(
      "SELECT COUNT(*) FROM receipts WHERE status IN ('draft', 'waiting')"
    );

    const pendingDeliveries = await pool.query(
      "SELECT COUNT(*) FROM deliveries WHERE status IN ('draft', 'waiting')"
    );

    const pendingTransfers = await pool.query(
      "SELECT COUNT(*) FROM transfers WHERE status IN ('draft', 'waiting')"
    );

    res.json({
      totalProducts: parseInt(totalProducts.rows[0].count),
      totalStock: parseInt(totalStock.rows[0].sum) || 0,
      lowStock: parseInt(lowStock.rows[0].count),
      pendingReceipts: parseInt(pendingReceipts.rows[0].count),
      pendingDeliveries: parseInt(pendingDeliveries.rows[0].count),
      pendingTransfers: parseInt(pendingTransfers.rows[0].count)
    });
  } catch (error) {
    console.error('Dashboard KPIs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name,
             COALESCE(SUM(sl.quantity), 0) as total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN stock_levels sl ON p.id = sl.product_id
      GROUP BY p.id, c.name
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, sku, category_id, unit_of_measure, reorder_point, initial_stock, location_id } = req.body;

    const result = await pool.query(
      'INSERT INTO products (name, sku, category_id, unit_of_measure, reorder_point) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, sku, category_id, unit_of_measure, reorder_point || 10]
    );

    const product = result.rows[0];

    // Add initial stock if provided
    if (initial_stock && location_id) {
      await pool.query(
        'INSERT INTO stock_levels (product_id, location_id, quantity) VALUES ($1, $2, $3)',
        [product.id, location_id, initial_stock]
      );

      await pool.query(
        'INSERT INTO move_history (product_id, type, to_location, quantity, reference) VALUES ($1, $2, $3, $4, $5)',
        [product.id, 'initial', `Location ${location_id}`, initial_stock, 'Initial Stock']
      );
    }

    res.json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Warehouses
app.get('/api/warehouses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM warehouses WHERE is_active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Locations
app.get('/api/locations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, w.name as warehouse_name
      FROM locations l
      JOIN warehouses w ON l.warehouse_id = w.id
      WHERE w.is_active = true
      ORDER BY w.name, l.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Receipts
app.get('/api/receipts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, 
             COUNT(rl.id) as line_count,
             COALESCE(SUM(rl.quantity), 0) as total_quantity
      FROM receipts r
      LEFT JOIN receipt_lines rl ON r.id = rl.receipt_id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/receipts', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { supplier_name, lines } = req.body;

    const receiptResult = await client.query(
      'INSERT INTO receipts (supplier_name, status) VALUES ($1, $2) RETURNING *',
      [supplier_name, 'draft']
    );

    const receipt = receiptResult.rows[0];

    for (const line of lines) {
      await client.query(
        'INSERT INTO receipt_lines (receipt_id, product_id, quantity, location_id) VALUES ($1, $2, $3, $4)',
        [receipt.id, line.product_id, line.quantity, line.location_id]
      );
    }

    await client.query('COMMIT');
    res.json(receipt);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create receipt error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/api/receipts/:id/validate', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    const lines = await client.query(
      'SELECT * FROM receipt_lines WHERE receipt_id = $1',
      [id]
    );

    for (const line of lines.rows) {
      // Update or insert stock level
      const existingStock = await client.query(
        'SELECT * FROM stock_levels WHERE product_id = $1 AND location_id = $2',
        [line.product_id, line.location_id]
      );

      if (existingStock.rows.length > 0) {
        await client.query(
          'UPDATE stock_levels SET quantity = quantity + $1, last_updated = CURRENT_TIMESTAMP WHERE product_id = $2 AND location_id = $3',
          [line.quantity, line.product_id, line.location_id]
        );
      } else {
        await client.query(
          'INSERT INTO stock_levels (product_id, location_id, quantity) VALUES ($1, $2, $3)',
          [line.product_id, line.location_id, line.quantity]
        );
      }

      // Log movement
      await client.query(
        'INSERT INTO move_history (product_id, type, to_location, quantity, reference) VALUES ($1, $2, $3, $4, $5)',
        [line.product_id, 'receipt', `Location ${line.location_id}`, line.quantity, `Receipt ${id}`]
      );
    }

    await client.query(
      'UPDATE receipts SET status = $1, validated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['done', id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Receipt validated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Validate receipt error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Deliveries
app.get('/api/deliveries', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, 
             COUNT(dl.id) as line_count,
             COALESCE(SUM(dl.quantity), 0) as total_quantity
      FROM deliveries d
      LEFT JOIN delivery_lines dl ON d.id = dl.delivery_id
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/deliveries', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { customer_name, lines } = req.body;

    const deliveryResult = await client.query(
      'INSERT INTO deliveries (customer_name, status) VALUES ($1, $2) RETURNING *',
      [customer_name, 'draft']
    );

    const delivery = deliveryResult.rows[0];

    for (const line of lines) {
      await client.query(
        'INSERT INTO delivery_lines (delivery_id, product_id, quantity, location_id) VALUES ($1, $2, $3, $4)',
        [delivery.id, line.product_id, line.quantity, line.location_id]
      );
    }

    await client.query('COMMIT');
    res.json(delivery);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create delivery error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/api/deliveries/:id/validate', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    const lines = await client.query(
      'SELECT * FROM delivery_lines WHERE delivery_id = $1',
      [id]
    );

    for (const line of lines.rows) {
      // Check stock availability
      const stock = await client.query(
        'SELECT quantity FROM stock_levels WHERE product_id = $1 AND location_id = $2',
        [line.product_id, line.location_id]
      );

      if (!stock.rows[0] || stock.rows[0].quantity < line.quantity) {
        throw new Error(`Insufficient stock for product ${line.product_id}`);
      }

      // Decrease stock
      await client.query(
        'UPDATE stock_levels SET quantity = quantity - $1, last_updated = CURRENT_TIMESTAMP WHERE product_id = $2 AND location_id = $3',
        [line.quantity, line.product_id, line.location_id]
      );

      // Log movement
      await client.query(
        'INSERT INTO move_history (product_id, type, from_location, quantity, reference) VALUES ($1, $2, $3, $4, $5)',
        [line.product_id, 'delivery', `Location ${line.location_id}`, line.quantity, `Delivery ${id}`]
      );
    }

    await client.query(
      'UPDATE deliveries SET status = $1, validated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['done', id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Delivery validated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Validate delivery error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Transfers
app.get('/api/transfers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, 
             l1.name as from_location_name,
             l2.name as to_location_name,
             COUNT(tl.id) as line_count
      FROM transfers t
      LEFT JOIN locations l1 ON t.from_location_id = l1.id
      LEFT JOIN locations l2 ON t.to_location_id = l2.id
      LEFT JOIN transfer_lines tl ON t.id = tl.transfer_id
      GROUP BY t.id, l1.name, l2.name
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/transfers', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { from_location_id, to_location_id, lines } = req.body;

    const transferResult = await client.query(
      'INSERT INTO transfers (from_location_id, to_location_id, status) VALUES ($1, $2, $3) RETURNING *',
      [from_location_id, to_location_id, 'draft']
    );

    const transfer = transferResult.rows[0];

    for (const line of lines) {
      await client.query(
        'INSERT INTO transfer_lines (transfer_id, product_id, quantity) VALUES ($1, $2, $3)',
        [transfer.id, line.product_id, line.quantity]
      );
    }

    await client.query('COMMIT');
    res.json(transfer);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create transfer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/api/transfers/:id/validate', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    const transfer = await client.query('SELECT * FROM transfers WHERE id = $1', [id]);
    const { from_location_id, to_location_id } = transfer.rows[0];

    const lines = await client.query(
      'SELECT * FROM transfer_lines WHERE transfer_id = $1',
      [id]
    );

    for (const line of lines.rows) {
      // Check stock availability
      const stock = await client.query(
        'SELECT quantity FROM stock_levels WHERE product_id = $1 AND location_id = $2',
        [line.product_id, from_location_id]
      );

      if (!stock.rows[0] || stock.rows[0].quantity < line.quantity) {
        throw new Error(`Insufficient stock for product ${line.product_id}`);
      }

      // Decrease from source
      await client.query(
        'UPDATE stock_levels SET quantity = quantity - $1, last_updated = CURRENT_TIMESTAMP WHERE product_id = $2 AND location_id = $3',
        [line.quantity, line.product_id, from_location_id]
      );

      // Increase at destination
      const destStock = await client.query(
        'SELECT * FROM stock_levels WHERE product_id = $1 AND location_id = $2',
        [line.product_id, to_location_id]
      );

      if (destStock.rows.length > 0) {
        await client.query(
          'UPDATE stock_levels SET quantity = quantity + $1, last_updated = CURRENT_TIMESTAMP WHERE product_id = $2 AND location_id = $3',
          [line.quantity, line.product_id, to_location_id]
        );
      } else {
        await client.query(
          'INSERT INTO stock_levels (product_id, location_id, quantity) VALUES ($1, $2, $3)',
          [line.product_id, to_location_id, line.quantity]
        );
      }

      // Log movement
      await client.query(
        'INSERT INTO move_history (product_id, type, from_location, to_location, quantity, reference) VALUES ($1, $2, $3, $4, $5, $6)',
        [line.product_id, 'transfer', `Location ${from_location_id}`, `Location ${to_location_id}`, line.quantity, `Transfer ${id}`]
      );
    }

    await client.query(
      'UPDATE transfers SET status = $1, validated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['done', id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Transfer validated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Validate transfer error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Adjustments
app.post('/api/adjustments', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { product_id, location_id, new_quantity, reason } = req.body;

    const currentStock = await client.query(
      'SELECT quantity FROM stock_levels WHERE product_id = $1 AND location_id = $2',
      [product_id, location_id]
    );

    const old_quantity = currentStock.rows[0]?.quantity || 0;
    const difference = new_quantity - old_quantity;

    // Update stock
    if (currentStock.rows.length > 0) {
      await client.query(
        'UPDATE stock_levels SET quantity = $1, last_updated = CURRENT_TIMESTAMP WHERE product_id = $2 AND location_id = $3',
        [new_quantity, product_id, location_id]
      );
    } else {
      await client.query(
        'INSERT INTO stock_levels (product_id, location_id, quantity) VALUES ($1, $2, $3)',
        [product_id, location_id, new_quantity]
      );
    }

    // Log adjustment
    const adjustmentResult = await client.query(
      'INSERT INTO adjustments (product_id, location_id, old_quantity, new_quantity, reason) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [product_id, location_id, old_quantity, new_quantity, reason]
    );

    // Log movement
    await client.query(
      'INSERT INTO move_history (product_id, type, to_location, quantity, reference) VALUES ($1, $2, $3, $4, $5)',
      [product_id, 'adjustment', `Location ${location_id}`, difference, `Adjustment: ${reason}`]
    );

    await client.query('COMMIT');
    res.json(adjustmentResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create adjustment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Move History
app.get('/api/move-history', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mh.*, p.name as product_name, p.sku
      FROM move_history mh
      JOIN products p ON mh.product_id = p.id
      ORDER BY mh.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Profile
app.get('/api/profile', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});