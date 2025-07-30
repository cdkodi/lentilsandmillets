#!/usr/bin/env node

/**
 * Test Database Connection
 * Simple test to verify our CMS database is working
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Test basic connection
    console.log('📡 Connecting to Neon PostgreSQL...');
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    console.log('✅ Connection successful!');
    console.log(`   Time: ${result[0].current_time}`);
    console.log(`   Version: ${result[0].db_version.split(' ')[0]} ${result[0].db_version.split(' ')[1]}`);
    
    // Test our CMS tables
    console.log('\n📊 Checking CMS tables...');
    
    const tables = await sql`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
        AND table_name IN ('articles', 'recipes')
      ORDER BY table_name
    `;
    
    if (tables.length === 0) {
      console.log('❌ CMS tables not found. Run migration first: node scripts/run-migration.js');
      return;
    }
    
    tables.forEach(table => {
      console.log(`   ✓ ${table.table_name} (${table.column_count} columns)`);
    });
    
    // Test sample data
    console.log('\n📈 Checking sample data...');
    
    const articleCount = await sql`SELECT COUNT(*) as count FROM articles`;
    const recipeCount = await sql`SELECT COUNT(*) as count FROM recipes`;
    
    console.log(`   📝 Articles: ${articleCount[0].count} total`);
    console.log(`   🍽️ Recipes: ${recipeCount[0].count} total`);
    
    // Show published content
    const publishedArticles = await sql`
      SELECT title, category, status, card_position 
      FROM articles 
      WHERE status = 'published' 
      LIMIT 5
    `;
    
    const publishedRecipes = await sql`
      SELECT title, category, status, card_position, is_featured
      FROM recipes 
      WHERE status = 'published' 
      LIMIT 5
    `;
    
    if (publishedArticles.length > 0) {
      console.log('\n📰 Published Articles:');
      publishedArticles.forEach(article => {
        const position = article.card_position || 'unassigned';
        console.log(`   • ${article.title} (${article.category}) - ${position}`);
      });
    }
    
    if (publishedRecipes.length > 0) {
      console.log('\n🍽️ Published Recipes:');
      publishedRecipes.forEach(recipe => {
        const position = recipe.card_position || 'unassigned';
        const featured = recipe.is_featured ? ' ⭐' : '';
        console.log(`   • ${recipe.title} (${recipe.category}) - ${position}${featured}`);
      });
    }
    
    console.log('\n🎉 Database test complete!');
    console.log('✅ CMS database is ready for use.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testConnection();