const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

async function resetAdmin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Clearing existing users...');
    await pool.query('DELETE FROM users');
    
    console.log('Users cleared. Now visit http://localhost:3000/admin to create first user through UI');
    console.log('If UI fails, we can create via API after this reset');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

resetAdmin();