"""
Database Service for AI Article Generation
Handles database operations and CMS integration
"""

import os
import json
from typing import Dict, List, Optional, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from slugify import slugify

from models import GenerationSession, PerformanceAnalytics
from utils.logging import get_logger

logger = get_logger(__name__)

class DatabaseService:
    def __init__(self):
        self.connection_string = os.getenv("DATABASE_URL")
        self.connection = None
    
    async def connect(self):
        """Establish database connection"""
        try:
            self.connection = psycopg2.connect(
                self.connection_string,
                cursor_factory=RealDictCursor
            )
            logger.info("Database connection established")
            
            # Ensure tables exist
            await self._create_tables_if_not_exist()
            
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            raise e
    
    async def disconnect(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            logger.info("Database connection closed")
    
    async def _create_tables_if_not_exist(self):
        """Create AI-related tables if they don't exist"""
        try:
            cursor = self.connection.cursor()
            
            # Create AI generation sessions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ai_generation_sessions (
                    id SERIAL PRIMARY KEY,
                    topic_input TEXT NOT NULL,
                    user_id INTEGER NOT NULL,
                    content_type VARCHAR(10) DEFAULT 'article', -- 'article' or 'recipe'
                    session_timestamp TIMESTAMP DEFAULT NOW(),
                    status VARCHAR(20) DEFAULT 'processing',
                    
                    model_used VARCHAR(50),
                    total_tokens INTEGER,
                    total_cost DECIMAL(8,4),
                    processing_time_seconds INTEGER,
                    quality_score INTEGER,
                    
                    generated_data JSONB, -- Store the complete generated content
                    cms_article_id INTEGER,
                    cms_recipe_id INTEGER,
                    error_message TEXT,
                    
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
            """)
            
            # Add AI metadata columns to articles table if they don't exist
            cursor.execute("""
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='articles' AND column_name='ai_generated') THEN
                        ALTER TABLE articles ADD COLUMN ai_generated BOOLEAN DEFAULT FALSE;
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='articles' AND column_name='generation_prompt') THEN
                        ALTER TABLE articles ADD COLUMN generation_prompt TEXT;
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='articles' AND column_name='ai_model_used') THEN
                        ALTER TABLE articles ADD COLUMN ai_model_used VARCHAR(50);
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='articles' AND column_name='generation_timestamp') THEN
                        ALTER TABLE articles ADD COLUMN generation_timestamp TIMESTAMP;
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='articles' AND column_name='fact_check_notes') THEN
                        ALTER TABLE articles ADD COLUMN fact_check_notes JSONB;
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='articles' AND column_name='ai_quality_score') THEN
                        ALTER TABLE articles ADD COLUMN ai_quality_score INTEGER;
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='articles' AND column_name='generation_cost') THEN
                        ALTER TABLE articles ADD COLUMN generation_cost DECIMAL(8,4);
                    END IF;
                END
                $$;
            """)
            
            # Add AI metadata columns to recipes table if they don't exist
            cursor.execute("""
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='recipes' AND column_name='ai_generated') THEN
                        ALTER TABLE recipes ADD COLUMN ai_generated BOOLEAN DEFAULT FALSE;
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='recipes' AND column_name='generation_prompt') THEN
                        ALTER TABLE recipes ADD COLUMN generation_prompt TEXT;
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='recipes' AND column_name='ai_model_used') THEN
                        ALTER TABLE recipes ADD COLUMN ai_model_used VARCHAR(50);
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='recipes' AND column_name='generation_timestamp') THEN
                        ALTER TABLE recipes ADD COLUMN generation_timestamp TIMESTAMP;
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='recipes' AND column_name='ai_quality_score') THEN
                        ALTER TABLE recipes ADD COLUMN ai_quality_score INTEGER;
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='recipes' AND column_name='generation_cost') THEN
                        ALTER TABLE recipes ADD COLUMN generation_cost DECIMAL(8,4);
                    END IF;
                END
                $$;
            """)
            
            self.connection.commit()
            cursor.close()
            logger.info("Database tables verified/created successfully")
            
        except Exception as e:
            logger.error(f"Failed to create database tables: {str(e)}")
            raise e
    
    async def create_generation_session(
        self, 
        topic: str, 
        user_id: int, 
        options: Dict[str, Any] = None,
        content_type: str = 'article'
    ) -> GenerationSession:
        """Create a new generation session"""
        try:
            cursor = self.connection.cursor()
            
            cursor.execute("""
                INSERT INTO ai_generation_sessions (topic_input, user_id, content_type, status)
                VALUES (%s, %s, %s, %s)
                RETURNING id, topic_input, user_id, content_type, session_timestamp, status
            """, (topic, user_id, content_type, 'processing'))
            
            result = cursor.fetchone()
            self.connection.commit()
            cursor.close()
            
            session = GenerationSession(
                id=result['id'],
                topic_input=result['topic_input'],
                user_id=result['user_id'],
                session_timestamp=result['session_timestamp'],
                status=result['status']
            )
            
            logger.info(f"Created generation session {session.id} for user {user_id}")
            return session
            
        except Exception as e:
            logger.error(f"Failed to create generation session: {str(e)}")
            raise e
    
    async def update_generation_session(
        self, 
        session_id: int, 
        status: str,
        metadata: Dict[str, Any] = None,
        error_message: str = None
    ):
        """Update generation session with results"""
        try:
            cursor = self.connection.cursor()
            
            update_fields = ["status = %s", "updated_at = NOW()"]
            values = [status]
            
            if metadata:
                update_fields.extend([
                    "model_used = %s",
                    "total_tokens = %s", 
                    "total_cost = %s",
                    "processing_time_seconds = %s",
                    "quality_score = %s"
                ])
                values.extend([
                    metadata.model_used,
                    metadata.tokens_used,
                    metadata.cost_usd,
                    int(metadata.processing_time_seconds),
                    metadata.quality_score
                ])
            
            if error_message:
                update_fields.append("error_message = %s")
                values.append(error_message)
            
            values.append(session_id)
            
            query = f"""
                UPDATE ai_generation_sessions 
                SET {', '.join(update_fields)}
                WHERE id = %s
            """
            
            cursor.execute(query, values)
            self.connection.commit()
            cursor.close()
            
            logger.info(f"Updated generation session {session_id} with status {status}")
            
        except Exception as e:
            logger.error(f"Failed to update generation session {session_id}: {str(e)}")
            raise e
    
    async def get_generation_session(self, session_id: int, user_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve generation session by ID"""
        try:
            cursor = self.connection.cursor()
            
            cursor.execute("""
                SELECT * FROM ai_generation_sessions 
                WHERE id = %s AND user_id = %s
            """, (session_id, user_id))
            
            result = cursor.fetchone()
            cursor.close()
            
            if result:
                return dict(result)
            return None
            
        except Exception as e:
            logger.error(f"Failed to retrieve generation session {session_id}: {str(e)}")
            raise e
    
    async def save_as_cms_draft(
        self, 
        session: Dict[str, Any], 
        generated_content: Dict[str, Any],
        user_id: int
    ) -> int:
        """Save generated content as CMS draft (article or recipe)"""
        try:
            cursor = self.connection.cursor()
            
            content_type = session.get('content_type', 'article')
            
            if content_type == 'article':
                return await self._save_article_draft(cursor, session, generated_content, user_id)
            elif content_type == 'recipe':
                return await self._save_recipe_draft(cursor, session, generated_content, user_id)
            else:
                raise ValueError(f"Unsupported content type: {content_type}")
                
        except Exception as e:
            logger.error(f"Failed to save CMS draft for session {session['id']}: {str(e)}")
            raise e
    
    async def _save_article_draft(
        self, 
        cursor, 
        session: Dict[str, Any], 
        article_data: Dict[str, Any],
        user_id: int
    ) -> int:
        """Save generated article as draft"""
        try:
            # Determine category from topic or use default
            category = self._infer_category_from_topic(session['topic_input'])
            
            # Create factoid data if this is educational content
            factoid_data = self._create_factoid_data(article_data, category)
            
            cursor.execute("""
                INSERT INTO articles (
                    title, slug, content, excerpt, author, category, 
                    factoid_data, meta_title, meta_description, tags, status,
                    ai_generated, generation_prompt, ai_model_used, 
                    generation_timestamp, fact_check_notes, ai_quality_score, generation_cost,
                    created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s,
                    NOW(), NOW()
                )
                RETURNING id
            """, (
                article_data.get('title', f"AI Generated: {session['topic_input']}"),
                article_data.get('slug', slugify(session['topic_input'])),
                article_data.get('content', ''),
                article_data.get('excerpt', ''),
                'AI Assistant',
                category,
                json.dumps(factoid_data) if factoid_data else None,
                article_data.get('meta_title', ''),
                article_data.get('meta_description', ''),
                article_data.get('tags', []),
                'draft',
                True,
                session['topic_input'],
                session.get('model_used'),
                session.get('session_timestamp'),
                json.dumps(article_data.get('fact_check_notes', {})),
                session.get('quality_score'),
                session.get('total_cost')
            ))
            
            article_id = cursor.fetchone()['id']
            
            # Update session with CMS article ID
            cursor.execute("""
                UPDATE ai_generation_sessions 
                SET cms_article_id = %s, generated_data = %s
                WHERE id = %s
            """, (article_id, json.dumps(article_data), session['id']))
            
            self.connection.commit()
            
            logger.info(f"Saved session {session['id']} as article draft {article_id}")
            return article_id
            
        except Exception as e:
            self.connection.rollback()
            raise e
    
    async def _save_recipe_draft(
        self, 
        cursor, 
        session: Dict[str, Any], 
        recipe_data: Dict[str, Any],
        user_id: int
    ) -> int:
        """Save generated recipe as draft"""
        try:
            # Determine category from topic
            category = self._infer_category_from_topic(session['topic_input'])
            
            cursor.execute("""
                INSERT INTO recipes (
                    title, slug, description, prep_time, cook_time, servings, difficulty,
                    ingredients, instructions, category, meal_type, dietary_tags,
                    calories_per_serving, protein_grams, fiber_grams,
                    nutritional_highlights, health_benefits, meta_title, meta_description, status,
                    ai_generated, generation_prompt, ai_model_used, 
                    generation_timestamp, ai_quality_score, generation_cost,
                    created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s,
                    NOW(), NOW()
                )
                RETURNING id
            """, (
                recipe_data.get('title', f"AI Generated: {session['topic_input']}"),
                recipe_data.get('slug', slugify(session['topic_input'])),
                recipe_data.get('description', ''),
                recipe_data.get('prep_time'),
                recipe_data.get('cook_time'),
                recipe_data.get('servings', 4),
                recipe_data.get('difficulty', 'easy'),
                json.dumps(recipe_data.get('ingredients', [])),
                json.dumps(recipe_data.get('instructions', [])),
                category,
                recipe_data.get('meal_type', 'dinner'),
                recipe_data.get('dietary_tags', []),
                recipe_data.get('calories_per_serving'),
                recipe_data.get('protein_grams'),
                recipe_data.get('fiber_grams'),
                recipe_data.get('nutritional_highlights', []),
                recipe_data.get('health_benefits', []),
                recipe_data.get('meta_title', ''),
                recipe_data.get('meta_description', ''),
                'draft',
                True,
                session['topic_input'],
                session.get('model_used'),
                session.get('session_timestamp'),
                session.get('quality_score'),
                session.get('total_cost')
            ))
            
            recipe_id = cursor.fetchone()['id']
            
            # Update session with CMS recipe ID
            cursor.execute("""
                UPDATE ai_generation_sessions 
                SET cms_recipe_id = %s, generated_data = %s
                WHERE id = %s
            """, (recipe_id, json.dumps(recipe_data), session['id']))
            
            self.connection.commit()
            
            logger.info(f"Saved session {session['id']} as recipe draft {recipe_id}")
            return recipe_id
            
        except Exception as e:
            self.connection.rollback()
            raise e
    
    def _infer_category_from_topic(self, topic: str) -> str:
        """Infer content category from topic"""
        topic_lower = topic.lower()
        
        # Check for millet keywords
        millet_keywords = ['millet', 'pearl millet', 'finger millet', 'foxtail millet', 'barnyard millet']
        if any(keyword in topic_lower for keyword in millet_keywords):
            return 'millets'
        
        # Check for lentil keywords
        lentil_keywords = ['lentil', 'red lentil', 'green lentil', 'black lentil', 'dal', 'pulses']
        if any(keyword in topic_lower for keyword in lentil_keywords):
            return 'lentils'
        
        # Default to lentils if unclear
        return 'lentils'
    
    def _create_factoid_data(self, article_data: Dict[str, Any], category: str) -> Dict[str, Any]:
        """Create factoid data for article cards"""
        # This would be enhanced to extract specific nutritional facts from the content
        # For now, return basic structure based on category
        
        if category == 'lentils':
            return {
                "primary_stat": {"value": "25g", "label": "Protein per 100g"},
                "secondary_stat": {"value": "15min", "label": "Cook Time"},
                "icon": "protein",
                "highlights": ["High in protein", "Quick cooking", "Heart healthy"]
            }
        elif category == 'millets':
            return {
                "primary_stat": {"value": "8g", "label": "Fiber per 100g"},
                "secondary_stat": {"value": "Low GI", "label": "Glycemic Index"},
                "icon": "nutrition",
                "highlights": ["Gluten-free", "Ancient grain", "Diabetes-friendly"]
            }
        
        return None
    
    async def get_performance_analytics(self) -> Dict[str, Any]:
        """Get AI model performance analytics"""
        try:
            cursor = self.connection.cursor()
            
            # Get total generations
            cursor.execute("SELECT COUNT(*) as total FROM ai_generation_sessions")
            total_generations = cursor.fetchone()['total']
            
            # Get model performance stats
            cursor.execute("""
                SELECT 
                    model_used,
                    COUNT(*) as total_generations,
                    AVG(quality_score) as avg_quality,
                    AVG(total_cost) as avg_cost,
                    AVG(processing_time_seconds) as avg_time,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END)::float / COUNT(*) as success_rate
                FROM ai_generation_sessions 
                WHERE model_used IS NOT NULL
                GROUP BY model_used
            """)
            
            model_stats = cursor.fetchall()
            
            # Get cost summary
            cursor.execute("""
                SELECT 
                    SUM(total_cost) as total_cost,
                    AVG(total_cost) as avg_cost_per_article,
                    DATE(created_at) as date,
                    SUM(total_cost) as daily_cost
                FROM ai_generation_sessions 
                WHERE total_cost IS NOT NULL
                    AND created_at >= NOW() - INTERVAL '30 days'
                GROUP BY DATE(created_at)
                ORDER BY date DESC
                LIMIT 30
            """)
            
            cost_data = cursor.fetchall()
            
            cursor.close()
            
            return {
                "total_generations": total_generations,
                "model_performance": [dict(row) for row in model_stats],
                "cost_trends": [dict(row) for row in cost_data],
                "last_updated": datetime.now()
            }
            
        except Exception as e:
            logger.error(f"Failed to retrieve performance analytics: {str(e)}")
            raise e
    
    async def track_analytics(
        self, 
        session_id: int, 
        model_performance: Dict[str, Any], 
        quality_metrics: Dict[str, Any]
    ):
        """Track analytics data for performance monitoring"""
        try:
            # This would be expanded to track detailed analytics
            # For now, we'll just log the data
            logger.info(f"Analytics tracked for session {session_id}: "
                       f"Quality score: {quality_metrics.get('overall_score', 'N/A')}, "
                       f"Model: {model_performance.get('model_used', 'N/A')}")
            
        except Exception as e:
            logger.error(f"Failed to track analytics for session {session_id}: {str(e)}")
    
    async def save_article_to_cms(
        self,
        session_id: int,
        article_data: Dict[str, Any], 
        metadata: Dict[str, Any],
        card_position: str = None
    ) -> int:
        """Save generated article to CMS cms_articles table"""
        try:
            cursor = self.connection.cursor()
            
            # Determine category from article content or metadata
            category = "lentils"  # Default
            if "millet" in article_data.get("title", "").lower():
                category = "millets"
            
            # Auto-assign card position if not provided
            if not card_position:
                if category == "lentils":
                    # Find next available lentil position (L1-L8)
                    cursor.execute("""
                        SELECT card_position FROM cms_articles 
                        WHERE card_position LIKE 'L%' 
                        ORDER BY card_position
                    """)
                    used_positions = [row['card_position'] for row in cursor.fetchall()]
                    for i in range(1, 9):  # L1-L8
                        pos = f"L{i}"
                        if pos not in used_positions:
                            card_position = pos
                            break
                    # Fallback if all positions are taken
                    if not card_position:
                        card_position = f"L{len(used_positions) + 1}"
                else:
                    # Find next available millet position (M1-M8)
                    cursor.execute("""
                        SELECT card_position FROM cms_articles 
                        WHERE card_position LIKE 'M%' 
                        ORDER BY card_position
                    """)
                    used_positions = [row['card_position'] for row in cursor.fetchall()]
                    for i in range(1, 9):  # M1-M8
                        pos = f"M{i}"
                        if pos not in used_positions:
                            card_position = pos
                            break
                    # Fallback if all positions are taken
                    if not card_position:
                        card_position = f"M{len(used_positions) + 1}"
            
            # Insert article into cms_articles table
            cursor.execute("""
                INSERT INTO cms_articles (
                    title, slug, content, excerpt, author, category, 
                    card_position, meta_title, meta_description, 
                    status, published_at, created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW()
                )
                RETURNING id
            """, (
                article_data.get("title"),
                article_data.get("slug"),
                article_data.get("content"),
                article_data.get("excerpt"),
                "AI Assistant",  # Author
                category,
                card_position,
                article_data.get("meta_title"),
                article_data.get("meta_description"),
                "draft",  # Status - save as draft initially
                None  # published_at - will be set when published
            ))
            
            cms_article_id = cursor.fetchone()['id']
            
            # Update the generation session with the CMS article ID
            cursor.execute("""
                UPDATE ai_generation_sessions 
                SET cms_article_id = %s, 
                    generated_data = %s,
                    updated_at = NOW()
                WHERE id = %s
            """, (cms_article_id, json.dumps({
                "article": article_data,
                "metadata": metadata
            }, default=str), session_id))
            
            self.connection.commit()
            cursor.close()
            
            logger.info(f"Saved article to CMS: Article ID {cms_article_id}, Card Position {card_position}")
            return cms_article_id
            
        except Exception as e:
            if cursor:
                cursor.close()
            logger.error(f"Failed to save article to CMS: {str(e)}")
            raise e
    
    async def save_recipe_to_cms(
        self,
        session_id: int,
        recipe_data: Dict[str, Any], 
        metadata: Dict[str, Any]
    ) -> int:
        """Save generated recipe to CMS cms_recipes table"""
        try:
            cursor = self.connection.cursor()
            
            # Insert recipe into cms_recipes table
            cursor.execute("""
                INSERT INTO cms_recipes (
                    title, slug, description, prep_time, cook_time, 
                    servings, difficulty, ingredients, instructions,
                    nutritional_highlights, dietary_tags, author,
                    status, created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW()
                )
                RETURNING id
            """, (
                recipe_data.get("title"),
                recipe_data.get("slug"),
                recipe_data.get("excerpt", ""),
                recipe_data.get("prep_time", 15),
                recipe_data.get("cook_time", 30),
                recipe_data.get("servings", 4),
                recipe_data.get("difficulty", "easy"),
                json.dumps(recipe_data.get("ingredients", [])),
                json.dumps(recipe_data.get("instructions", [])),
                json.dumps(recipe_data.get("nutritional_highlights", [])),
                json.dumps(recipe_data.get("dietary_tags", ["plant-based"])),
                "AI Assistant",
                "draft"
            ))
            
            cms_recipe_id = cursor.fetchone()['id']
            
            # Update the generation session with the CMS recipe ID
            cursor.execute("""
                UPDATE ai_generation_sessions 
                SET cms_recipe_id = %s,
                    generated_data = %s,
                    updated_at = NOW()
                WHERE id = %s
            """, (cms_recipe_id, json.dumps({
                "recipe": recipe_data,
                "metadata": metadata
            }, default=str), session_id))
            
            self.connection.commit()
            cursor.close()
            
            logger.info(f"Saved recipe to CMS: Recipe ID {cms_recipe_id}")
            return cms_recipe_id
            
        except Exception as e:
            if cursor:
                cursor.close()
            logger.error(f"Failed to save recipe to CMS: {str(e)}")
            raise e