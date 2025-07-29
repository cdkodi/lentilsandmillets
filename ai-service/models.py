"""
Pydantic models for AI Article Generation Service
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
from datetime import datetime
from enum import Enum

class ArticleCategory(str, Enum):
    LENTILS = "lentils"
    MILLETS = "millets"
    GENERAL = "general"

class GenerationOptions(BaseModel):
    target_length: int = Field(default=1500, ge=800, le=3000)
    category: ArticleCategory = ArticleCategory.GENERAL
    include_factoids: bool = True
    include_seo_meta: bool = True
    brand_voice: str = "authoritative_approachable"

class ContentGenerationRequest(BaseModel):
    topic: str = Field(..., min_length=5, max_length=200)
    content_type: str = Field(default="article", pattern="^(article|recipe)$")
    options: Optional[GenerationOptions] = None

# Keep backward compatibility
class ArticleGenerationRequest(BaseModel):
    topic: str = Field(..., min_length=5, max_length=200)
    options: Optional[GenerationOptions] = None

class FactCheckNote(BaseModel):
    claim: str
    verification_status: str  # verified, unverified, flagged
    sources: List[str] = []
    confidence_score: float = Field(..., ge=0, le=100)

class GeneratedArticle(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: str
    summary: str
    key_points: List[str]
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    fact_check_notes: Dict[str, Any] = {}
    quality_metrics: Dict[str, float] = {}

class GenerationMetadata(BaseModel):
    model_used: str
    tokens_used: int
    processing_time_seconds: float
    cost_usd: float
    quality_score: int = Field(..., ge=0, le=100)
    steps_completed: List[str]
    timestamp: datetime

class ArticleGenerationResponse(BaseModel):
    success: bool
    session_id: int
    article: GeneratedArticle
    metadata: GenerationMetadata
    error: Optional[str] = None

class GenerationSession(BaseModel):
    id: int
    topic_input: str
    user_id: int
    session_timestamp: datetime
    status: str  # processing, completed, failed
    model_used: Optional[str] = None
    total_tokens: Optional[int] = None
    total_cost: Optional[float] = None
    processing_time_seconds: Optional[int] = None
    cms_article_id: Optional[int] = None
    error_message: Optional[str] = None

class HealthCheck(BaseModel):
    status: str
    service: str
    version: str
    timestamp: datetime = Field(default_factory=datetime.now)

class AIModelPerformance(BaseModel):
    model_name: str
    total_generations: int
    average_quality_score: float
    average_cost: float
    average_processing_time: float
    success_rate: float
    last_updated: datetime

class PerformanceAnalytics(BaseModel):
    total_generations: int
    models: List[AIModelPerformance]
    cost_summary: Dict[str, float]
    quality_trends: Dict[str, List[float]]
    popular_topics: List[Dict[str, Any]]