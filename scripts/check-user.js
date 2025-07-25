const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

async function checkUser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query('SELECT id, email, role, hash FROM users WHERE email = $1', 
      ['admin@lentilsandmillets.com']);
    
    console.log('User found:', result.rows[0]);
    
    if (result.rows[0]) {
      console.log('Hash starts with:', result.rows[0].hash.substring(0, 10));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUser();