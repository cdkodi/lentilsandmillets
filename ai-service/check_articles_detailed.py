#!/usr/bin/env python3
"""
Check article storage in detail
"""

import os
import json
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

# Load environment variables
load_dotenv()

def check_articles_detailed():
    """Check articles storage in detail"""
    try:
        # Connect to database
        connection = psycopg2.connect(
            os.getenv("DATABASE_URL"),
            cursor_factory=RealDictCursor
        )
        cursor = connection.cursor()
        
        print("📊 AI Generation Sessions:")
        print("-" * 50)
        
        # Check ai_generation_sessions (correct table name)
        cursor.execute("""
            SELECT id, topic, status, created_at, user_id, 
                   CASE WHEN metadata IS NOT NULL THEN true ELSE false END as has_metadata
            FROM ai_generation_sessions 
            ORDER BY created_at DESC 
            LIMIT 5
        """)
        
        sessions = cursor.fetchall()
        if sessions:
            for session in sessions:
                print(f"Session {session['id']}: {session['topic']}")
                print(f"  Status: {session['status']}")
                print(f"  User ID: {session['user_id']}")
                print(f"  Created: {session['created_at']}")
                print(f"  Has Metadata: {session['has_metadata']}")
                print()
        else:
            print("❌ No AI generation sessions found")
        
        # Check articles table structure first
        print("📄 Articles Table Structure:")
        print("-" * 50)
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'articles'
            ORDER BY ordinal_position
        """)
        
        columns = cursor.fetchall()
        print("Articles table columns:")
        for col in columns:
            print(f"  • {col['column_name']} ({col['data_type']})")
        
        # Now check articles with correct column names
        print("\n📄 Recent Articles:")
        print("-" * 50)
        cursor.execute("""
            SELECT id, title, slug, status, created_at
            FROM articles 
            ORDER BY created_at DESC 
            LIMIT 5
        """)
        
        articles = cursor.fetchall()
        if articles:
            for article in articles:
                print(f"Article {article['id']}: {article['title']}")
                print(f"  Slug: {article['slug']}")
                print(f"  Status: {article['status']}")
                print(f"  Created: {article['created_at']}")
                print()
        else:
            print("❌ No articles found")
        
        # Check cms_articles too
        print("📄 CMS Articles:")
        print("-" * 50)
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'cms_articles'
            ORDER BY ordinal_position
        """)
        
        cms_columns = cursor.fetchall()
        print("CMS Articles table columns:")
        for col in cms_columns:
            print(f"  • {col['column_name']} ({col['data_type']})")
        
        cursor.execute("""
            SELECT id, title, slug, status, created_at
            FROM cms_articles 
            ORDER BY created_at DESC 
            LIMIT 5
        """)
        
        cms_articles = cursor.fetchall()
        if cms_articles:
            print("\nRecent CMS articles:")
            for article in cms_articles:
                print(f"CMS Article {article['id']}: {article['title']}")
                print(f"  Slug: {article['slug']}")
                print(f"  Status: {article['status']}")
                print(f"  Created: {article['created_at']}")
                print()
        else:
            print("\n❌ No CMS articles found")
        
        connection.close()
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Database error: {e}")

if __name__ == "__main__":
    check_articles_detailed()