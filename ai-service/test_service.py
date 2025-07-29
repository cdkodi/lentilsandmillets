#!/usr/bin/env python3
"""
Simple test script for AI Article Generation Service
"""

import asyncio
import json
import sys
from datetime import datetime

# Test if we can import all required modules
def test_imports():
    """Test if all required modules can be imported"""
    print("🔍 Testing imports...")
    
    try:
        import fastapi
        print("✅ FastAPI imported successfully")
        
        import openai
        print("✅ OpenAI imported successfully")
        
        import anthropic
        print("✅ Anthropic imported successfully")
        
        import psycopg2
        print("✅ PostgreSQL driver imported successfully")
        
        import pydantic
        print("✅ Pydantic imported successfully")
        
        # Test our modules
        from models import GenerationOptions, ArticleCategory
        print("✅ Custom models imported successfully")
        
        from services.prompts import PromptTemplates
        print("✅ Prompt templates imported successfully")
        
        from services.ai_processor import AIProcessor
        print("✅ AI processor imported successfully")
        
        from services.database import DatabaseService
        print("✅ Database service imported successfully")
        
        from utils.logging import setup_logging
        print("✅ Logging utilities imported successfully")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        print("💡 Try: pip install -r requirements.txt")
        return False

def test_environment():
    """Test environment variables"""
    print("\n🔍 Testing environment configuration...")
    
    import os
    from dotenv import load_dotenv
    
    # Load environment variables
    load_dotenv()
    
    required_vars = {
        'DATABASE_URL': 'Database connection string',
        'OPENAI_API_KEY': 'OpenAI API key (optional if using Anthropic)',
        'ANTHROPIC_API_KEY': 'Anthropic API key (optional if using OpenAI)',
        'JWT_SECRET_KEY': 'JWT secret for authentication'
    }
    
    missing_vars = []
    
    for var, description in required_vars.items():
        value = os.getenv(var)
        if value:
            # Don't print actual API keys
            if 'API_KEY' in var or 'SECRET' in var:
                print(f"✅ {var}: {'*' * 10}")
            else:
                print(f"✅ {var}: {value}")
        else:
            print(f"❌ {var}: Missing ({description})")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n⚠️  Missing environment variables: {missing_vars}")
        print("📝 Please update your .env file")
        return False
    
    return True

def test_database_connection():
    """Test database connection"""
    print("\n🔍 Testing database connection...")
    
    try:
        import os
        import psycopg2
        from dotenv import load_dotenv
        
        load_dotenv()
        
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            print("❌ DATABASE_URL not configured")
            return False
        
        # Try to connect
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        # Test basic query
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        print(f"✅ Database connected successfully")
        print(f"   PostgreSQL version: {version}")
        
        # Check if our tables exist
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('articles', 'recipes');
        """)
        
        tables = [row[0] for row in cursor.fetchall()]
        
        if 'articles' in tables:
            print("✅ Articles table found")
        else:
            print("⚠️  Articles table not found (will be created)")
            
        if 'recipes' in tables:
            print("✅ Recipes table found")
        else:
            print("⚠️  Recipes table not found (will be created)")
        
        cursor.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("💡 Check your DATABASE_URL and ensure the database is running")
        return False

def test_ai_models():
    """Test AI model connectivity"""
    print("\n🔍 Testing AI model connectivity...")
    
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    
    # Test OpenAI
    openai_key = os.getenv('OPENAI_API_KEY')
    if openai_key and openai_key != 'sk-your-openai-api-key-here':
        try:
            import openai
            client = openai.OpenAI(api_key=openai_key)
            
            # Simple test call
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Say 'AI service test successful'"}],
                max_tokens=10
            )
            
            print("✅ OpenAI API connection successful")
            
        except Exception as e:
            print(f"❌ OpenAI API test failed: {e}")
    else:
        print("⚠️  OpenAI API key not configured")
    
    # Test Anthropic
    anthropic_key = os.getenv('ANTHROPIC_API_KEY')
    if anthropic_key and anthropic_key != 'ant-your-anthropic-api-key-here':
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=anthropic_key)
            
            # Simple test call
            message = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=10,
                messages=[{"role": "user", "content": "Say 'AI service test successful'"}]
            )
            
            print("✅ Anthropic API connection successful")
            
        except Exception as e:
            print(f"❌ Anthropic API test failed: {e}")
    else:
        print("⚠️  Anthropic API key not configured")
    
    # Test Google Gemini
    google_key = os.getenv('GOOGLE_API_KEY')
    if google_key and google_key != 'your-google-gemini-api-key-here':
        try:
            import google.generativeai as genai
            genai.configure(api_key=google_key)
            
            # Simple test call
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(
                "Say 'AI service test successful'",
                generation_config=genai.types.GenerationConfig(max_output_tokens=10)
            )
            
            print("✅ Google Gemini API connection successful")
            
        except Exception as e:
            print(f"❌ Google Gemini API test failed: {e}")
    else:
        print("⚠️  Google Gemini API key not configured")

def main():
    """Run all tests"""
    print("🧪 AI Article Generation Service - Test Suite")
    print("=" * 50)
    
    tests = [
        ("Module Imports", test_imports),
        ("Environment Configuration", test_environment),
        ("Database Connection", test_database_connection),
        ("AI Model Connectivity", test_ai_models),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ {test_name} crashed: {e}")
            failed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed! Service should be ready to start.")
        print("🚀 Run: ./start.sh or python main.py")
    else:
        print("⚠️  Some tests failed. Please fix the issues before starting the service.")
        sys.exit(1)

if __name__ == "__main__":
    main()