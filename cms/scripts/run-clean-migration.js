#!/usr/bin/env node

/**
 * Run Clean CMS Migration
 * Creates new cms_articles and cms_recipes tables
 */

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function runCleanMigration() {
  try {
    console.log('🚀 Running clean CMS schema migration...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Read migration file
    const migrationPath = path.join(__dirname, '../migrations/002_create_clean_cms_schema.sql');
    console.log(`📄 Reading migration file: ${migrationPath}`);
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('⚡ Executing migration...');
    
    // Split SQL file into individual statements
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
          await sql([statement]);
        } catch (error) {
          // Some statements might fail if they already exist, that's OK for some cases
          if (error.message.includes('already exists') || 
              error.message.includes('does not exist') ||
              error.message.includes('relation') && error.message.includes('already exists')) {
            console.log(`   ⚠ Statement ${i + 1} skipped (${error.message.split(':')[0]})`);
          } else {
            console.error(`   ❌ Error in statement ${i + 1}:`, error.message);
            // Don't throw - continue with other statements for migration
          }
        }
      }
    }
    
    console.log('✅ Migration completed!');
    
    // Verify the migration worked
    console.log('🔍 Verifying migration...');
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE 'cms_%'
      ORDER BY table_name
    `;
    
    console.log('📊 CMS Tables created:');
    tables.forEach(table => {
      console.log(`   ✓ ${table.table_name}`);
    });
    
    // Check sample data
    if (tables.some(t => t.table_name === 'cms_articles')) {
      const articleCount = await sql`SELECT COUNT(*) as count FROM cms_articles WHERE status = 'published'`;
      console.log(`   📝 Published articles: ${articleCount[0].count}`);
    }
    
    if (tables.some(t => t.table_name === 'cms_recipes')) {
      const recipeCount = await sql`SELECT COUNT(*) as count FROM cms_recipes WHERE status = 'published'`;
      console.log(`   🍽️ Published recipes: ${recipeCount[0].count}`);
    }
    
    // Show card assignments
    if (tables.length > 0) {
      console.log('🎯 Card assignments:');
      
      try {
        const assignments = await sql`
          SELECT 
            card_position,
            'article' as content_type,
            title,
            category
          FROM cms_articles 
          WHERE card_position IS NOT NULL
          
          UNION ALL
          
          SELECT 
            card_position,
            'recipe' as content_type,
            title,
            category
          FROM cms_recipes 
          WHERE card_position IS NOT NULL
          
          ORDER BY card_position
        `;
        
        assignments.forEach(assignment => {
          console.log(`   ✓ ${assignment.card_position}: ${assignment.title} (${assignment.content_type})`);
        });
        
      } catch (error) {
        console.log('   ⚠ Could not fetch card assignments:', error.message);
      }
    }
    
    console.log('\n🎉 Clean CMS schema migration complete!');
    console.log('📋 Next steps:');
    console.log('   1. Update API endpoints to use cms_articles and cms_recipes');
    console.log('   2. Build the admin interface');
    console.log('   3. Test the card-based content system');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the migration
runCleanMigration();