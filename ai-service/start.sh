#!/bin/bash

# AI Article Generation Service Startup Script

echo "🚀 Starting AI Article Generation Service..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please update .env with your API keys and configuration"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "🔧 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Check environment variables
echo "🔍 Checking configuration..."
python3 -c "
import os
from dotenv import load_dotenv
load_dotenv()

required_vars = ['OPENAI_API_KEY', 'DATABASE_URL']
missing_vars = []

for var in required_vars:
    if not os.getenv(var):
        missing_vars.append(var)

if missing_vars:
    print(f'❌ Missing required environment variables: {missing_vars}')
    print('📝 Please update your .env file')
    exit(1)
else:
    print('✅ Configuration looks good!')
"

if [ $? -ne 0 ]; then
    exit 1
fi

# Start the service
echo "🚀 Starting FastAPI service..."
echo "📍 Service will be available at http://localhost:8000"
echo "📖 API documentation at http://localhost:8000/docs"
echo ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload