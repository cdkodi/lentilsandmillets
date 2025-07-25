// Test database connection construction
console.log('Environment variables:')
console.log('DB_USER:', process.env.DB_USER ? '✓ Set' : '✗ Missing')
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '✓ Set' : '✗ Missing') 
console.log('DB_HOST:', process.env.DB_HOST ? '✓ Set' : '✗ Missing')
console.log('DB_NAME:', process.env.DB_NAME ? '✓ Set' : '✗ Missing')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Missing')

// Construct URL like payload.config.ts does
const constructedUrl = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}?sslmode=require`
console.log('Constructed URL:', constructedUrl)

// Test the connection
const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL || constructedUrl

console.log('Using connection string:', connectionString.replace(/:[^:]*@/, ':***@'))

const pool = new Pool({ connectionString })

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Database connection failed:', err.message)
  } else {
    console.log('Database connection successful:', result.rows[0])
  }
  pool.end()
})