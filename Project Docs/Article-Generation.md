# AI Article Generation System

## Overview
The AI Article Generation system empowers the editorial team to create high-quality, fact-checked articles through a simple web interface. The system generates comprehensive content from topic inputs, performs fact-checking with citations, and saves articles as drafts for editorial review before publication.

## System Architecture

### Simple Implementation (Phase 1)
The foundational implementation follows a linear 5-step workflow:

```
Topic Input → Content Generation → Fact-Checking → Summarization → CMS Formatting → Draft Creation
```

### Advanced Implementation (Future Phases)
The complete system will support multi-model comparison, performance tracking, and advanced prompt management:

```
Topic Input → Multiple AI Models → Quality Assessment → Best Content Selection → Specialized Processing → Performance Analytics → Draft Creation
```

## Simple Implementation Specification

### 5-Step Processing Workflow

#### 1. Content Generation
**Purpose**: Create comprehensive article content from topic input
**Process**:
- User inputs topic (e.g., "Health benefits of red lentils")
- AI model generates 1200-1500 word article
- Content structured with headings, subheadings, and proper formatting
- Focused on brand voice and target audience

**AI Model**: OpenAI GPT-4 or Anthropic Claude
**Prompt Template**: Optimized for nutrition/food content with brand guidelines

#### 2. Fact-Checking
**Purpose**: Verify claims and add credible citations
**Process**:
- Review generated content for factual claims
- Cross-reference health/nutrition statements
- Add citations from credible sources
- Flag questionable claims for editorial review
- Generate confidence scores for key facts

**Output**: Enhanced content with citations and credibility notes

#### 3. Summarization
**Purpose**: Generate key points and executive summary
**Process**:
- Create 150-200 word executive summary
- Extract 5-7 key takeaways as bullet points
- Generate 3-4 actionable tips for readers
- Identify primary health benefits and nutritional highlights

**Output**: Structured summary content for article metadata

#### 4. CMS Formatting
**Purpose**: Structure output for existing article schema
**Process**:
- Format content to match `cms_articles` table structure
- Generate SEO-optimized title and meta description
- Create slug from title
- Structure content with proper HTML markup
- Prepare factoid data if applicable

**Output**: CMS-ready article data structure

#### 5. Draft Creation
**Purpose**: Save to database with appropriate metadata
**Process**:
- Save article with `status: 'draft'`
- Add AI generation metadata
- Link to generation session for tracking
- Create editorial review tasks
- Generate preview for team review

**Output**: Draft article in CMS ready for editorial review

## Database Schema Extensions

### AI Metadata Fields for cms_articles
```sql
-- Add to existing cms_articles table
ALTER TABLE cms_articles ADD COLUMN ai_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE cms_articles ADD COLUMN generation_prompt TEXT;
ALTER TABLE cms_articles ADD COLUMN ai_model_used VARCHAR(50);
ALTER TABLE cms_articles ADD COLUMN generation_timestamp TIMESTAMP;
ALTER TABLE cms_articles ADD COLUMN fact_check_notes JSON;
ALTER TABLE cms_articles ADD COLUMN quality_score INTEGER;
ALTER TABLE cms_articles ADD COLUMN generation_cost DECIMAL(8,4);
```

### AI Generation Sessions Table
```sql
CREATE TABLE ai_generation_sessions (
    id SERIAL PRIMARY KEY,
    topic_input TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id),
    session_timestamp TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'processing', -- processing, completed, failed
    
    -- Simple implementation metadata
    model_used VARCHAR(50),
    total_tokens INTEGER,
    total_cost DECIMAL(8,4),
    processing_time_seconds INTEGER,
    
    -- Generated content references
    cms_article_id INTEGER REFERENCES cms_articles(id),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Design

### Python FastAPI Service Endpoints

#### POST /api/ai/generate-article
**Purpose**: Main endpoint for article generation workflow
**Request**:
```json
{
    "topic": "Health benefits of red lentils",
    "user_id": 1,
    "options": {
        "target_length": 1500,
        "include_factoids": true,
        "category": "lentils"
    }
}
```

**Response**:
```json
{
    "success": true,
    "session_id": 123,
    "article": {
        "title": "Red Lentils: Complete Nutritional Guide",
        "slug": "red-lentils-complete-nutritional-guide",
        "content": "Generated article content...",
        "excerpt": "Generated excerpt...",
        "summary": "Executive summary...",
        "key_points": ["Point 1", "Point 2", "Point 3"],
        "fact_check_notes": {
            "verified_claims": 15,
            "citations_added": 8,
            "confidence_score": 92
        }
    },
    "metadata": {
        "model_used": "gpt-4",
        "tokens_used": 2847,
        "processing_time": 23.4,
        "cost": 0.12,
        "quality_score": 91
    }
}
```

#### GET /api/ai/sessions/{session_id}
**Purpose**: Retrieve generation session details

#### POST /api/ai/save-draft
**Purpose**: Save generated article as CMS draft

### Next.js Integration Endpoints

#### POST /api/cms/ai-articles
**Purpose**: Save AI-generated article to CMS database
**Integration**: Connects FastAPI output to existing CMS structure

## Admin Panel Interface

### Content Generator Page: `/admin-panel/content-generator`

#### Form Interface
```jsx
<form className="space-y-6">
    <div>
        <label htmlFor="topic">Article Topic</label>
        <input 
            type="text" 
            id="topic"
            placeholder="e.g., Health benefits of red lentils"
            className="w-full px-4 py-2 border rounded-lg"
        />
    </div>
    
    <div className="grid grid-cols-2 gap-4">
        <select name="category">
            <option value="lentils">Lentils</option>
            <option value="millets">Millets</option>
            <option value="general">General</option>
        </select>
        
        <select name="target_length">
            <option value="1200">Short (1200 words)</option>
            <option value="1500">Medium (1500 words)</option>
            <option value="2000">Long (2000 words)</option>
        </select>
    </div>
    
    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg">
        Generate Article
    </button>
</form>
```

#### Processing States
- **Generating Content**: Progress indicator with estimated time
- **Fact-Checking**: Verification progress with claim count
- **Creating Summary**: Final processing step
- **Complete**: Article preview with action buttons

#### Action Buttons
- **Save as Draft**: Saves to CMS for editorial review
- **Edit Now**: Direct link to CMS article edit form
- **Generate Another**: Reset form for new topic
- **Discard**: Delete generation session

## Prompt Templates

### Content Generation Prompt
```
You are a nutrition expert writing for health-conscious consumers interested in plant-based proteins and ancient grains.

Topic: {topic}
Target Length: {target_length} words
Category: {category}
Brand Voice: Authoritative yet approachable, science-backed but accessible

Create a comprehensive article about {topic} that includes:

1. **Nutritional Breakdown**: Specific metrics, vitamins, minerals, macronutrients
2. **Health Benefits**: Research-backed benefits with scientific context
3. **Practical Applications**: Cooking tips, preparation methods, storage advice
4. **Comparison Analysis**: How it compares to similar foods
5. **Selection & Storage**: Buying guides and freshness indicators
6. **Environmental Impact**: Sustainability aspects and farming practices

Writing Guidelines:
- Use active voice and engaging subheadings
- Include specific statistics and studies when possible
- Write at 8th-grade reading level for accessibility
- Maintain encouraging, positive tone throughout
- Structure with clear H2 and H3 headings for web readability
- Integrate relevant keywords naturally for SEO
- Include practical tips readers can immediately implement

Focus Areas for {category}:
- Lentils: Protein content, cooking versatility, meal prep applications
- Millets: Gluten-free benefits, ancient grain history, modern applications
- General: Broad health benefits, dietary integration, lifestyle impact

Create an article that educates, inspires, and provides actionable value to readers interested in healthy, sustainable nutrition.
```

### Fact-Checking Prompt
```
Review the following article for factual accuracy and add credible citations:

Article Content: {content}

Tasks:
1. **Verify Health Claims**: Check all nutritional and health benefit statements
2. **Add Citations**: Include credible sources for key claims (PubMed, nutrition databases, peer-reviewed studies)
3. **Flag Uncertainties**: Identify any claims that need editorial review
4. **Enhance Credibility**: Add specific study references where beneficial
5. **Update Statistics**: Ensure all numbers and percentages are current and accurate

Citation Format:
- Use numbered references [1], [2], etc.
- Include source titles and publication dates
- Prioritize recent studies (last 5 years) and authoritative sources
- Add brief credibility note for each major claim

Return the enhanced article with citations and a fact-check summary including:
- Number of claims verified
- Citations added
- Confidence score (0-100)
- Any flags for editorial review
```

### Summarization Prompt
```
Create a comprehensive summary package for this article:

Article: {content}

Generate:

1. **Executive Summary** (150-200 words):
   - Main topic overview
   - Key benefits highlighted
   - Primary takeaway for readers

2. **Key Points** (5-7 bullet points):
   - Most important facts and benefits
   - Actionable insights
   - Memorable statistics or findings

3. **Quick Tips** (3-4 practical applications):
   - Immediate actions readers can take
   - Simple implementation advice
   - Kitchen or lifestyle applications

4. **SEO Meta Description** (150-160 characters):
   - Compelling summary for search results
   - Include primary keyword
   - Action-oriented language

Format as structured JSON for easy CMS integration.
```

## Future Enhancement Roadmap

### Phase 2: Multi-Model Comparison
- **Parallel Processing**: Run multiple AI models simultaneously
- **Quality Scoring**: Automated assessment of generated content
- **Best Selection**: Choose optimal content from multiple outputs
- **Cost Optimization**: Balance quality with generation costs

### Phase 3: Performance Analytics
- **Model Performance Tracking**: Success rates, quality scores, costs
- **Topic-Specific Optimization**: Best models for different content types
- **A/B Testing Framework**: Compare prompt variations and models
- **Continuous Improvement**: Automated prompt refinement based on performance

### Phase 4: Advanced Features
- **Custom Prompt Templates**: User-defined generation parameters
- **Multi-Language Support**: Generate content in multiple languages
- **Brand Voice Training**: Fine-tuned models for specific brand voice
- **Integration APIs**: Connect with external fact-checking services

## Error Handling & Fallbacks

### Common Error Scenarios
1. **AI Service Timeout**: Retry with exponential backoff
2. **Content Quality Issues**: Flag for human review
3. **Fact-Check Failures**: Mark claims as "unverified"
4. **Database Errors**: Queue for retry, notify administrators
5. **Rate Limiting**: Implement request queuing system

### Quality Assurance
- **Minimum Length Requirements**: Ensure articles meet word count targets
- **Content Relevance Check**: Verify topic alignment
- **Brand Voice Validation**: Check tone and style consistency
- **Duplicate Detection**: Prevent similar content generation

## Security & Privacy

### Data Protection
- **API Key Management**: Secure storage of AI service credentials
- **Content Encryption**: Encrypt sensitive content in transit
- **User Access Control**: Role-based permissions for AI generation
- **Audit Logging**: Track all generation activities

### Cost Management
- **Usage Monitoring**: Track AI service costs per user/session
- **Budget Alerts**: Notify when approaching cost thresholds
- **Rate Limiting**: Prevent excessive usage
- **Cost Attribution**: Track costs by user and content type

## Testing Strategy

### Unit Tests
- Prompt template validation
- Content formatting functions
- Database integration methods
- Error handling scenarios

### Integration Tests
- End-to-end workflow testing
- AI service connectivity
- CMS database operations
- Authentication integration

### User Acceptance Tests
- Editorial team workflow validation
- Content quality assessment
- Performance benchmarking
- Usability testing

## Deployment Configuration

### Environment Variables
```env
# AI Service Configuration
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=ant-...
AI_MODEL_PRIMARY=gpt-4
AI_MODEL_FALLBACK=gpt-3.5-turbo

# Service Configuration
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
FASTAPI_DEBUG=false

# Database Configuration
AI_DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET_KEY=...
CORS_ORIGINS=http://localhost:3000,https://lentilsandmillets.com
```

### Production Deployment
- **Docker Containerization**: Containerized Python service
- **Load Balancing**: Handle multiple concurrent requests
- **Monitoring**: Application performance and error tracking
- **Scaling**: Auto-scaling based on demand

This documentation provides the complete framework for implementing the AI Article Generation system, starting with the simple 5-step workflow and establishing the foundation for advanced features in future phases.