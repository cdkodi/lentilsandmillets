#!/usr/bin/env python3
"""
Test Full AI Article Generation Pipeline
Tests the complete 5-step process with real API keys
"""

import requests
import json
import time

# Test configuration
BASE_URL = "http://localhost:8000"
TEST_TOPIC = "Red Lentils: Quick Cooking Methods"
TEST_AUTH_TOKEN = "dev-token"  # Development bypass token

def test_article_generation():
    """Test complete article generation pipeline"""
    print("🧪 Testing Full AI Article Generation Pipeline")
    print("=" * 60)
    
    # Step 1: Test health endpoint
    print("1. Checking service health...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("   ✅ Service is healthy")
        else:
            print(f"   ❌ Service health check failed: {response.status_code}")
            return
    except Exception as e:
        print(f"   ❌ Could not connect to service: {e}")
        return
    
    # Step 2: Generate article
    print(f"\n2. Generating article: '{TEST_TOPIC}'...")
    try:
        headers = {
            "Authorization": f"Bearer {TEST_AUTH_TOKEN}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "topic": TEST_TOPIC,
            "options": {
                "target_length": 800,
                "category": "lentils",
                "include_factoids": True,
                "include_seo_meta": True,
                "brand_voice": "authoritative_approachable"
            }
        }
        
        print("   📤 Sending request to AI service...")
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-article",
            json=payload,
            headers=headers,
            timeout=120  # Allow 2 minutes for generation
        )
        
        print(f"   📊 Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Article generated successfully!")
            
            # Display results
            article = result.get('article', {})
            metadata = result.get('metadata', {})
            
            print("\n📋 Generation Results:")
            print("-" * 40)
            print(f"Session ID: {result.get('session_id', 'N/A')}")
            print(f"Title: {article.get('title', 'N/A')}")
            print(f"Slug: {article.get('slug', 'N/A')}")
            print(f"Content Length: {len(article.get('content', ''))} characters")
            print(f"Total Tokens Used: {metadata.get('tokens_used', 'N/A')}")
            print(f"Total Cost: ${metadata.get('cost_usd', 'N/A')}")
            print(f"Generation Time: {metadata.get('processing_time_seconds', 'N/A')}s")
            print(f"Quality Score: {metadata.get('quality_score', 'N/A')}/100")
            
            # Show content preview
            content = article.get('content', '')
            if content:
                print(f"\n📄 Content Preview (first 300 chars):")
                print("-" * 40)
                print(content[:300] + "..." if len(content) > 300 else content)
            
            # Show fact-check notes if any
            fact_checks = article.get('fact_check_notes', {})
            if fact_checks:
                print(f"\n🔍 Fact-Check Notes:")
                print("-" * 40)
                for key, note in fact_checks.items():
                    print(f"• {key}: {note}")
            
            # Show summary and key points
            summary = article.get('summary', '')
            if summary:
                print(f"\n📝 Summary:")
                print("-" * 40)
                print(summary)
            
            key_points = article.get('key_points', [])
            if key_points:
                print(f"\n🔑 Key Points:")
                print("-" * 40)
                for i, point in enumerate(key_points, 1):
                    print(f"{i}. {point}")
            
            print("\n✅ Pipeline test completed successfully!")
            
        elif response.status_code == 401:
            print("   ❌ Authentication failed - check auth token")
        elif response.status_code == 422:
            print("   ❌ Invalid request parameters")
            print(f"   Response: {response.text}")
        else:
            print(f"   ❌ Request failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.Timeout:
        print("   ⏱️  Request timed out - article generation can take time")
    except Exception as e:
        print(f"   ❌ Error during article generation: {e}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_article_generation()