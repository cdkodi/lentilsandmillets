const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

async function createAdmin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
    
    console.log('Creating admin user...');
    const result = await pool.query(`
      INSERT INTO users (email, hash, role, created_at, updated_at) 
      VALUES ($1, $2, $3, NOW(), NOW()) 
      RETURNING id, email, role
    `, ['admin@lentilsandmillets.com', hashedPassword, 'admin']);
    
    console.log('Admin user created successfully:', result.rows[0]);
    console.log('You can now login at http://localhost:3000/admin/login');
    console.log('Email: admin@lentilsandmillets.com');
    console.log('Password: AdminPassword123!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();