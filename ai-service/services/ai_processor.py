"""
AI Processing Service
Handles the 5-step article generation pipeline
"""

import os
import time
import json
from typing import Dict, List, Any
from datetime import datetime
from slugify import slugify

import openai
from anthropic import Anthropic
import google.generativeai as genai

from models import (
    GenerationOptions, 
    GeneratedArticle, 
    GenerationMetadata,
    FactCheckNote
)
from services.prompts import PromptTemplates
from utils.logging import get_logger

logger = get_logger(__name__)

class AIProcessor:
    def __init__(self):
        self.openai_client = openai.OpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.anthropic_client = Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        
        # Configure Google Gemini
        google_api_key = os.getenv("GOOGLE_API_KEY")
        if google_api_key:
            genai.configure(api_key=google_api_key)
        
        self.primary_model = os.getenv("AI_MODEL_PRIMARY", "gpt-4")
        self.fallback_model = os.getenv("AI_MODEL_FALLBACK", "gpt-3.5-turbo")
        self.summarization_model = os.getenv("AI_MODEL_SUMMARIZATION", "gemini-1.5-flash")
        self.prompts = PromptTemplates()
        
    async def generate_article_pipeline(
        self, 
        topic: str, 
        session_id: int,
        options: GenerationOptions = None
    ) -> Dict[str, Any]:
        """
        Main pipeline for article generation
        
        Steps:
        1. Content Generation
        2. Fact-Checking
        3. Summarization
        4. CMS Formatting
        5. Quality Assessment
        """
        start_time = time.time()
        total_tokens = 0
        total_cost = 0.0
        steps_completed = []
        
        try:
            logger.info(f"Starting article generation pipeline for session {session_id}")
            
            # Step 1: Content Generation
            logger.info("Step 1: Generating article content")
            content_result = await self._generate_content(topic, options)
            total_tokens += content_result["tokens_used"]
            total_cost += content_result["cost"]
            steps_completed.append("content_generation")
            
            raw_content = content_result["content"]
            
            # Step 2: Fact-Checking
            logger.info("Step 2: Fact-checking content")
            factcheck_result = await self._fact_check_content(raw_content, topic)
            total_tokens += factcheck_result["tokens_used"]
            total_cost += factcheck_result["cost"]
            steps_completed.append("fact_checking")
            
            enhanced_content = factcheck_result["enhanced_content"]
            fact_check_notes = factcheck_result["fact_check_notes"]
            
            # Step 3: Summarization
            logger.info("Step 3: Creating summary and key points")
            summary_result = await self._create_summary(enhanced_content, topic)
            total_tokens += summary_result["tokens_used"]
            total_cost += summary_result["cost"]
            steps_completed.append("summarization")
            
            # Step 4: CMS Formatting
            logger.info("Step 4: Formatting for CMS")
            formatted_result = await self._format_for_cms(
                content=enhanced_content,
                summary_data=summary_result,
                topic=topic,
                options=options
            )
            steps_completed.append("cms_formatting")
            
            # Step 5: Quality Assessment
            logger.info("Step 5: Assessing content quality")
            quality_score = await self._assess_quality(
                formatted_result["article"],
                options
            )
            steps_completed.append("quality_assessment")
            
            processing_time = time.time() - start_time
            
            # Create final result
            article = GeneratedArticle(
                title=formatted_result["article"]["title"],
                slug=formatted_result["article"]["slug"],
                content=formatted_result["article"]["content"],
                excerpt=formatted_result["article"]["excerpt"],
                summary=formatted_result["article"]["summary"],
                key_points=formatted_result["article"]["key_points"],
                meta_title=formatted_result["article"]["meta_title"],
                meta_description=formatted_result["article"]["meta_description"],
                fact_check_notes=fact_check_notes,
                quality_metrics=quality_score
            )
            
            metadata = GenerationMetadata(
                model_used=self.primary_model,
                tokens_used=total_tokens,
                processing_time_seconds=processing_time,
                cost_usd=total_cost,
                quality_score=int(quality_score.get("overall_score", 85)),
                steps_completed=steps_completed,
                timestamp=datetime.now()
            )
            
            logger.info(f"Article generation completed successfully for session {session_id}")
            
            return {
                "article": article,
                "metadata": metadata
            }
            
        except Exception as e:
            logger.error(f"Article generation pipeline failed for session {session_id}: {str(e)}")
            raise e
    
    async def generate_recipe_pipeline(
        self, 
        topic: str, 
        session_id: int,
        options: GenerationOptions = None
    ) -> Dict[str, Any]:
        """
        Recipe generation pipeline
        
        Steps:
        1. Recipe Generation
        2. Fact-Checking
        3. Summarization (using Gemini)
        4. CMS Formatting
        5. Quality Assessment
        """
        start_time = time.time()
        total_tokens = 0
        total_cost = 0.0
        steps_completed = []
        
        try:
            logger.info(f"Starting recipe generation pipeline for session {session_id}")
            
            # Step 1: Recipe Generation
            logger.info("Step 1: Generating recipe content")
            content_result = await self._generate_recipe_content(topic, options)
            total_tokens += content_result["tokens_used"]
            total_cost += content_result["cost"]
            steps_completed.append("recipe_generation")
            
            raw_content = content_result["content"]
            
            # Step 2: Fact-Checking (nutritional information)
            logger.info("Step 2: Fact-checking nutritional content")
            factcheck_result = await self._fact_check_content(raw_content, topic)
            total_tokens += factcheck_result["tokens_used"]
            total_cost += factcheck_result["cost"]
            steps_completed.append("fact_checking")
            
            enhanced_content = factcheck_result["enhanced_content"]
            fact_check_notes = factcheck_result["fact_check_notes"]
            
            # Step 3: Summarization (using Gemini)
            logger.info("Step 3: Creating recipe summary using Gemini")
            summary_result = await self._create_summary(enhanced_content, topic)
            total_tokens += summary_result["tokens_used"]
            total_cost += summary_result["cost"]
            steps_completed.append("summarization")
            
            # Step 4: Recipe CMS Formatting
            logger.info("Step 4: Formatting recipe for CMS")
            formatted_result = await self._format_recipe_for_cms(
                content=enhanced_content,
                summary_data=summary_result,
                topic=topic,
                options=options
            )
            steps_completed.append("cms_formatting")
            
            # Step 5: Quality Assessment
            logger.info("Step 5: Assessing recipe quality")
            quality_score = await self._assess_quality(
                formatted_result["recipe"],
                options
            )
            steps_completed.append("quality_assessment")
            
            processing_time = time.time() - start_time
            
            # Create final result
            recipe = GeneratedArticle(  # Reuse model structure
                title=formatted_result["recipe"]["title"],
                slug=formatted_result["recipe"]["slug"],
                content=formatted_result["recipe"]["description"],
                excerpt=formatted_result["recipe"]["description"][:200],
                summary=summary_result.get("summary", ""),
                key_points=summary_result.get("key_points", []),
                meta_title=formatted_result["recipe"]["meta_title"],
                meta_description=formatted_result["recipe"]["meta_description"],
                fact_check_notes=fact_check_notes,
                quality_metrics=quality_score
            )
            
            metadata = GenerationMetadata(
                model_used=self.primary_model,
                tokens_used=total_tokens,
                processing_time_seconds=processing_time,
                cost_usd=total_cost,
                quality_score=int(quality_score.get("overall_score", 85)),
                steps_completed=steps_completed,
                timestamp=datetime.now()
            )
            
            logger.info(f"Recipe generation completed successfully for session {session_id}")
            
            return {
                "article": recipe,  # Using same structure for compatibility
                "recipe_data": formatted_result["recipe"],  # Full recipe data
                "metadata": metadata
            }
            
        except Exception as e:
            logger.error(f"Recipe generation pipeline failed for session {session_id}: {str(e)}")
            raise e
    
    async def _generate_content(self, topic: str, options: GenerationOptions) -> Dict[str, Any]:
        """Step 1: Generate comprehensive article content"""
        try:
            prompt = self.prompts.get_content_generation_prompt(topic, options)
            
            if self.primary_model.startswith("gpt"):
                response = self.openai_client.chat.completions.create(
                    model=self.primary_model,
                    messages=[
                        {"role": "system", "content": "You are an expert nutrition writer."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=3000,
                    temperature=0.7
                )
                
                content = response.choices[0].message.content
                tokens_used = response.usage.total_tokens
                cost = self._calculate_openai_cost(tokens_used, self.primary_model)
                
            else:  # Anthropic Claude
                message = self.anthropic_client.messages.create(
                    model="claude-3-sonnet-20240229",
                    max_tokens=3000,
                    temperature=0.7,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                
                content = message.content[0].text
                tokens_used = message.usage.input_tokens + message.usage.output_tokens
                cost = self._calculate_anthropic_cost(tokens_used)
            
            return {
                "content": content,
                "tokens_used": tokens_used,
                "cost": cost
            }
            
        except Exception as e:
            logger.error(f"Content generation failed: {str(e)}")
            raise e
    
    async def _generate_recipe_content(self, topic: str, options: GenerationOptions) -> Dict[str, Any]:
        """Step 1: Generate comprehensive recipe content"""
        try:
            prompt = self.prompts.get_recipe_generation_prompt(topic, options)
            
            if self.primary_model.startswith("gpt"):
                response = self.openai_client.chat.completions.create(
                    model=self.primary_model,
                    messages=[
                        {"role": "system", "content": "You are a professional chef and nutrition expert specializing in plant-based cooking."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=3000,
                    temperature=0.7
                )
                
                content = response.choices[0].message.content
                tokens_used = response.usage.total_tokens
                cost = self._calculate_openai_cost(tokens_used, self.primary_model)
                
            else:  # Anthropic Claude
                message = self.anthropic_client.messages.create(
                    model="claude-3-sonnet-20240229",
                    max_tokens=3000,
                    temperature=0.7,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                
                content = message.content[0].text
                tokens_used = message.usage.input_tokens + message.usage.output_tokens
                cost = self._calculate_anthropic_cost(tokens_used)
            
            return {
                "content": content,
                "tokens_used": tokens_used,
                "cost": cost
            }
            
        except Exception as e:
            logger.error(f"Recipe generation failed: {str(e)}")
            raise e
    
    async def _fact_check_content(self, content: str, topic: str) -> Dict[str, Any]:
        """Step 2: Fact-check content and add citations"""
        try:
            prompt = self.prompts.get_fact_checking_prompt(content, topic)
            
            if self.primary_model.startswith("gpt"):
                response = self.openai_client.chat.completions.create(
                    model=self.primary_model,
                    messages=[
                        {"role": "system", "content": "You are a fact-checking expert with access to scientific literature."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=2000,
                    temperature=0.3
                )
                
                result = response.choices[0].message.content
                tokens_used = response.usage.total_tokens
                cost = self._calculate_openai_cost(tokens_used, self.primary_model)
                
            else:  # Anthropic Claude
                message = self.anthropic_client.messages.create(
                    model="claude-3-sonnet-20240229",
                    max_tokens=2000,
                    temperature=0.3,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                
                result = message.content[0].text
                tokens_used = message.usage.input_tokens + message.usage.output_tokens
                cost = self._calculate_anthropic_cost(tokens_used)
            
            # Parse fact-checking result
            enhanced_content, fact_check_notes = self._parse_fact_check_result(result)
            
            return {
                "enhanced_content": enhanced_content,
                "fact_check_notes": fact_check_notes,
                "tokens_used": tokens_used,
                "cost": cost
            }
            
        except Exception as e:
            logger.error(f"Fact-checking failed: {str(e)}")
            raise e
    
    async def _create_summary(self, content: str, topic: str) -> Dict[str, Any]:
        """Step 3: Create summary and key points using Gemini"""
        try:
            prompt = self.prompts.get_summarization_prompt(content, topic)
            
            # Use Gemini for summarization if configured
            if self.summarization_model.startswith("gemini") and os.getenv("GOOGLE_API_KEY"):
                try:
                    model = genai.GenerativeModel(self.summarization_model)
                    response = model.generate_content(
                        prompt,
                        generation_config=genai.types.GenerationConfig(
                            max_output_tokens=1000,
                            temperature=0.5,
                        )
                    )
                    
                    result = response.text
                    # Estimate tokens for Gemini (roughly 4 chars per token)
                    tokens_used = len(prompt + result) // 4
                    cost = self._calculate_gemini_cost(tokens_used)
                    
                    logger.info(f"Summary generated using Gemini: {tokens_used} tokens, ${cost:.4f}")
                    
                except Exception as gemini_error:
                    logger.warning(f"Gemini summarization failed, falling back to primary model: {gemini_error}")
                    return await self._create_summary_fallback(prompt)
            
            elif self.primary_model.startswith("gpt"):
                response = self.openai_client.chat.completions.create(
                    model=self.primary_model,
                    messages=[
                        {"role": "system", "content": "You are an expert at creating concise, actionable summaries."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=1000,
                    temperature=0.5
                )
                
                result = response.choices[0].message.content
                tokens_used = response.usage.total_tokens
                cost = self._calculate_openai_cost(tokens_used, self.primary_model)
                
            else:  # Anthropic Claude
                message = self.anthropic_client.messages.create(
                    model="claude-3-sonnet-20240229",
                    max_tokens=1000,
                    temperature=0.5,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                
                result = message.content[0].text
                tokens_used = message.usage.input_tokens + message.usage.output_tokens
                cost = self._calculate_anthropic_cost(tokens_used)
            
            # Parse summary result
            summary_data = self._parse_summary_result(result)
            
            return {
                **summary_data,
                "tokens_used": tokens_used,
                "cost": cost
            }
            
        except Exception as e:
            logger.error(f"Summarization failed: {str(e)}")
            raise e
    
    async def _create_summary_fallback(self, prompt: str) -> Dict[str, Any]:
        """Fallback summarization using primary model"""
        if self.primary_model.startswith("gpt"):
            response = self.openai_client.chat.completions.create(
                model=self.fallback_model,
                messages=[
                    {"role": "system", "content": "You are an expert at creating concise, actionable summaries."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.5
            )
            
            result = response.choices[0].message.content
            tokens_used = response.usage.total_tokens
            cost = self._calculate_openai_cost(tokens_used, self.fallback_model)
            
        else:
            message = self.anthropic_client.messages.create(
                model="claude-3-haiku-20240307",  # Faster/cheaper model for fallback
                max_tokens=1000,
                temperature=0.5,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            result = message.content[0].text
            tokens_used = message.usage.input_tokens + message.usage.output_tokens
            cost = self._calculate_anthropic_cost(tokens_used)
        
        summary_data = self._parse_summary_result(result)
        
        return {
            **summary_data,
            "tokens_used": tokens_used,
            "cost": cost
        }
    
    async def _format_for_cms(
        self, 
        content: str, 
        summary_data: Dict[str, Any], 
        topic: str,
        options: GenerationOptions
    ) -> Dict[str, Any]:
        """Step 4: Format article for CMS database structure"""
        try:
            # Generate title if not present
            title = summary_data.get("title") or self._generate_title_from_topic(topic)
            
            # Generate slug
            slug = slugify(title)
            
            # Create excerpt from summary
            excerpt = summary_data.get("summary", "")[:200] + "..." if len(summary_data.get("summary", "")) > 200 else summary_data.get("summary", "")
            
            # Generate SEO meta data
            meta_title = f"{title} | Lentils & Millets"
            meta_description = excerpt[:160]
            
            article = {
                "title": title,
                "slug": slug,
                "content": content,
                "excerpt": excerpt,
                "summary": summary_data.get("summary", ""),
                "key_points": summary_data.get("key_points", []),
                "meta_title": meta_title,
                "meta_description": meta_description
            }
            
            return {"article": article}
            
        except Exception as e:
            logger.error(f"CMS formatting failed: {str(e)}")
            raise e
    
    async def _format_recipe_for_cms(
        self, 
        content: str, 
        summary_data: Dict[str, Any], 
        topic: str,
        options: GenerationOptions
    ) -> Dict[str, Any]:
        """Step 4: Format recipe for CMS database structure"""
        try:
            # Parse recipe content into structured format
            recipe_data = self._parse_recipe_content(content, topic)
            
            # Generate slug
            slug = slugify(recipe_data["title"])
            
            # Create description from summary
            description = summary_data.get("summary", "")[:300] + "..." if len(summary_data.get("summary", "")) > 300 else summary_data.get("summary", "")
            
            # Generate SEO meta data
            meta_title = f"{recipe_data['title']} | Healthy Recipe | Lentils & Millets"
            meta_description = description[:160]
            
            recipe = {
                "title": recipe_data["title"],
                "slug": slug,
                "description": description,
                "prep_time": recipe_data.get("prep_time", 15),
                "cook_time": recipe_data.get("cook_time", 30),
                "servings": recipe_data.get("servings", 4),
                "difficulty": recipe_data.get("difficulty", "easy"),
                "ingredients": recipe_data.get("ingredients", []),
                "instructions": recipe_data.get("instructions", []),
                "nutritional_highlights": recipe_data.get("nutritional_highlights", []),
                "health_benefits": recipe_data.get("health_benefits", []),
                "dietary_tags": recipe_data.get("dietary_tags", []),
                "meal_type": recipe_data.get("meal_type", "dinner"),
                "calories_per_serving": recipe_data.get("calories_per_serving"),
                "protein_grams": recipe_data.get("protein_grams"),
                "fiber_grams": recipe_data.get("fiber_grams"),
                "meta_title": meta_title,
                "meta_description": meta_description
            }
            
            return {"recipe": recipe}
            
        except Exception as e:
            logger.error(f"Recipe CMS formatting failed: {str(e)}")
            raise e
    
    def _parse_recipe_content(self, content: str, topic: str) -> Dict[str, Any]:
        """Parse generated recipe content into structured data"""
        try:
            # Simple parsing logic - in production, this would be more sophisticated
            lines = content.split('\n')
            recipe_data = {
                "title": self._generate_title_from_topic(topic),
                "prep_time": 15,
                "cook_time": 30,
                "servings": 4,
                "difficulty": "easy",
                "ingredients": [],
                "instructions": [],
                "nutritional_highlights": [],
                "health_benefits": [],
                "dietary_tags": ["vegan", "gluten-free"],
                "meal_type": "dinner"
            }
            
            current_section = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Extract title
                if line.startswith('#') and not recipe_data.get("title_extracted"):
                    recipe_data["title"] = line.replace('#', '').strip()
                    recipe_data["title_extracted"] = True
                
                # Extract timing information
                if "prep time:" in line.lower():
                    try:
                        time_str = line.lower().split("prep time:")[-1].strip()
                        recipe_data["prep_time"] = int(''.join(filter(str.isdigit, time_str)))
                    except:
                        pass
                
                if "cook time:" in line.lower():
                    try:
                        time_str = line.lower().split("cook time:")[-1].strip()
                        recipe_data["cook_time"] = int(''.join(filter(str.isdigit, time_str)))
                    except:
                        pass
                
                if "servings:" in line.lower():
                    try:
                        servings_str = line.lower().split("servings:")[-1].strip()
                        recipe_data["servings"] = int(''.join(filter(str.isdigit, servings_str)))
                    except:
                        pass
                
                # Section detection
                if "ingredients" in line.lower():
                    current_section = "ingredients"
                elif "instructions" in line.lower():
                    current_section = "instructions"
                elif "nutritional" in line.lower() or "nutrition" in line.lower():
                    current_section = "nutritional_highlights"
                elif "health benefits" in line.lower():
                    current_section = "health_benefits"
                elif line.startswith('-') or line.startswith('•'):
                    # Add to current section
                    item = line[1:].strip()
                    if current_section and item:
                        recipe_data[current_section].append(item)
            
            return recipe_data
            
        except Exception as e:
            logger.error(f"Failed to parse recipe content: {str(e)}")
            # Return basic structure if parsing fails
            return {
                "title": self._generate_title_from_topic(topic),
                "prep_time": 15,
                "cook_time": 30,
                "servings": 4,
                "difficulty": "easy",
                "ingredients": [],
                "instructions": [],
                "nutritional_highlights": [],
                "health_benefits": [],
                "dietary_tags": ["plant-based"],
                "meal_type": "dinner"
            }
    
    async def _assess_quality(self, article: Dict[str, Any], options: GenerationOptions) -> Dict[str, float]:
        """Step 5: Assess content quality"""
        try:
            metrics = {}
            
            # Content completeness (word count vs target)
            word_count = len(article["content"].split())
            target_length = options.target_length if options else 1500
            completeness = min(100, (word_count / target_length) * 100)
            metrics["completeness_score"] = completeness
            
            # Readability score (simplified)
            sentences = article["content"].count('.')
            words = len(article["content"].split())
            avg_sentence_length = words / max(sentences, 1)
            readability = max(0, 100 - (avg_sentence_length - 15) * 2)
            metrics["readability_score"] = readability
            
            # Structure score (based on headings)
            heading_count = article["content"].count('#')
            structure_score = min(100, heading_count * 20)
            metrics["structure_score"] = structure_score
            
            # Overall score (weighted average)
            overall = (completeness * 0.3 + readability * 0.3 + structure_score * 0.4)
            metrics["overall_score"] = overall
            
            return metrics
            
        except Exception as e:
            logger.error(f"Quality assessment failed: {str(e)}")
            return {"overall_score": 75.0}  # Default score
    
    def _generate_title_from_topic(self, topic: str) -> str:
        """Generate article title from topic"""
        # Simple title generation logic
        words = topic.split()
        if len(words) <= 3:
            return f"{topic.title()}: Complete Guide"
        else:
            return topic.title()
    
    def _parse_fact_check_result(self, result: str) -> tuple:
        """Parse fact-checking result into content and notes"""
        try:
            # Simple parsing - in production, use more sophisticated parsing
            lines = result.split('\n')
            content_lines = []
            fact_notes = {}
            
            for line in lines:
                if line.startswith('[FACT-CHECK]:'):
                    # Extract fact-checking note
                    note = line.replace('[FACT-CHECK]:', '').strip()
                    fact_notes[f"note_{len(fact_notes)}"] = note
                else:
                    content_lines.append(line)
            
            enhanced_content = '\n'.join(content_lines)
            
            return enhanced_content, fact_notes
            
        except Exception as e:
            logger.error(f"Failed to parse fact-check result: {str(e)}")
            return result, {}
    
    def _parse_summary_result(self, result: str) -> Dict[str, Any]:
        """Parse summary result into structured data"""
        try:
            lines = result.split('\n')
            summary_data = {
                "summary": "",
                "key_points": [],
                "title": ""
            }
            
            current_section = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                if line.startswith('SUMMARY:'):
                    current_section = "summary"
                    summary_data["summary"] = line.replace('SUMMARY:', '').strip()
                elif line.startswith('KEY POINTS:'):
                    current_section = "key_points"
                elif line.startswith('TITLE:'):
                    summary_data["title"] = line.replace('TITLE:', '').strip()
                elif line.startswith('-') and current_section == "key_points":
                    summary_data["key_points"].append(line[1:].strip())
                elif current_section == "summary" and not summary_data["summary"]:
                    summary_data["summary"] = line
            
            return summary_data
            
        except Exception as e:
            logger.error(f"Failed to parse summary result: {str(e)}")
            return {"summary": result[:200], "key_points": [], "title": ""}
    
    def _calculate_openai_cost(self, tokens: int, model: str) -> float:
        """Calculate cost for OpenAI API usage"""
        # Pricing as of 2024 (per 1K tokens)
        pricing = {
            "gpt-4": {"input": 0.03, "output": 0.06},
            "gpt-3.5-turbo": {"input": 0.0015, "output": 0.002}
        }
        
        model_key = "gpt-4" if model.startswith("gpt-4") else "gpt-3.5-turbo"
        # Simplified calculation - assume 70% input, 30% output
        input_tokens = int(tokens * 0.7)
        output_tokens = int(tokens * 0.3)
        
        cost = (input_tokens / 1000 * pricing[model_key]["input"] + 
                output_tokens / 1000 * pricing[model_key]["output"])
        
        return round(cost, 4)
    
    def _calculate_anthropic_cost(self, tokens: int) -> float:
        """Calculate cost for Anthropic API usage"""
        # Claude pricing (per 1K tokens) - simplified
        cost_per_1k = 0.008  # Average cost
        return round((tokens / 1000) * cost_per_1k, 4)
    
    def _calculate_gemini_cost(self, tokens: int) -> float:
        """Calculate cost for Google Gemini API usage"""
        # Gemini Pro pricing (as of 2024)
        # Free tier: 15 RPM, 32K TPM, 1M tokens per day
        # Paid tier: $0.0005 per 1K tokens (input), $0.0015 per 1K tokens (output)
        
        # Simplified calculation - assume 70% input, 30% output
        input_tokens = int(tokens * 0.7)
        output_tokens = int(tokens * 0.3)
        
        input_cost = (input_tokens / 1000) * 0.0005
        output_cost = (output_tokens / 1000) * 0.0015
        
        total_cost = input_cost + output_cost
        return round(total_cost, 4)