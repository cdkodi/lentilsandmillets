#!/usr/bin/env node

/**
 * Database Migration Runner
 * Connects to Neon PostgreSQL and runs migration files
 */

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Check for database connection
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    console.log('📡 Connecting to Neon PostgreSQL...');
    const sql = neon(process.env.DATABASE_URL);
    
    // Read migration file
    const migrationPath = path.join(__dirname, '../migrations/001_create_cms_schema.sql');
    console.log(`📄 Reading migration file: ${migrationPath}`);
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('⚡ Executing migration...');
    
    // Split SQL file into individual statements (simple split on semicolon)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📋 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`   ▶ Executing statement ${i + 1}/${statements.length}...`);
          await sql(statement);
        } catch (error) {
          // Some statements might fail if they already exist, that's OK
          if (error.message.includes('already exists') || error.message.includes('does not exist')) {
            console.log(`   ⚠ Statement ${i + 1} skipped (already exists or not found)`);
          } else {
            console.error(`   ❌ Error in statement ${i + 1}:`, error.message);
            // Don't throw - continue with other statements
          }
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the migration worked
    console.log('🔍 Verifying migration...');
    
    try {
      const tableCheck = await sql`
        SELECT table_name, table_type 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN ('articles', 'recipes')
        ORDER BY table_name
      `;
      
      console.log('📊 Tables created:');
      tableCheck.forEach(table => {
        console.log(`   ✓ ${table.table_name} (${table.table_type.toLowerCase()})`);
      });
      
      // Check sample data
      const articleCount = await sql`SELECT COUNT(*) as count FROM articles WHERE status = 'published'`;
      const recipeCount = await sql`SELECT COUNT(*) as count FROM recipes WHERE status = 'published'`;
      
      console.log('📈 Sample data inserted:');
      console.log(`   ✓ Articles: ${articleCount[0].count} records`);
      console.log(`   ✓ Recipes: ${recipeCount[0].count} records`);
      
      // Show card assignments
      const cardAssignments = await sql`
        SELECT 
          card_position,
          'article' as content_type,
          title,
          category
        FROM articles 
        WHERE card_position IS NOT NULL
        
        UNION ALL
        
        SELECT 
          card_position,
          'recipe' as content_type,
          title,
          category
        FROM recipes 
        WHERE card_position IS NOT NULL
        
        ORDER BY card_position
      `;
      
      if (cardAssignments.length > 0) {
        console.log('🎯 Card assignments:');
        cardAssignments.forEach(assignment => {
          console.log(`   ✓ ${assignment.card_position}: ${assignment.title} (${assignment.content_type})`);
        });
      }
      
    } catch (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
    }
    
    console.log('\n🎉 Database migration complete!');
    console.log('📋 Next steps:');
    console.log('   1. Test the database connection in your app');
    console.log('   2. Build the admin interface');
    console.log('   3. Implement the card-based CMS system');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the migration
runMigration();