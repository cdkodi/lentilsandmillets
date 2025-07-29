#!/usr/bin/env node

/**
 * Check All Database Tables
 * See what tables actually exist in the database
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkAllTables() {
  try {
    console.log('🔍 Checking all database tables...');
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Get all tables
    const tables = await sql`
      SELECT schemaname, tablename, tableowner
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    
    console.log(`\n📊 Found ${tables.length} tables in public schema:`);
    tables.forEach(table => {
      console.log(`   • ${table.tablename} (owner: ${table.tableowner})`);
    });
    
    // Check if we have multiple articles/recipes tables
    const articleTables = tables.filter(t => t.tablename.includes('article'));
    const recipeTables = tables.filter(t => t.tablename.includes('recipe'));
    
    if (articleTables.length > 0) {
      console.log('\n📝 Article-related tables:');
      articleTables.forEach(table => {
        console.log(`   • ${table.tablename}`);
      });
    }
    
    if (recipeTables.length > 0) {
      console.log('\n🍽️ Recipe-related tables:');
      recipeTables.forEach(table => {
        console.log(`   • ${table.tablename}`);
      });
    }
    
    // Check for any CMS-specific tables we might have created
    const cmsTableNames = ['articles', 'recipes', 'cms_articles', 'cms_recipes'];
    
    console.log('\n🎯 CMS Table Status:');
    for (const tableName of cmsTableNames) {
      const exists = tables.find(t => t.tablename === tableName);
      if (exists) {
        console.log(`   ✅ ${tableName} - EXISTS`);
        
        // Get column count
        const columns = await sql`
          SELECT COUNT(*) as count
          FROM information_schema.columns 
          WHERE table_name = ${tableName} 
            AND table_schema = 'public'
        `;
        console.log(`      └── ${columns[0].count} columns`);
      } else {
        console.log(`   ❌ ${tableName} - MISSING`);
      }
    }
    
    // Check for Payload CMS specific tables
    const payloadTables = tables.filter(t => 
      t.tablename.includes('payload') || 
      t.tablename.includes('_rel') ||
      t.tablename.startsWith('media') ||
      t.tablename.startsWith('users')
    );
    
    if (payloadTables.length > 0) {
      console.log('\n⚙️ Payload CMS tables:');
      payloadTables.forEach(table => {
        console.log(`   • ${table.tablename}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Table check failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the check
checkAllTables();