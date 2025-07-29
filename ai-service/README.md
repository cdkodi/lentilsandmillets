# AI Article Generation Service

FastAPI-based microservice for generating, fact-checking, and formatting articles for the Lentils & Millets CMS.

## Features

- **5-Step AI Pipeline**: Content Generation → Fact-Checking → Summarization → CMS Formatting → Quality Assessment
- **Multi-Model Support**: OpenAI GPT-4 and Anthropic Claude integration
- **CMS Integration**: Direct integration with existing PostgreSQL database
- **Performance Tracking**: Analytics for model performance and cost optimization
- **Draft Management**: Generated articles saved as CMS drafts for editorial review

## Quick Start

1. **Setup Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database configuration
   ```

2. **Start Service**:
   ```bash
   ./start.sh
   ```

3. **Access API**:
   - Service: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## API Endpoints

### Generate Article
```http
POST /api/ai/generate-article
Authorization: Bearer <token>
Content-Type: application/json

{
    "topic": "Health benefits of red lentils",
    "options": {
        "target_length": 1500,
        "category": "lentils",
        "include_factoids": true
    }
}
```

### Save as Draft
```http
POST /api/ai/save-draft?session_id=123
Authorization: Bearer <token>
```

### Get Session Details
```http
GET /api/ai/sessions/123
Authorization: Bearer <token>
```

### Performance Analytics
```http
GET /api/ai/analytics/performance
Authorization: Bearer <token>
```

## Configuration

### Required Environment Variables

```env
# AI Service Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=ant-your-anthropic-key

# Database (same as main CMS)
DATABASE_URL=postgresql://username:password@host:port/database

# Service Configuration
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
JWT_SECRET_KEY=your-jwt-secret
```

### Optional Configuration

```env
# AI Model Selection
AI_MODEL_PRIMARY=gpt-4
AI_MODEL_FALLBACK=gpt-3.5-turbo

# Rate Limiting
MAX_TOKENS_PER_REQUEST=4000
DAILY_COST_LIMIT=50.00
RATE_LIMIT_PER_MINUTE=10

# CORS
CORS_ORIGINS=http://localhost:3000,https://lentilsandmillets.com
```

## Development

### Project Structure
```
ai-service/
├── main.py                 # FastAPI application
├── models.py              # Pydantic models
├── requirements.txt       # Dependencies
├── start.sh              # Startup script
├── services/
│   ├── ai_processor.py   # 5-step AI pipeline
│   ├── database.py       # Database operations
│   ├── prompts.py        # Prompt templates
│   └── auth.py           # Authentication
└── utils/
    └── logging.py        # Logging configuration
```

### Running in Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test article generation
curl -X POST http://localhost:8000/api/ai/generate-article \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{"topic": "Benefits of pearl millet"}'
```

## Architecture

### AI Processing Pipeline

1. **Content Generation**: Creates comprehensive article from topic input
2. **Fact-Checking**: Verifies claims and adds credible citations
3. **Summarization**: Generates executive summary and key points
4. **CMS Formatting**: Structures content for database storage
5. **Quality Assessment**: Evaluates content across multiple dimensions

### Database Integration

The service extends the existing CMS database with AI-specific tables and columns:

- `ai_generation_sessions`: Tracks all generation requests
- `cms_articles` extended with AI metadata fields

### Authentication

Simple JWT-based authentication that integrates with the existing CMS user system. For development, accepts `dev-token` for testing.

## Production Deployment

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production
- Use strong JWT secrets
- Configure proper CORS origins
- Set appropriate rate limits
- Use production database credentials

### Monitoring
- Health checks at `/health`
- Performance analytics at `/api/ai/analytics/performance`
- Structured logging for debugging

## Cost Management

The service tracks costs for each AI generation and provides analytics:

- Per-request cost tracking
- Daily/monthly cost summaries
- Model performance vs. cost analysis
- Configurable cost limits and alerts

## Error Handling

- Graceful degradation when AI services are unavailable
- Automatic retries with exponential backoff
- Comprehensive error logging
- User-friendly error messages

## Security

- JWT-based authentication
- API rate limiting
- Input validation and sanitization
- Secure storage of API keys
- CORS configuration for web integration

## Support

For issues and questions:
1. Check the logs: Service logs all operations with structured logging
2. Test endpoints: Use `/health` for service status
3. Review documentation: Complete API docs at `/docs`
4. Check configuration: Verify all required environment variables