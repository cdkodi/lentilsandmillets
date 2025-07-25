const { getPayload } = require('payload');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function createAdminUser() {
  try {
    console.log('Initializing Payload...');
    console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? 'Set' : 'Missing');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');
    
    const payload = await getPayload({
      config: path.resolve(__dirname, '../src/payload.config.ts'),
      secret: process.env.PAYLOAD_SECRET,
    });

    console.log('Creating admin user...');
    
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@lentilsandmillets.com',
        password: 'admin123456',
        role: 'admin',
      },
    });

    console.log('Admin user created successfully:', user.email);
    console.log('You can now login at http://localhost:3000/admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    console.error('Full error:', error);
  }
}

createAdminUser();