"""
AI Article Generation Service
FastAPI backend for generating, fact-checking, and formatting articles
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import json
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from models import (
    ArticleGenerationRequest, 
    ContentGenerationRequest,
    ArticleGenerationResponse,
    GenerationSession,
    HealthCheck
)
from services.ai_processor import AIProcessor
from services.database import DatabaseService
from services.auth import get_current_user
from utils.logging import setup_logging

# Load environment variables
load_dotenv()

# Setup logging
logger = setup_logging()

# Initialize services
ai_processor = AIProcessor()
db_service = DatabaseService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    logger.info("Starting AI Article Generation Service")
    await db_service.connect()
    yield
    logger.info("Shutting down AI Article Generation Service")
    await db_service.disconnect()

# Initialize FastAPI app
app = FastAPI(
    title="AI Article Generation Service",
    description="Generate fact-checked articles for Lentils & Millets CMS",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    return HealthCheck(
        status="healthy",
        service="ai-article-generation",
        version="1.0.0"
    )

@app.post("/api/ai/generate-article", response_model=ArticleGenerationResponse)
async def generate_article(
    request: ArticleGenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Main endpoint for AI article generation workflow
    
    Process:
    1. Content Generation: Create comprehensive article from topic
    2. Fact-Checking: Verify claims and add citations
    3. Summarization: Generate key points and summary
    4. CMS Formatting: Structure for database
    5. Session Tracking: Save metadata and results
    """
    try:
        logger.info(f"Starting article generation for topic: {request.topic}")
        
        # Create generation session
        session = await db_service.create_generation_session(
            topic=request.topic,
            user_id=current_user["id"],
            options=request.options.dict() if request.options else {}
        )
        
        # Process article generation pipeline
        result = await ai_processor.generate_article_pipeline(
            topic=request.topic,
            session_id=session.id,
            options=request.options
        )
        
        # Update session with results
        await db_service.update_generation_session(
            session_id=session.id,
            status="completed",
            metadata=result["metadata"]
        )
        
        # Save article to CMS
        try:
            # Convert Pydantic models to dictionaries
            article_dict = result["article"].dict() if hasattr(result["article"], 'dict') else result["article"]
            metadata_dict = result["metadata"].dict() if hasattr(result["metadata"], 'dict') else result["metadata"]
            
            cms_article_id = await db_service.save_article_to_cms(
                session_id=session.id,
                article_data=article_dict,
                metadata=metadata_dict
            )
            logger.info(f"Article saved to CMS with ID: {cms_article_id}")
        except Exception as e:
            logger.error(f"Failed to save article to CMS: {str(e)}")
            # Continue execution - the article generation was successful
        
        # Schedule background tasks for analytics
        background_tasks.add_task(
            track_generation_analytics,
            session_id=session.id,
            result=result
        )
        
        logger.info(f"Article generation completed for session: {session.id}")
        
        return ArticleGenerationResponse(
            success=True,
            session_id=session.id,
            article=result["article"],
            metadata=result["metadata"]
        )
        
    except Exception as e:
        logger.error(f"Article generation failed: {str(e)}")
        
        # Update session status to failed
        if 'session' in locals():
            await db_service.update_generation_session(
                session_id=session.id,
                status="failed",
                error_message=str(e)
            )
        
        raise HTTPException(
            status_code=500,
            detail=f"Article generation failed: {str(e)}"
        )

@app.post("/api/ai/generate-content", response_model=ArticleGenerationResponse)
async def generate_content(
    request: ContentGenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Unified endpoint for generating both articles and recipes
    
    Content Types:
    - article: Educational content with factoids
    - recipe: Cooking instructions with ingredients
    """
    try:
        logger.info(f"Starting {request.content_type} generation for topic: {request.topic}")
        
        # Create generation session
        session = await db_service.create_generation_session(
            topic=request.topic,
            user_id=current_user["id"],
            options=request.options.dict() if request.options else {},
            content_type=request.content_type
        )
        
        # Process generation pipeline
        if request.content_type == "recipe":
            result = await ai_processor.generate_recipe_pipeline(
                topic=request.topic,
                session_id=session.id,
                options=request.options
            )
        else:  # article
            result = await ai_processor.generate_article_pipeline(
                topic=request.topic,
                session_id=session.id,
                options=request.options
            )
        
        # Update session with results
        await db_service.update_generation_session(
            session_id=session.id,
            status="completed",
            metadata=result["metadata"]
        )
        
        # Save to CMS based on content type
        try:
            # Convert Pydantic models to dictionaries
            article_dict = result["article"].dict() if hasattr(result["article"], 'dict') else result["article"]
            metadata_dict = result["metadata"].dict() if hasattr(result["metadata"], 'dict') else result["metadata"]
            
            if request.content_type == "recipe":
                cms_id = await db_service.save_recipe_to_cms(
                    session_id=session.id,
                    recipe_data=article_dict,  # Recipe data is stored in "article" key for compatibility
                    metadata=metadata_dict
                )
                logger.info(f"Recipe saved to CMS with ID: {cms_id}")
            else:  # article
                cms_id = await db_service.save_article_to_cms(
                    session_id=session.id,
                    article_data=article_dict,
                    metadata=metadata_dict
                )
                logger.info(f"Article saved to CMS with ID: {cms_id}")
        except Exception as e:
            logger.error(f"Failed to save {request.content_type} to CMS: {str(e)}")
            # Continue execution - the generation was successful
        
        # Schedule background tasks for analytics
        background_tasks.add_task(
            track_generation_analytics,
            session_id=session.id,
            result=result
        )
        
        logger.info(f"{request.content_type.title()} generation completed for session: {session.id}")
        
        return ArticleGenerationResponse(
            success=True,
            session_id=session.id,
            article=result["article"],
            metadata=result["metadata"]
        )
        
    except Exception as e:
        logger.error(f"{request.content_type.title()} generation failed: {str(e)}")
        
        # Update session status to failed
        if 'session' in locals():
            await db_service.update_generation_session(
                session_id=session.id,
                status="failed",
                error_message=str(e)
            )
        
        raise HTTPException(
            status_code=500,
            detail=f"{request.content_type.title()} generation failed: {str(e)}"
        )

@app.get("/api/ai/sessions/{session_id}")
async def get_generation_session(
    session_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Retrieve generation session details"""
    try:
        session = await db_service.get_generation_session(
            session_id=session_id,
            user_id=current_user["id"]
        )
        
        if not session:
            raise HTTPException(
                status_code=404,
                detail="Generation session not found"
            )
        
        return session
        
    except Exception as e:
        logger.error(f"Failed to retrieve session {session_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve generation session"
        )

@app.post("/api/ai/save-draft")
async def save_as_draft(
    session_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Save generated article as CMS draft"""
    try:
        # Get generation session
        session = await db_service.get_generation_session(
            session_id=session_id,
            user_id=current_user["id"]
        )
        
        if not session:
            raise HTTPException(
                status_code=404,
                detail="Generation session not found"
            )
        
        # Get session with generated content
        session_data = await db_service.get_generation_session(
            session_id=session_id,
            user_id=current_user["id"]
        )
        
        if not session_data.get('generated_data'):
            raise HTTPException(
                status_code=400,
                detail="No generated content found for this session"
            )
        
        # Check if already saved to CMS
        if session_data.get('cms_article_id') or session_data.get('cms_recipe_id'):
            cms_id = session_data.get('cms_article_id') or session_data.get('cms_recipe_id')
            content_type = "article" if session_data.get('cms_article_id') else "recipe"
            
            return {
                "success": True,
                "cms_content_id": cms_id,
                "content_type": content_type,
                "message": f"Content already saved as CMS {content_type} (ID: {cms_id})"
            }
        
        # If not saved yet and has generated data, save it now
        if session_data.get('generated_data'):
            try:
                generated_content = json.loads(session_data['generated_data'])
                content_type = session_data.get('content_type', 'article')
                
                if content_type == "recipe":
                    cms_id = await db_service.save_recipe_to_cms(
                        session_id=session_id,
                        recipe_data=generated_content["recipe"],
                        metadata=generated_content["metadata"]
                    )
                else:
                    cms_id = await db_service.save_article_to_cms(
                        session_id=session_id,
                        article_data=generated_content["article"],
                        metadata=generated_content["metadata"]
                    )
                
                logger.info(f"Manually saved session {session_id} as CMS {content_type} {cms_id}")
                
                return {
                    "success": True,
                    "cms_content_id": cms_id,
                    "content_type": content_type,
                    "message": f"Content saved as CMS {content_type} successfully"
                }
            except Exception as save_error:
                logger.error(f"Failed to save content to CMS: {str(save_error)}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to save content to CMS: {str(save_error)}"
                )
        else:
            raise HTTPException(
                status_code=400,
                detail="No generated content found for this session"
            )
        
    except Exception as e:
        logger.error(f"Failed to save draft for session {session_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to save article as draft"
        )

@app.get("/api/ai/analytics/performance")
async def get_performance_analytics(
    current_user: dict = Depends(get_current_user)
):
    """Get AI model performance analytics"""
    try:
        analytics = await db_service.get_performance_analytics()
        return analytics
        
    except Exception as e:
        logger.error(f"Failed to retrieve analytics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve performance analytics"
        )

async def track_generation_analytics(session_id: int, result):
    """Background task for tracking generation analytics"""
    try:
        await db_service.track_analytics(
            session_id=session_id,
            model_performance=result.metadata,
            quality_metrics=result.article.get("quality_metrics", {})
        )
        logger.info(f"Analytics tracked for session: {session_id}")
        
    except Exception as e:
        logger.error(f"Failed to track analytics for session {session_id}: {str(e)}")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("FASTAPI_HOST", "localhost"),
        port=int(os.getenv("FASTAPI_PORT", 8000)),
        reload=os.getenv("FASTAPI_DEBUG", "false").lower() == "true",
        log_level="info"
    )