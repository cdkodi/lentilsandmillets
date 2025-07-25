// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { neon } from '@neondatabase/serverless'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Recipes } from './collections/Recipes'
import { Articles } from './collections/Articles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Database configuration for Vercel/Neon
const databaseConfig = () => {
  // For production/Vercel, use individual PG* environment variables
  if (process.env.PGHOST) {
    return {
      host: process.env.PGHOST,
      port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
    }
  }
  
  // Fallback to DATABASE_URL
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
    }
  }
  
  throw new Error('No database configuration found. Please set PG* environment variables or DATABASE_URL.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Recipes, Articles],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: databaseConfig(),
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})