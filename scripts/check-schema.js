#!/usr/bin/env node

/**
 * Check Database Schema
 * Inspect the actual table structure to see what we have
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...');
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Check articles table structure
    console.log('\n📋 ARTICLES TABLE STRUCTURE:');
    const articleColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'articles' 
        AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    articleColumns.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(required)';
      const defaultVal = col.column_default ? ` default: ${col.column_default}` : '';
      console.log(`   • ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
    });
    
    // Check recipes table structure
    console.log('\n🍽️ RECIPES TABLE STRUCTURE:');
    const recipeColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'recipes' 
        AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    recipeColumns.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(required)';
      const defaultVal = col.column_default ? ` default: ${col.column_default}` : '';
      console.log(`   • ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
    });
    
    // Check if our columns exist
    const cardPositionArticles = articleColumns.find(col => col.column_name === 'card_position');
    const cardPositionRecipes = recipeColumns.find(col => col.column_name === 'card_position');
    
    console.log('\n🎯 CARD POSITION COLUMNS:');
    console.log(`   Articles: ${cardPositionArticles ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`   Recipes: ${cardPositionRecipes ? '✅ EXISTS' : '❌ MISSING'}`);
    
    // Show existing data
    console.log('\n📊 EXISTING DATA:');
    const articles = await sql`SELECT id, title, slug FROM articles LIMIT 3`;
    const recipes = await sql`SELECT id, title, slug FROM recipes LIMIT 3`;
    
    console.log('   Articles:');
    articles.forEach(article => {
      console.log(`   • ${article.id}: ${article.title} (${article.slug})`);
    });
    
    console.log('   Recipes:');
    if (recipes.length === 0) {
      console.log('   • No recipes found');
    } else {
      recipes.forEach(recipe => {
        console.log(`   • ${recipe.id}: ${recipe.title} (${recipe.slug})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the check
checkSchema();