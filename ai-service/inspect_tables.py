#!/usr/bin/env python3
"""
Inspect database table structures
"""

import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

def inspect_tables():
    """Inspect all table structures"""
    try:
        connection = psycopg2.connect(os.getenv("DATABASE_URL"), cursor_factory=RealDictCursor)
        cursor = connection.cursor()
        
        # Tables to inspect
        tables_to_check = ['ai_generation_sessions', 'articles', 'cms_articles']
        
        for table_name in tables_to_check:
            print(f"📊 {table_name.upper()} TABLE:")
            print("-" * 60)
            
            # Get table structure
            cursor.execute("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = %s
                ORDER BY ordinal_position
            """, (table_name,))
            
            columns = cursor.fetchall()
            if columns:
                print("Columns:")
                for col in columns:
                    nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
                    default = f" DEFAULT {col['column_default']}" if col['column_default'] else ""
                    print(f"  • {col['column_name']} ({col['data_type']}) {nullable}{default}")
                
                # Check if table has any data
                cursor.execute(f"SELECT COUNT(*) as count FROM {table_name}")
                count = cursor.fetchone()['count']
                print(f"\nRows: {count}")
                
                # Show sample data if exists
                if count > 0:
                    cursor.execute(f"SELECT * FROM {table_name} ORDER BY id DESC LIMIT 2")
                    rows = cursor.fetchall()
                    print("\nSample data:")
                    for i, row in enumerate(rows, 1):
                        print(f"  Row {i}: {dict(row)}")
            else:
                print("❌ Table does not exist")
            
            print("\n" + "=" * 80 + "\n")
        
        connection.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    inspect_tables()