#!/usr/bin/env python3
"""
Quick AI Service Test
Tests the AI service with real API keys
"""

import os
import sys
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_ai_connectivity():
    """Test AI service connectivity with proper error handling"""
    print("🧪 Quick AI Service Test")
    print("=" * 50)
    
    # Test OpenAI
    try:
        from openai import OpenAI
        
        # Check if API key is set
        if not os.getenv("OPENAI_API_KEY") or "your-openai" in os.getenv("OPENAI_API_KEY", ""):
            print("❌ OpenAI: API key not set (please update .env file)")
        else:
            openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            
            # Test with a simple completion
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Say 'OpenAI test successful'"}],
                max_tokens=10
            )
            print("✅ OpenAI: API key valid and working")
            print(f"   Response: {response.choices[0].message.content.strip()}")
    except Exception as e:
        if "401" in str(e) or "api key" in str(e).lower():
            print("❌ OpenAI: Invalid API key")
        else:
            print(f"❌ OpenAI: {str(e)}")
    
    # Test Anthropic
    try:
        from anthropic import Anthropic
        anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        
        # Verify API key by making a simple request
        if not os.getenv("ANTHROPIC_API_KEY") or "your-anthropic" in os.getenv("ANTHROPIC_API_KEY", ""):
            print("❌ Anthropic: API key not set (please update .env file)")
        else:
            # Try newer API first, fallback to older API
            try:
                response = anthropic_client.messages.create(
                    model="claude-3-haiku-20240307",
                    max_tokens=10,
                    messages=[{"role": "user", "content": "Say 'Anthropic test successful'"}]
                )
                print("✅ Anthropic: API key valid and working")
                print(f"   Response: {response.content[0].text.strip()}")
            except AttributeError:
                # Fallback to older API with correct prompt format
                response = anthropic_client.completions.create(
                    model="claude-instant-1.2",
                    prompt="\n\nHuman: Say 'Anthropic test successful'\n\nAssistant:",
                    max_tokens_to_sample=10
                )
                print("✅ Anthropic: API key valid and working (older API)")
                print(f"   Response: {response.completion.strip()}")
    except Exception as e:
        if "api_key" in str(e).lower() or "401" in str(e) or "authentication" in str(e).lower():
            print("❌ Anthropic: Invalid API key")
        else:
            print(f"❌ Anthropic: {str(e)}")
    
    # Test Gemini (with quota handling)
    try:
        import google.generativeai as genai
        
        # Check if API key is set
        if not os.getenv("GOOGLE_API_KEY") or "your-google" in os.getenv("GOOGLE_API_KEY", ""):
            print("❌ Gemini: API key not set (please update .env file)")
        else:
            genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
            
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content("Say 'Gemini test successful'")
            print("✅ Gemini: API key valid and working")
            print(f"   Response: {response.text.strip()}")
    except Exception as e:
        if "quota" in str(e).lower() or "429" in str(e) or "overloaded" in str(e).lower():
            print("⚠️  Gemini: API key valid but quota exceeded or service overloaded (common for free tier)")
        elif "api_key" in str(e).lower() or "401" in str(e) or "authentication" in str(e).lower():
            print("❌ Gemini: Invalid API key")
        else:
            print(f"❌ Gemini: {str(e)}")
    
    # Test Database
    try:
        from services.database import DatabaseService
        db_service = DatabaseService()
        await db_service.connect()
        print("✅ Database: Connection successful")
        await db_service.disconnect()
    except Exception as e:
        print(f"❌ Database: {str(e)}")
    
    print("=" * 50)
    print("💡 If API keys show as invalid, please update your .env file")

if __name__ == "__main__":
    asyncio.run(test_ai_connectivity())