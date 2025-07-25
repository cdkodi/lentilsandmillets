const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

async function createAdminUser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    
    console.log('Creating admin user...');
    
    // First, let's check what tables exist
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE '%user%'
    `);
    console.log('Available user tables:', tables.rows);
    
    // Check the actual column names
    const columns = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
    `);
    console.log('Users table columns:', columns.rows.map(r => r.column_name));
    
    // Insert using the actual column names (snake_case)
    const result = await pool.query(`
      INSERT INTO users (email, hash, role, updated_at, created_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, email, role
    `, ['admin@lentilsandmillets.com', hashedPassword, 'admin']);
    
    console.log('Admin user created successfully:', result.rows[0]);
    console.log('You can now login at http://localhost:3000/admin with:');
    console.log('Email: admin@lentilsandmillets.com');
    console.log('Password: admin123456');
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    if (error.code === '23505') {
      console.log('User already exists! You can login with the existing credentials.');
    }
  } finally {
    await pool.end();
  }
}

createAdminUser();