#!/usr/bin/env python3
"""
Check if articles are saved in CMS database
"""

import os
import json
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

# Load environment variables
load_dotenv()

def check_saved_articles():
    """Check if generated articles are saved to CMS"""
    try:
        # Connect to database
        connection = psycopg2.connect(
            os.getenv("DATABASE_URL"),
            cursor_factory=RealDictCursor
        )
        cursor = connection.cursor()
        
        print("🗄️  Database Connection Status: ✅ Connected")
        print("=" * 60)
        
        # Check table schemas to understand structure first
        print("🏗️  Database Schema Info:")
        print("-" * 50)
        
        # List all tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        tables = cursor.fetchall()
        print("Available tables:")
        table_names = []
        for table in tables:
            table_names.append(table['table_name'])
            print(f"  • {table['table_name']}")
        
        # Check generation sessions if table exists
        if 'generation_sessions' in table_names:
            print("\n📊 Recent Generation Sessions:")
            print("-" * 50)
            cursor.execute("""
                SELECT id, topic, status, created_at, user_id, 
                       CASE WHEN metadata IS NOT NULL THEN true ELSE false END as has_metadata
                FROM generation_sessions 
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
                print("❌ No generation sessions found")
        else:
            print("\n❌ generation_sessions table does not exist")
        
        # Check if articles table exists and has data
        if 'articles' in table_names:
            print("\n📄 Articles in CMS Database:")
            print("-" * 50)
            
            try:
                cursor.execute("""
                    SELECT id, title, slug, status, created_at, card_position 
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
                        print(f"  Card Position: {article['card_position']}")
                        print(f"  Created: {article['created_at']}")
                        print()
                else:
                    print("❌ No articles found in CMS articles table")
                    
            except Exception as e:
                print(f"❌ Error querying articles table: {e}")
        else:
            print("\n❌ articles table does not exist")
        
        connection.close()
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

if __name__ == "__main__":
    check_saved_articles()