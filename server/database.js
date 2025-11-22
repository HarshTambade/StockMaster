import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'stockmaster',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Initialize database schema
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT
      )
    `);

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) UNIQUE NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        unit_of_measure VARCHAR(50) NOT NULL,
        reorder_point INTEGER DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Warehouses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS warehouses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        is_active BOOLEAN DEFAULT true
      )
    `);

    // Locations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        warehouse_id INTEGER REFERENCES warehouses(id),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'storage'
      )
    `);

    // Stock levels table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock_levels (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        location_id INTEGER REFERENCES locations(id),
        quantity INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(product_id, location_id)
      )
    `);

    // Receipts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS receipts (
        id SERIAL PRIMARY KEY,
        supplier_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        validated_at TIMESTAMP
      )
    `);

    // Receipt lines table
    await client.query(`
      CREATE TABLE IF NOT EXISTS receipt_lines (
        id SERIAL PRIMARY KEY,
        receipt_id INTEGER REFERENCES receipts(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        location_id INTEGER REFERENCES locations(id)
      )
    `);

    // Deliveries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        validated_at TIMESTAMP
      )
    `);

    // Delivery lines table
    await client.query(`
      CREATE TABLE IF NOT EXISTS delivery_lines (
        id SERIAL PRIMARY KEY,
        delivery_id INTEGER REFERENCES deliveries(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        location_id INTEGER REFERENCES locations(id)
      )
    `);

    // Transfers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transfers (
        id SERIAL PRIMARY KEY,
        from_location_id INTEGER REFERENCES locations(id),
        to_location_id INTEGER REFERENCES locations(id),
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        validated_at TIMESTAMP
      )
    `);

    // Transfer lines table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transfer_lines (
        id SERIAL PRIMARY KEY,
        transfer_id INTEGER REFERENCES transfers(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL
      )
    `);

    // Adjustments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS adjustments (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        location_id INTEGER REFERENCES locations(id),
        old_quantity INTEGER NOT NULL,
        new_quantity INTEGER NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Move history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS move_history (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        type VARCHAR(50) NOT NULL,
        from_location VARCHAR(255),
        to_location VARCHAR(255),
        quantity INTEGER NOT NULL,
        reference VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default data
    await client.query(`
      INSERT INTO categories (name, description) VALUES
      ('Electronics', 'Electronic items'),
      ('Furniture', 'Office and home furniture'),
      ('Raw Materials', 'Manufacturing raw materials')
      ON CONFLICT (name) DO NOTHING
    `);

    await client.query(`
      INSERT INTO warehouses (name, location) VALUES
      ('Main Warehouse', 'Building A'),
      ('Production Floor', 'Building B')
      ON CONFLICT DO NOTHING
    `);

    const warehouseResult = await client.query('SELECT id FROM warehouses LIMIT 2');
    if (warehouseResult.rows.length > 0) {
      await client.query(`
        INSERT INTO locations (warehouse_id, name, type) VALUES
        ($1, 'Rack A', 'rack'),
        ($1, 'Rack B', 'rack'),
        ($2, 'Production Area', 'floor')
        ON CONFLICT DO NOTHING
      `, [warehouseResult.rows[0].id, warehouseResult.rows[1]?.id || warehouseResult.rows[0].id]);
    }

    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export { pool, initializeDatabase };